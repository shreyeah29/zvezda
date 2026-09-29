import { NextResponse } from "next/server";
import { isAtelierAuthed } from "@/lib/orders/auth";
import { getAtelierOrder, upsertAtelierOrder } from "@/lib/orders/store";
import { sendStatusLetter } from "@/lib/orders/statusMail";
import { ATELIER_ORDER_STATUSES, type AtelierOrderStatus } from "@/lib/orders/types";

function isStatus(value: string): value is AtelierOrderStatus {
  return (ATELIER_ORDER_STATUSES as readonly string[]).includes(value);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAtelierAuthed())) {
    return NextResponse.json({ error: "Locked." }, { status: 401 });
  }

  const { id } = await context.params;
  const current = await getAtelierOrder(id);
  if (!current) {
    return NextResponse.json({ error: "That order is not in the book." }, { status: 404 });
  }

  const body = (await request.json()) as {
    status?: string;
    fulfilment?: "pickup" | "ship";
    trackingCourier?: string;
    trackingUrl?: string;
  };

  const nextStatus = String(body.status ?? current.status);
  if (!isStatus(nextStatus)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  const updated = {
    ...current,
    status: nextStatus,
    fulfilment: body.fulfilment ?? current.fulfilment,
    trackingCourier: String(body.trackingCourier ?? current.trackingCourier ?? "").trim() || undefined,
    trackingUrl: String(body.trackingUrl ?? current.trackingUrl ?? "").trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  await upsertAtelierOrder(updated);

  let emailed = false;
  if (updated.status !== current.status) {
    try {
      const result = await sendStatusLetter(updated);
      emailed = Boolean(result.sent);
    } catch (error) {
      console.error("Status letter failed", updated.id, error);
    }
  }

  return NextResponse.json({ ok: true, order: updated, emailed });
}
