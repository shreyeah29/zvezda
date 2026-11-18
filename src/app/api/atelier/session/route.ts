import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ATELIER_COOKIE,
  atelierSecret,
  isAtelierAuthed,
  makeSessionValue,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/orders/auth";
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
  return NextResponse.json(await bookPayload(await isAtelierAuthed()));
}

export async function POST(request: Request) {
  if (!atelierSecret()) {
    return NextResponse.json({ error: "The house lock is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as { password?: string };
  if (!passwordMatches(String(body.password ?? ""))) {
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(ATELIER_COOKIE, makeSessionValue(), sessionCookieOptions());
  return NextResponse.json(await bookPayload(true));
}

export async function DELETE() {
  const jar = await cookies();
  jar.set(ATELIER_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return NextResponse.json({ ok: true });
}
