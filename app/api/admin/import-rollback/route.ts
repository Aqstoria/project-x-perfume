import { NextRequest, NextResponse } from "next/server";
import { ImportRollback } from "@/lib/import/importRollback";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const importId = searchParams.get("importId");

    if (!importId) {
      return NextResponse.json({ error: "Import ID is required" }, { status: 400 });
    }

    // Get rollback preview
    const preview = {
      totalProducts: 0,
      productsToRollback: 0,
      estimatedImpact: "Unknown",
      warnings: ["Preview not available"],
    };

    return NextResponse.json({ preview });
  } catch (error) {
    console.error("Error getting rollback preview:", error);
    return NextResponse.json(
      { error: "Failed to get rollback preview" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { importId } = await request.json();

    if (!importId) {
      return NextResponse.json({ error: "Import ID is required" }, { status: 400 });
    }

    const rollback = new ImportRollback(importId);

    // Execute rollback
    const result = await rollback.rollback();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Rollback error:", error);
    return NextResponse.json(
      { error: "Rollback failed" },
      { status: 500 }
    );
  }
}
