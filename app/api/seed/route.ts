import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(_request: NextRequest) {
  console.log(" Starting database seeding...");
  console.log(" DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
  try {
    // Check if users already exist
    const existingUsers = await prisma.user.findMany();
    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        message: "Database already seeded", 
        users: existingUsers.length 
      });
    }

    // Hash password for admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create customers first
    const customer = await prisma.customer.create({
      data: {
        name: "Parfum Groothandel BV",
        email: "klant@parfumrijk.com",
        phone: "+31201234567",
        address: "Parfumstraat 1, 1000 AB Amsterdam",
        generalMargin: 15.0,
        minimumOrderValue: 100.0,
        minimumOrderItems: 5,
      },
    });

    // Create users with customer relationship
    const admin = await prisma.user.create({
      data: {
        username: "mkalleche@gmail.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    const buyer = await prisma.user.create({
      data: {
        username: "buyer",
        password: await bcrypt.hash("buyer123", 10),
        role: UserRole.BUYER,
        customerId: customer.id,
      },
    });

    return NextResponse.json({
      message: "Database seeded successfully!",
      created: {
        admin: admin.username,
        buyer: buyer.username,
        customer: customer.name
      }
    });

  } catch (error) {
    console.error(" Seeding error:", error);
    console.error(" Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error(" Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error(" Database status check error:", error);
    console.error(" Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error(" Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  console.log(" Checking database status...");
  console.log(" DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
  try {
    const userCount = await prisma.user.count();
    const customerCount = await prisma.customer.count();
    const productCount = await prisma.product.count();

    return NextResponse.json({
      status: "Database status",
      users: userCount,
      customers: customerCount,
      products: productCount,
      isSeeded: userCount > 0
    });
  } catch (error) {
    console.error(" Seeding error:", error);
    console.error(" Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error(" Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error(" Database status check error:", error);
    console.error(" Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error(" Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { error: "Failed to check database status" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
