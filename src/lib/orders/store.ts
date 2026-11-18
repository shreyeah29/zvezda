import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { DEMO_ORDERS } from "./demo";
import type { AtelierOrder } from "./types";

const KEY = "zvezda:orders";
const LOCAL_FILE = path.join(process.cwd(), "data", "atelier-orders.json");

type Sql = NeonQueryFunction<false, false>;

function postgresUrl() {
  return (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
}

function postgresDirectUrl() {
  return (process.env.DATABASE_URL_UNPOOLED || postgresUrl()).trim();
}

function redisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (!url || !token) return null;
  return { url, token };
}

let tableReady = false;

function postgres(): Sql | null {
  const url = postgresUrl();
  if (!url) return null;
  return neon(url);
}

function postgresDirect(): Sql | null {
  const url = postgresDirectUrl();
  if (!url) return null;
  return neon(url);
}

async function ensureTable(): Promise<Sql | null> {
  const sql = postgres();
  if (!sql) return null;
  if (!tableReady) {
    const schema = postgresDirect() ?? sql;
    await schema`
      CREATE TABLE IF NOT EXISTS atelier_orders (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        payload JSONB NOT NULL
      )
    `;
    await schema`
      CREATE INDEX IF NOT EXISTS atelier_orders_created_at_idx
      ON atelier_orders (created_at DESC)
    `;
    tableReady = true;
  }
  return sql;
}

function parsePayload(value: unknown): AtelierOrder | null {
  let payload = value;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return null;
    }
  }
  if (!payload || typeof payload !== "object") return null;
  const order = payload as AtelierOrder;
  if (!order.id || !order.type || !order.status) return null;
  return order;
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

function sortOrders(orders: AtelierOrder[]) {
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function hasRemoteOrderStore() {
  return Boolean(postgresUrl() || redisConfig());
}

async function listPostgres(sql: Sql): Promise<AtelierOrder[]> {
  const rows = await sql`SELECT payload FROM atelier_orders ORDER BY created_at DESC`;
  return rows
    .map((row) => parsePayload((row as { payload: unknown }).payload))
    .filter((order): order is AtelierOrder => Boolean(order));
}

async function upsertPostgres(sql: Sql, order: AtelierOrder) {
  await sql`
    INSERT INTO atelier_orders (id, type, status, created_at, updated_at, payload)
    VALUES (
      ${order.id},
      ${order.type},
      ${order.status},
      ${order.createdAt},
      ${order.updatedAt},
      CAST(${JSON.stringify(order)} AS JSONB)
    )
    ON CONFLICT (id) DO UPDATE SET
      type = EXCLUDED.type,
      status = EXCLUDED.status,
      updated_at = EXCLUDED.updated_at,
      payload = EXCLUDED.payload
  `;
}

export async function listAtelierOrders(): Promise<AtelierOrder[]> {
  const sql = postgres();
  if (sql) {
    try {
      return await listPostgres(sql);
    } catch {
      const ready = await ensureTable();
      if (ready) return listPostgres(ready);
    }
  }

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
  const sorted = sortOrders(orders);
  const sql = await ensureTable();
  if (sql) {
    const existing = await sql`SELECT id FROM atelier_orders`;
    const keep = new Set(sorted.map((order) => order.id));
    for (const row of existing) {
      const id = (row as { id: string }).id;
      if (!keep.has(id)) {
        await sql`DELETE FROM atelier_orders WHERE id = ${id}`;
      }
    }
    for (const order of sorted) {
      await upsertPostgres(sql, order);
    }
    return;
  }
  if (redisConfig()) {
    await redisCommand(["SET", KEY, JSON.stringify(sorted)]);
    return;
  }
  await writeLocal(sorted);
}

export async function getAtelierOrder(id: string) {
  const sql = await ensureTable();
  if (sql) {
    const rows = await sql`SELECT payload FROM atelier_orders WHERE id = ${id} LIMIT 1`;
    return parsePayload((rows[0] as { payload?: unknown } | undefined)?.payload) ?? null;
  }
  const orders = await listAtelierOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function upsertAtelierOrder(order: AtelierOrder) {
  const sql = await ensureTable();
  if (sql) {
    await upsertPostgres(sql, order);
    return order;
  }
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

export async function loadHouseOrders() {
  const existing = await listAtelierOrders();
  if (process.env.ATELIER_SEED_DEMO !== "true") return existing;

  const have = new Set(existing.map((order) => order.id));
  const missing = DEMO_ORDERS.filter((order) => !have.has(order.id));
  if (missing.length === 0) return existing;
  const next = [...existing, ...missing];
  await writeAtelierOrders(next);
  return listAtelierOrders();
}
