import { NextResponse } from "next/server";
import {
  createStoreReservationId,
  formatStoreReservationMessage,
  quoteStoreCart,
  validateStoreCustomer,
  type CheckoutCartItem,
} from "@/lib/checkout";
import { notifyAtelier } from "@/lib/notifyAtelier";
import { sendOrderEmail } from "@/lib/email/mailer";
import { formatPrice } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: CheckoutCartItem[];
      customer?: Parameters<typeof validateStoreCustomer>[0];
    };

    const customer = validateStoreCustomer(body.customer ?? {});
    const quote = quoteStoreCart(body.items ?? []);
    const reservationId = createStoreReservationId();
    const message = formatStoreReservationMessage({ reservationId, customer, quote });
    let notified = true;

    try {
      await notifyAtelier({
        subject: `Pay at store — ${reservationId}`,
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        message,
      });
    } catch (error) {
      notified = false;
      console.error("Pay-at-store notification failed", reservationId, error);
    }

    try {
      await sendOrderEmail({
        kind: "visit-reserved",
        to: customer.email,
        name: customer.fullName,
        orderId: reservationId,
        pieces: quote.lines.map((line) => ({
          name: line.name,
          size: line.size,
          quantity: line.quantity,
        })),
        amount: quote.subtotal > 0 ? formatPrice(quote.subtotal, "INR") : undefined,
        visitWhen: customer.notes,
      });
    } catch (error) {
      console.error("Visit reservation email failed", reservationId, error);
    }

    console.info("Pay-at-store reservation", reservationId, customer.email, quote.lines);

    return NextResponse.json({
      ok: true,
      notified,
      reservationId,
      customer,
      quote,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reserve this visit.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
