import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        customerPrices: {
          include: {
            customer: true,
          },
        },
        reviews: {
          where: {
            status: "APPROVED",
          },
          include: {
            customer: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get review statistics
    const reviewStats = await prisma.review.groupBy({
      by: ["productId"],
      where: {
        productId: id,
        status: "APPROVED",
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    const reviewData = reviewStats.length > 0 && reviewStats[0] && reviewStats[0]._avg?.rating !== null
      ? {
          averageRating: reviewStats[0]._avg.rating || 0,
          totalReviews: reviewStats[0]._count.id,
        }
      : { averageRating: 0, totalReviews: 0 };

    return NextResponse.json({
      ...product,
      reviewData,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
