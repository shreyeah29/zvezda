import crypto from "crypto";
import { NextResponse } from "next/server";
import { getRazorpayKeys } from "@/lib/razorpay";
import { sendOrderEmail } from "@/lib/email/mailer";
import { formatPrice } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      customer?: { fullName?: string; email?: string };
      pieces?: Array<{ name?: string; size?: string; quantity?: number }>;
      amount?: number;
    };

    const orderId = String(body.razorpay_order_id ?? "");
    const paymentId = String(body.razorpay_payment_id ?? "");
    const signature = String(body.razorpay_signature ?? "");

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const { keySecret } = getRazorpayKeys();
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expected !== signature) {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
    }

    const email = String(body.customer?.email ?? "").trim();
    const name = String(body.customer?.fullName ?? "").trim();
    if (email) {
      try {
        await sendOrderEmail({
          kind: "order-placed",
          to: email,
          name: name || "there",
          orderId,
          pieces: (body.pieces ?? []).map((piece) => ({
            name: String(piece.name ?? "Piece"),
            size: piece.size ? String(piece.size) : undefined,
            quantity: Number(piece.quantity) || 1,
          })),
          amount: typeof body.amount === "number" && body.amount > 0 ? formatPrice(body.amount, "INR") : undefined,
        });
      } catch (error) {
        console.error("Order confirmation email failed", orderId, error);
      }
    }

    return NextResponse.json({
      ok: true,
      orderId,
      paymentId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify payment.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
