import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log(" Starting database migration...");
    
    // Run Prisma migrate deploy
    const { stdout, stderr } = await execAsync("npx prisma migrate deploy");
    
    console.log(" Migration output:", stdout);
    if (stderr) console.log(" Migration warnings:", stderr);
    
    return NextResponse.json({
      status: "success",
      message: "Database migration completed",
      output: stdout
    });
    
  } catch (error) {
    console.error(" Migration failed:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Database migration failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log(" Checking database schema...");
    
    // Check if tables exist
    const { stdout } = await execAsync("npx prisma db pull --print");
    
    return NextResponse.json({
      status: "success",
      message: "Database schema check completed",
      schema: stdout
    });
    
  } catch (error) {
    console.error(" Schema check failed:", error);
    
    return NextResponse.json({
      status: "error", 
      message: "Database schema check failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
