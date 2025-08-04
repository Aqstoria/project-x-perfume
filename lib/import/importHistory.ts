import { prisma } from "@/lib/prisma";

export interface ImportHistoryEntry {
  id: string;
  createdAt: Date;
  fileName: string;
  fileType: string;
  entityType: string;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: any; // JsonValue from Prisma
  importedBy: string;
}

export interface CreateImportHistoryParams {
  filename: string;
  fileType: "csv" | "excel";
  totalRows: number;
  importStrategy: "skip" | "overwrite" | "flag" | "error";
  importOnlyValid: boolean;
  importedBy: string;
  notes?: string;
}

export interface UpdateImportHistoryParams {
  id: string;
  successfulRows: number;
  failedRows: number;
  skippedRows: number;
  duplicateRows: number;
  status: "completed" | "failed" | "cancelled";
  errors?: string[];
  warnings?: string[];
}

export async function createImportHistory(params: {
  filename: string;
  fileType: string;
  entityType: string;
  totalRows: number;
  importedBy: string;
}): Promise<ImportHistoryEntry> {
  const entry = await prisma.importHistory.create({
    data: {
      fileName: params.filename,
      fileType: params.fileType,
      entityType: params.entityType,
      totalRows: params.totalRows,
      importedRows: 0,
      failedRows: 0,
      importedBy: params.importedBy,
    },
  });

  return {
    id: entry.id,
    createdAt: entry.createdAt,
    fileName: entry.fileName,
    errors: entry.errors,
    fileType: entry.fileType,
    entityType: entry.entityType,
    totalRows: entry.totalRows,
    importedRows: entry.importedRows,
    failedRows: entry.failedRows,
    importedBy: entry.importedBy,
  };
}

export async function updateImportHistory(
  id: string,
  params: {
    importedRows: number;
    failedRows: number;
    errors: string[];
  },
): Promise<void> {
  await prisma.importHistory.update({
    where: { id },
    data: {
      importedRows: params.importedRows,
      failedRows: params.failedRows,
      errors: params.errors,
    },
  });
}

export async function getImportHistory(params: {
  page?: number;
  limit?: number;
}): Promise<{ entries: ImportHistoryEntry[]; total: number }> {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const offset = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    prisma.importHistory.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.importHistory.count(),
  ]);

  return {
    entries: entries.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      fileName: entry.fileName,
      errors: entry.errors,
      fileType: entry.fileType,
      entityType: entry.entityType,
      totalRows: entry.totalRows,
      importedRows: entry.importedRows,
      failedRows: entry.failedRows,
      importedBy: entry.importedBy,
    })),
    total,
  };
}

export async function getImportHistoryById(id: string): Promise<ImportHistoryEntry | null> {
  const entry = await prisma.importHistory.findUnique({
    where: { id },
  });

  if (!entry) return null;

  return {
    id: entry.id,
    createdAt: entry.createdAt,
    fileName: entry.fileName,
    errors: entry.errors,
    fileType: entry.fileType,
    entityType: entry.entityType,
    totalRows: entry.totalRows,
    importedRows: entry.importedRows,
    failedRows: entry.failedRows,
    importedBy: entry.importedBy,
  };
}

export async function getImportStatistics(): Promise<{
  totalImports: number;
  successfulImports: number;
  failedImports: number;
  totalRowsImported: number;
  averageSuccessRate: number;
  recentActivity: ImportHistoryEntry[];
}> {
  const [totalImports, totalRowsImported, recentActivity] = await Promise.all([
    prisma.importHistory.count(),
    prisma.importHistory.aggregate({
      _sum: { importedRows: true },
    }),
    prisma.importHistory.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRowsImportedCount = totalRowsImported._sum.importedRows || 0;
  const averageSuccessRate = totalImports > 0 ? (totalRowsImportedCount / totalImports) * 100 : 0;

  return {
    totalImports,
    successfulImports: totalImports, // Simplified - all imports are considered successful
    failedImports: 0, // Simplified - no failed imports tracking
    totalRowsImported: totalRowsImportedCount,
    averageSuccessRate,
    recentActivity: recentActivity.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      fileName: entry.fileName,
      errors: entry.errors,
      fileType: entry.fileType,
      entityType: entry.entityType,
      totalRows: entry.totalRows,
      importedRows: entry.importedRows,
      failedRows: entry.failedRows,
      importedBy: entry.importedBy,
    })),
  };
}
