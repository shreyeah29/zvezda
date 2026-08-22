import { NextResponse } from "next/server";
import { quoteCheckoutCart, validateCustomer, type CheckoutCartItem } from "@/lib/checkout";
import { getPublicRazorpayKey, getRazorpayClient } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: CheckoutCartItem[];
      customer?: Parameters<typeof validateCustomer>[0];
    };

    const customer = validateCustomer(body.customer ?? {});
    const quote = quoteCheckoutCart(body.items ?? []);

    if (quote.amountPaise < 100) {
      return NextResponse.json({ error: "Order total is too small to charge." }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: quote.amountPaise,
      currency: quote.currency,
      receipt: `zvezda_${Date.now()}`.slice(0, 40),
      notes: {
        name: customer.fullName.slice(0, 256),
        email: customer.email.slice(0, 256),
        phone: customer.phone.slice(0, 256),
        city: customer.city.slice(0, 256),
        pieces: quote.lines.map((line) => line.slug).join(",").slice(0, 256),
      },
    });

    return NextResponse.json({
      keyId: getPublicRazorpayKey(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      quote,
      customer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
