import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log(" Testing database connection...");
    console.log(" DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log(" Database connection successful:", result);
    
    return NextResponse.json({
      status: "success",
      message: "Database connection working",
      test: result,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set"
    });
    
  } catch (error) {
    console.error(" Database connection failed:", error);
    console.error(" Error details:", error instanceof Error ? error.message : "Unknown error");
    
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
