import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma"; // Removed since not used

// TODO: This route is disabled because userNotification model doesn't exist in the schema
// Need to add notification functionality to the schema first
export async function POST(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const { id } = await params; // Not used since functionality is disabled
    // const userId = session.user?.id; // Not used since functionality is disabled

    // Mark notification as read
    // await prisma.userNotification.updateMany({
    //   where: {
    //     id,
    //     userId,
    //   },
    //   data: {
    //     isRead: true,
    //   },
    // });

    return NextResponse.json({ success: true, message: "Notification functionality not implemented yet" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}
