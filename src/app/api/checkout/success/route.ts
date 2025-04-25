import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//購入履歴の保存
export async function POST(request: Request) {
  const { sessionId } = await request.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.client_reference_id ?? ""; // デフォルト値を設定
    const bookId = session.metadata?.bookId ?? "";

    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: userId,
        bookId: bookId,
      },
    });

    // 既に購入履歴が存在する場合は、新たに作成しない
    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id ?? "",
          bookId: bookId,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      // 既に購入履歴が存在する場合の処理
      return NextResponse.json({ message: "Purchase already recorded" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "不明なエラーが発生しました" },
      { status: 500 }
    );
  }
}
