import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//購入履歴検索API
export async function GET(
  _request: NextRequest,
  context: { params: { userId: string } }
) {
  const userId = context.params.userId;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });
    return NextResponse.json(purchases);
  } catch (err) {
    console.error(err);
    // エラーオブジェクトを適切な形式で返す
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
