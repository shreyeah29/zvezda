import { NextResponse } from "next/server";
import { isAtelierAuthed } from "@/lib/orders/auth";
import { hasRemoteOrderStore, loadHouseOrders } from "@/lib/orders/store";

export async function GET(request: Request) {
  if (!isAtelierAuthed(request)) {
    return NextResponse.json({ error: "Locked." }, { status: 401 });
  }

  const orders = await loadHouseOrders();
  return NextResponse.json({
    orders,
    remote: hasRemoteOrderStore(),
  });
}
