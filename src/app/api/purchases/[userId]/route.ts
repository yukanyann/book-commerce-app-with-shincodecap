import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//購入履歴検索API
export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params?.userId;

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
