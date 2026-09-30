import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DEMO_ORDERS } from "./demo";
import type { AtelierOrder } from "./types";

const KEY = "zvezda:orders";
const LOCAL_FILE = path.join(process.cwd(), "data", "atelier-orders.json");

function redisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (!url || !token) return null;
  return { url, token };
}

async function redisCommand(command: unknown[]) {
  const config = redisConfig();
  if (!config) return null;
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("The order book could not be reached.");
  }
  const payload = (await response.json()) as { result?: unknown };
  return payload.result;
}

async function readLocal(): Promise<AtelierOrder[]> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as AtelierOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(orders: AtelierOrder[]) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export function hasRemoteOrderStore() {
  return Boolean(redisConfig());
}

export async function listAtelierOrders(): Promise<AtelierOrder[]> {
  if (redisConfig()) {
    const result = await redisCommand(["GET", KEY]);
    if (!result || typeof result !== "string") return [];
    try {
      const parsed = JSON.parse(result) as AtelierOrder[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return readLocal();
}

export async function writeAtelierOrders(orders: AtelierOrder[]) {
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (redisConfig()) {
    await redisCommand(["SET", KEY, JSON.stringify(sorted)]);
    return;
  }
  await writeLocal(sorted);
}

export async function getAtelierOrder(id: string) {
  const orders = await listAtelierOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function upsertAtelierOrder(order: AtelierOrder) {
  const orders = await listAtelierOrders();
  const index = orders.findIndex((item) => item.id === order.id);
  if (index >= 0) orders[index] = order;
  else orders.unshift(order);
  await writeAtelierOrders(orders);
  return order;
}

export async function recordAtelierOrder(order: Omit<AtelierOrder, "updatedAt"> & { updatedAt?: string }) {
  const now = new Date().toISOString();
  try {
    return await upsertAtelierOrder({ ...order, updatedAt: order.updatedAt ?? now });
  } catch (error) {
    console.error("Could not record atelier order", order.id, error);
    return null;
  }
}

export async function ensureDemoOrders() {
  const existing = await listAtelierOrders();
  const have = new Set(existing.map((order) => order.id));
  const missing = DEMO_ORDERS.filter((order) => !have.has(order.id));
  if (missing.length === 0) return existing;
  const next = [...existing, ...missing];
  await writeAtelierOrders(next);
  return listAtelierOrders();
}
