import { prisma } from "@/lib/prisma";
import { getImportHistoryById } from "./importHistory";
import { ImportHistoryEntry } from "./importHistory";

export interface RollbackResult {
  success: boolean;
  message: string;
  rolledBackProducts: number;
  errors: string[];
}

export interface RollbackOptions {
  importId: string;
  rollbackStrategy: "all" | "failed_only" | "selective";
  confirmRollback: boolean;
  backupBeforeRollback: boolean;
}

/**
 * Rollback functionality for failed imports
 * This allows administrators to undo import changes and restore the database
 */
export class ImportRollback {
  private importId: string;
  private importEntry: ImportHistoryEntry | null = null;

  constructor(importId: string) {
    this.importId = importId;
  }

  async rollback() {
    if (!this.importId) {
      throw new Error("Import ID is required for rollback");
    }

    // Get import history entry
    this.importEntry = await getImportHistoryById(this.importId);

    if (!this.importEntry) {
      throw new Error("Import history not found");
    }

    console.log("🔄 Starting rollback for import:", this.importId);

    try {
      // Step 1: Find products imported in this session
      const importedProducts = await prisma.product.findMany({
        where: {
          // Use createdAt to find products imported around the same time
          createdAt: {
            gte: new Date(this.importEntry.createdAt.getTime() - 60000), // 1 minute before
            lte: new Date(this.importEntry.createdAt.getTime() + 60000), // 1 minute after
          },
        },
      });

      console.log(`📦 Found ${importedProducts.length} products to rollback`);

      if (importedProducts.length === 0) {
        console.log("⚠️ No products found to rollback");
        return {
          success: true,
          message: "No products found to rollback",
          entitiesRestored: 0,
        };
      }

      // Step 2: Delete imported products
      const deleteResult = await prisma.product.deleteMany({
        where: {
          id: {
            in: importedProducts.map((p) => p.id),
          },
        },
      });

      console.log(`🗑️ Deleted ${deleteResult.count} products`);

      // Step 3: Update import history
      await prisma.importHistory.update({
        where: { id: this.importId },
        data: {
          importedRows: 0,
          failedRows: this.importEntry.totalRows,
          errors: ["Rollback completed - all imported products deleted"],
        },
      });

      console.log("✅ Rollback completed successfully");

      return {
        success: true,
        message: `Successfully rolled back ${deleteResult.count} products`,
        entitiesRestored: deleteResult.count,
      };
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      throw new Error(`Rollback failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async createBackup() {
    if (!this.importId) {
      throw new Error("Import ID is required for backup");
    }

    console.log("💾 Creating backup for import:", this.importId);

    try {
      // Get import history entry
      const importEntry = await getImportHistoryById(this.importId);
      if (!importEntry) {
        throw new Error("Import history not found");
      }

      // Find products imported in this session
      const importedProducts = await prisma.product.findMany({
        where: {
          createdAt: {
            gte: new Date(importEntry.createdAt.getTime() - 60000),
            lte: new Date(importEntry.createdAt.getTime() + 60000),
          },
        },
      });

      console.log(`📦 Found ${importedProducts.length} products to backup`);

      if (importedProducts.length === 0) {
        console.log("⚠️ No products found to backup");
        return {
          success: true,
          message: "No products found to backup",
          backupId: null,
        };
      }

      // Create snapshot
      const snapshot = await prisma.importSnapshot.create({
        data: {
          importId: this.importId,
          entityType: importEntry.entityType,
          snapshotData: importedProducts,
        },
      });

      console.log("✅ Backup created successfully:", snapshot.id);

      return {
        success: true,
        message: `Backup created for ${importedProducts.length} products`,
        backupId: snapshot.id,
      };
    } catch (error) {
      console.error("❌ Backup creation failed:", error);
      throw new Error(`Backup creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
