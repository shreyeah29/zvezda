import { NextResponse } from "next/server";
import { isAtelierAuthed } from "@/lib/orders/auth";
import { hasRemoteOrderStore, listAtelierOrders } from "@/lib/orders/store";

export async function GET() {
  if (!(await isAtelierAuthed())) {
    return NextResponse.json({ error: "Locked." }, { status: 401 });
  }

  const orders = await listAtelierOrders();
  return NextResponse.json({
    orders,
    remote: hasRemoteOrderStore(),
  });
}
