import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//購入履歴検索API
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;
    console.log("userId:", userId);
    if (!userId) {
      console.error("UserId not provided");
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    console.log("Attempting to fetch purchases for userId:", userId);

    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    console.log("Found purchases:", purchases);

    if (!purchases || purchases.length === 0) {
      return NextResponse.json(
        { message: "No purchases found" },
        { status: 200 }
      );
    }

    return NextResponse.json(purchases);
  } catch (err) {
    console.error("Error in GET /api/purchases/[userId]:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch purchases",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
