import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email/mailer";
import { ORDER_EMAIL_KINDS, type OrderEmailKind, type OrderEmailPayload } from "@/lib/email/types";

function isKind(value: string): value is OrderEmailKind {
  return (ORDER_EMAIL_KINDS as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const secret = process.env.ORDER_EMAIL_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Order email secret is not configured." }, { status: 503 });
  }

  const header = request.headers.get("x-atelier-secret") ?? "";
  if (header !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<OrderEmailPayload>;
    const kind = String(body.kind ?? "");
    const to = String(body.to ?? "").trim();
    const name = String(body.name ?? "").trim();
    const orderId = String(body.orderId ?? "").trim();

    if (!isKind(kind) || !to || !name || !orderId) {
      return NextResponse.json(
        { error: "kind, to, name, and orderId are required." },
        { status: 400 },
      );
    }

    const result = await sendOrderEmail({
      kind,
      to,
      name,
      orderId,
      pieces: body.pieces,
      amount: body.amount,
      trackingCourier: body.trackingCourier,
      trackingUrl: body.trackingUrl,
      fulfilment: body.fulfilment,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send this letter.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
