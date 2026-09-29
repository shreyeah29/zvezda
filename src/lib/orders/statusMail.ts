import { sendOrderEmail } from "@/lib/email/mailer";
import type { OrderEmailKind } from "@/lib/email/types";
import type { AtelierOrder, AtelierOrderStatus } from "./types";

const EMAIL_FOR_STATUS: Partial<Record<AtelierOrderStatus, OrderEmailKind>> = {
  "in-production": "in-production",
  ready: "ready",
  shipped: "shipped",
  delivered: "delivered",
};

export async function sendStatusLetter(order: AtelierOrder) {
  const kind = EMAIL_FOR_STATUS[order.status];
  if (!kind || !order.customer.email) return { sent: false };

  return sendOrderEmail({
    kind,
    to: order.customer.email,
    name: order.customer.fullName,
    orderId: order.id,
    pieces: order.pieces,
    amount: order.amount,
    fulfilment: order.fulfilment,
    trackingCourier: order.trackingCourier,
    trackingUrl: order.trackingUrl,
    visitWhen: order.visitWhen,
    notes: order.type === "custom" ? order.notes : undefined,
  });
}
