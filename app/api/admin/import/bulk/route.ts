import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

// Validation schemas
const productImportSchema = z.object({
  name: z
    .string()
    .min(1, "Productnaam is verplicht")
    .max(100, "Productnaam mag maximaal 100 tekens zijn"),
  brand: z.string().min(1, "Merk is verplicht").max(50, "Merk mag maximaal 50 tekens zijn"),
  content: z.string().min(1, "Inhoud is verplicht"),
  ean: z.string().regex(/^\d{13}$/, "EAN moet exact 13 cijfers bevatten"),
  purchasePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Inkoopprijs moet een geldig bedrag zijn"),
  retailPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Verkoopprijs moet een geldig bedrag zijn"),
  stockQuantity: z.string().regex(/^\d+$/, "Voorraad moet een geheel getal zijn"),
  maxOrderableQuantity: z.string().optional(),
  starRating: z
    .string()
    .regex(/^[0-5]$/, "Sterrenrating moet tussen 0-5 zijn")
    .optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
});

const importRequestSchema = z.object({
  data: z.array(z.record(z.string())),
  columnMapping: z.record(z.string()),
  overwriteExisting: z.boolean().default(false),
  validateData: z.boolean().default(true),
});

interface ImportError {
  row: number;
  field: string;
  message: string;
  data: Record<string, unknown>;
}

interface ImportWarning {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  processingTime: number;
  importId?: string; // Added importId to the interface
}

// Process a single product row
async function processProductRow(
  row: Record<string, unknown>,
  columnMapping: Record<string, string>,
  rowIndex: number,
): Promise<{ success: boolean; error?: ImportError; warning?: ImportWarning }> {
  try {
    // Map CSV columns to product fields
    const mappedData: Record<string, unknown> = {};

    for (const [productField, csvColumn] of Object.entries(columnMapping)) {
      if (csvColumn && row[csvColumn] !== undefined) {
        mappedData[productField] = row[csvColumn];
      }
    }

    // Validate the mapped data
    const validatedData = productImportSchema.parse(mappedData);

    // Transform data for Prisma
    const productData = {
      name: validatedData.name,
      brand: validatedData.brand,
      content: validatedData.content,
      ean: validatedData.ean,
      purchasePrice: new Decimal(validatedData.purchasePrice),
      retailPrice: new Decimal(validatedData.retailPrice),
      stockQuantity: parseInt(validatedData.stockQuantity),
      maxOrderableQuantity: validatedData.maxOrderableQuantity
        ? parseInt(validatedData.maxOrderableQuantity)
        : null,
      starRating: validatedData.starRating ? parseInt(validatedData.starRating) : 0,
      category: validatedData.category || null,
      subcategory: validatedData.subcategory || null,
      description: validatedData.description || null,
      tags: validatedData.tags
        ? validatedData.tags.split(",").map((tag: string) => tag.trim())
        : [],
    };

    // Check if product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { ean: productData.ean },
    });

    if (existingProduct) {
      return {
        success: false,
        error: {
          row: rowIndex + 1,
          field: "ean",
          message: `Product met EAN ${productData.ean} bestaat al`,
          data: productData,
        },
      };
    }

    // Create the product
    await prisma.product.create({
      data: productData,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          row: rowIndex + 1,
          field: error.issues[0]?.path?.join?.(".") ?? "unknown",
          message: error.issues[0]?.message ?? "Ongeldige data",
          data: (row as Record<string, unknown>) || {},
        },
      };
    }

    return {
      success: false,
      error: {
        row: rowIndex + 1,
        field: "unknown",
        message: error instanceof Error ? error.message : "Onbekende fout",
        data: (row as Record<string, unknown>) || {},
      },
    };
  }
}

// Process data in batches
async function processBatch(
  batch: Record<string, unknown>[],
  columnMapping: Record<string, string>,
  startIndex: number,
): Promise<{
  successful: number;
  failed: number;
  errors: ImportError[];
  warnings: ImportWarning[];
}> {
  const results = await Promise.allSettled(
    batch.map((row, index) => processProductRow(row, columnMapping, startIndex + index)),
  );

  let successful = 0;
  let failed = 0;
  const errors: ImportError[] = [];
  const warnings: ImportWarning[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      if (result.value.success) {
        successful++;
      } else {
        failed++;
        if (result.value.error) {
          errors.push(result.value.error);
        }
        if (result.value.warning) {
          warnings.push(result.value.warning);
        }
      }
    } else {
      failed++;
      errors.push({
        row: startIndex + index + 1,
        field: "unknown",
        message: "Onbekende fout tijdens verwerking",
        data: {},
      });
    }
  });

  return { successful, failed, errors, warnings };
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const columnMapping = JSON.parse(formData.get("columnMapping") as string);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Parse the file
    const data = await parseFile(file);
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data found in file" }, { status: 400 });
    }

    const startTime = Date.now();

    // Process data in batches
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    let totalSuccessful = 0;
    let totalFailed = 0;
    const allErrors: ImportError[] = [];
    const allWarnings: ImportWarning[] = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const startIndex = i * batchSize;
      const result = await processBatch(batch, columnMapping, startIndex);

      totalSuccessful += result.successful;
      totalFailed += result.failed;
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    const processingTime = Date.now() - startTime;

    // Create import record
    const importRecord = await prisma.importHistory.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        totalRows: data.length,
        successfulRows: totalSuccessful,
        failedRows: totalFailed,
        processingTime,
        status: totalFailed === 0 ? "SUCCESS" : totalSuccessful === 0 ? "FAILED" : "PARTIAL",
        errors: allErrors.length > 0 ? JSON.stringify(allErrors) : null,
        warnings: allWarnings.length > 0 ? JSON.stringify(allWarnings) : null,
      },
    });

    return NextResponse.json({
      success: true,
      totalRows: data.length,
      successfulRows: totalSuccessful,
      failedRows: totalFailed,
      errors: allErrors,
      warnings: allWarnings,
      processingTime,
      importId: importRecord.id,
    });
  } catch (error) {
    console.error("Error processing bulk import:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid import data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process import",
      },
      { status: 500 },
    );
  }
}
