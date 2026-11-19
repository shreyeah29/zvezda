import { NextResponse } from "next/server";
import { atelierSecret, clearAtelierCookie, passwordMatches } from "@/lib/orders/auth";
import { hasRemoteOrderStore, loadHouseOrders } from "@/lib/orders/store";

async function bookPayload(authed: boolean) {
  if (!authed) {
    return { authed: false, configured: Boolean(atelierSecret()) };
  }
  const orders = await loadHouseOrders();
  return {
    authed: true,
    configured: true,
    orders,
    remote: hasRemoteOrderStore(),
  };
}

export async function GET() {
  await clearAtelierCookie();
  return NextResponse.json(await bookPayload(false));
}

export async function POST(request: Request) {
  await clearAtelierCookie();
  if (!atelierSecret()) {
    return NextResponse.json({ error: "The house lock is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as { password?: string };
  if (!passwordMatches(String(body.password ?? ""))) {
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }

  return NextResponse.json(await bookPayload(true));
}

export async function DELETE() {
  await clearAtelierCookie();
  return NextResponse.json({ ok: true });
}
