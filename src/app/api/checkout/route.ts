import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request, response: Response) {
  const { title, price, bookId, userId } = await request.json();
  console.log(title, price);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000",

      client_reference_id: String(userId),
      metadata: {
        bookId: String(bookId),
      },
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
