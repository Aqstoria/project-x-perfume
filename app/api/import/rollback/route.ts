import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Zod schema for rollback request
const rollbackSchema = z.object({
  importId: z.string().min(1, "Import ID is required"),
  rollbackReason: z.string().optional(),
});

export async function POST(_request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await _request.json();
    const validatedData = rollbackSchema.parse(body);
    const { importId, rollbackReason } = validatedData;

    // Get import history and verify it exists
    const importHistory = await prisma.importHistory.findUnique({
      where: { id: importId },
      include: {
        snapshots: true,
        rollbacks: true,
      },
    });

    if (!importHistory) {
      return NextResponse.json({ error: "Import not found" }, { status: 404 });
    }

    // Check if rollback already exists
    if (importHistory.rollbacks.length > 0) {
      return NextResponse.json(
        { error: "Rollback already performed for this import" },
        { status: 400 },
      );
    }

    // Get the latest snapshot for this import
    const snapshot = importHistory.snapshots[0];
    if (!snapshot) {
      return NextResponse.json({ error: "No snapshot found for rollback" }, { status: 404 });
    }

    // Perform rollback in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let entitiesRestored = 0;

      // Delete all products imported in this session
      if (importHistory.entityType === "Product") {
        const deletedProducts = await tx.product.deleteMany({
          where: {
            createdAt: {
              gte: importHistory.createdAt,
            },
          },
        });
        entitiesRestored = deletedProducts.count;
      }

      // Restore from snapshot if available
      if (snapshot.snapshotData && Array.isArray(snapshot.snapshotData)) {
        for (const entityData of snapshot.snapshotData) {
          if (importHistory.entityType === "Product") {
            if (entityData) {
              const productData = entityData as any;
              await tx.product.create({
                data: {
                  id: productData.id,
                  name: productData.name,
                  brand: productData.brand,
                  content: productData.content,
                  ean: productData.ean,
                  purchasePrice: productData.purchasePrice,
                  retailPrice: productData.retailPrice,
                  stockQuantity: productData.stockQuantity,
                  maxOrderableQuantity: productData.maxOrderableQuantity,
                  starRating: productData.starRating,
                  category: productData.category,
                  subcategory: productData.subcategory,
                  description: productData.description,
                  tags: productData.tags,
                  status: productData.status,
                  isActive: productData.isActive,
                  createdAt: productData.createdAt,
                  updatedAt: productData.updatedAt,
                },
              });
              entitiesRestored++;
            }
          }
        }
      }

      // Create rollback record
      const rollback = await tx.importRollback.create({
        data: {
          importId,
          rolledBackBy: session.user.id,
          entitiesRestored,
          rollbackReason: rollbackReason || null,
        },
      });

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "ROLLBACK",
          entity: "Import",
          entityId: importId,
          details: {
            importId,
            entityType: importHistory.entityType,
            entitiesRestored,
            rollbackReason,
            fileName: importHistory.fileName,
          },
          ipAddress: _request.headers.get("x-forwarded-for") || "unknown",
          userAgent: _request.headers.get("user-agent"),
        },
      });

      return { rollback, entitiesRestored };
    });

    return NextResponse.json({
      success: true,
      message: `Rollback completed successfully. ${result.entitiesRestored} entities restored.`,
      rollback: result.rollback,
    });
  } catch (error) {
    console.error("Rollback error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
