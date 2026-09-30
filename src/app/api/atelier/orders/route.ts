import { NextResponse } from "next/server";
import { isAtelierAuthed } from "@/lib/orders/auth";
import { ensureDemoOrders, hasRemoteOrderStore } from "@/lib/orders/store";

export async function GET() {
  if (!(await isAtelierAuthed())) {
    return NextResponse.json({ error: "Locked." }, { status: 401 });
  }

  const orders = await ensureDemoOrders();
  return NextResponse.json({
    orders,
    remote: hasRemoteOrderStore(),
  });
}
