"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ATELIER_ORDER_STATUSES,
  STATUS_LABELS,
  TYPE_LABELS,
  type AtelierOrder,
  type AtelierOrderStatus,
  type AtelierOrderType,
} from "@/lib/orders/types";
import { brand } from "@/data/brand";
import { atelierStudio } from "@/data/atelier";
import { shopProducts } from "@/data/findProduct";
import "./AtelierBook.css";

type Filter = "open" | AtelierOrderType | "all";

const CLOSED: AtelierOrderStatus[] = ["delivered", "cancelled"];
const PIPELINE: AtelierOrderStatus[] = [
  "new",
  "confirmed",
  "visit",
  "in-production",
  "ready",
  "shipped",
  "delivered",
];
const LETTER_STATUSES = new Set<AtelierOrderStatus>(["in-production", "ready", "shipped", "delivered"]);

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function pieceLine(piece: AtelierOrder["pieces"][number]) {
  const size = piece.size ? ` · ${piece.size}` : "";
  const qty = piece.quantity && piece.quantity > 1 ? ` ×${piece.quantity}` : "";
  return `${piece.name}${size}${qty}`;
}

function measurementRows(order: AtelierOrder) {
  const m = order.measurements;
  if (!m) return [];
  return [
    ["Bust", m.bust],
    ["Waist", m.waist],
    ["Hip", m.hip],
    ["Shoulder", m.shoulder],
    ["Length", m.length],
  ].filter(([, value]) => Boolean(value));
}

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${intl}`;
}

function copyText(value: string) {
  return navigator.clipboard.writeText(value);
}

function productForPiece(name: string) {
  const needle = name.trim().toLowerCase();
  return shopProducts.find((product) => product.name.toLowerCase() === needle);
}

export function AtelierBook() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState<AtelierOrder[]>([]);
  const [remote, setRemote] = useState(true);
  const [filter, setFilter] = useState<Filter>("open");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    status: "new" as AtelierOrderStatus,
    fulfilment: "" as "" | "pickup" | "ship",
    trackingCourier: "",
    trackingUrl: "",
    houseNotes: "",
  });
  const [flash, setFlash] = useState("");

  const loadOrders = useCallback(async () => {
    const response = await fetch("/api/atelier/orders", { cache: "no-store" });
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    const payload = (await response.json()) as { orders?: AtelierOrder[]; remote?: boolean; error?: string };
    if (!response.ok) throw new Error(payload.error || "The book could not be opened.");
    setOrders(payload.orders ?? []);
    setRemote(Boolean(payload.remote));
    setAuthed(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await fetch("/api/atelier/session", { cache: "no-store" });
        const payload = (await session.json()) as { authed?: boolean; configured?: boolean };
        if (cancelled) return;
        setConfigured(payload.configured !== false);
        if (payload.authed) await loadOrders();
      } catch {
        if (!cancelled) setError("The house could not be reached.");
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadOrders]);

  const counts = useMemo(
    () => ({
      open: orders.filter((order) => !CLOSED.includes(order.status)).length,
      all: orders.length,
      paid: orders.filter((order) => order.type === "paid").length,
      store: orders.filter((order) => order.type === "store").length,
      custom: orders.filter((order) => order.type === "custom").length,
    }),
    [orders],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter === "open" && CLOSED.includes(order.status)) return false;
      if (filter !== "open" && filter !== "all" && order.type !== filter) return false;
      if (!needle) return true;
      const hay = [
        order.id,
        order.customer.fullName,
        order.customer.email,
        order.customer.phone,
        order.customer.city,
        order.visitWhen,
        ...order.pieces.map((piece) => piece.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [filter, orders, query]);

  const selected = visible.find((order) => order.id === selectedId) ?? visible[0] ?? null;

  useEffect(() => {
    if (!selected) {
      setSelectedId(null);
      return;
    }
    setSelectedId(selected.id);
    setDraft({
      status: selected.status,
      fulfilment: selected.fulfilment ?? "",
      trackingCourier: selected.trackingCourier ?? "",
      trackingUrl: selected.trackingUrl ?? "",
      houseNotes: selected.houseNotes ?? "",
    });
  }, [selected]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!authed || visible.length === 0) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        return;
      }
      const index = selected ? visible.findIndex((order) => order.id === selected.id) : 0;
      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        const next = visible[Math.min(index + 1, visible.length - 1)];
        if (next) setSelectedId(next.id);
      }
      if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        const next = visible[Math.max(index - 1, 0)];
        if (next) setSelectedId(next.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authed, selected, visible]);

  async function onUnlock(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/atelier/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "That password is not right.");
      setPassword("");
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not unlock.");
    } finally {
      setBusy(false);
    }
  }

  async function onLock() {
    await fetch("/api/atelier/session", { method: "DELETE" });
    setAuthed(false);
    setOrders([]);
    setSelectedId(null);
  }

  async function onSave() {
    if (!selected) return;
    setError("");
    setFlash("");
    setBusy(true);
    const statusChanged = draft.status !== selected.status;
    try {
      const response = await fetch(`/api/atelier/orders/${encodeURIComponent(selected.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: draft.status,
          fulfilment: draft.fulfilment || undefined,
          trackingCourier: draft.trackingCourier,
          trackingUrl: draft.trackingUrl,
          houseNotes: draft.houseNotes,
        }),
      });
      const payload = (await response.json()) as { error?: string; order?: AtelierOrder; emailed?: boolean };
      if (!response.ok) throw new Error(payload.error || "Could not update this order.");
      setOrders((current) =>
        current.map((order) => (order.id === payload.order?.id ? (payload.order as AtelierOrder) : order)),
      );
      setFlash(
        payload.emailed
          ? "Saved. The client letter has been sent."
          : statusChanged && LETTER_STATUSES.has(draft.status)
            ? "Saved. The letter could not be sent — check Gmail."
            : statusChanged
              ? "Saved. No client letter is tied to this status."
              : "Saved to the house book.",
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update this order.");
    } finally {
      setBusy(false);
    }
  }

  async function onCopy(label: string, value: string) {
    try {
      await copyText(value);
      setFlash(`${label} copied.`);
    } catch {
      setError(`Could not copy ${label.toLowerCase()}.`);
    }
  }

  if (!ready) {
    return (
      <main className="atelier-book atelier-book--gate">
        <p className="atelier-book__quiet">Opening the house…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="atelier-book atelier-book--gate">
        <form className="atelier-lock" onSubmit={onUnlock}>
          <img src={brand.logo.dark} alt="ZVEZDA Atelier" className="atelier-lock__mark" />
          <p className="atelier-book__kicker">Private</p>
          <h1>House book</h1>
          <p className="atelier-book__lede">
            {configured
              ? "This room is not in the public house. Enter the password to open the order book."
              : "Set ATELIER_PASSWORD on the server before the book can open."}
          </p>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!configured || busy}
            />
          </label>
          {error ? <p className="atelier-book__error">{error}</p> : null}
          <button type="submit" disabled={!configured || busy || !password}>
            {busy ? "Opening…" : "Open"}
          </button>
        </form>
      </main>
    );
  }

  const measures = selected ? measurementRows(selected) : [];
  const willLetter = selected && draft.status !== selected.status && LETTER_STATUSES.has(draft.status);
  const currentStep = selected ? PIPELINE.indexOf(selected.status) : -1;
  const facts = selected
    ? (
        [
          ["Email", selected.customer.email, "email"],
          selected.customer.phone ? ["Phone", selected.customer.phone, "phone"] : null,
          selected.customer.city ? ["City", selected.customer.city, "text"] : null,
          selected.customer.address ? ["Address", selected.customer.address, "text"] : null,
          selected.amount ? ["Amount", selected.amount, "text"] : null,
          selected.visitWhen ? ["Visit", selected.visitWhen, "text"] : null,
          selected.paymentId ? ["Payment", selected.paymentId, "text"] : null,
          ["Received", formatWhen(selected.createdAt), "text"],
          selected.updatedAt && selected.updatedAt !== selected.createdAt
            ? ["Updated", formatWhen(selected.updatedAt), "text"]
            : null,
        ] as Array<[string, string, "email" | "phone" | "text"] | null>
      ).filter((row): row is [string, string, "email" | "phone" | "text"] => Boolean(row))
    : [];

  return (
    <main className="atelier-book">
      <header className="atelier-book__top">
        <div className="atelier-book__identity">
          <img src={brand.logo.dark} alt="" className="atelier-book__mark" />
          <div>
            <p className="atelier-book__kicker">Atelier</p>
            <h1>House book</h1>
          </div>
        </div>
        <p className="atelier-book__statusline">
          {atelierStudio.city}
          <span />
          {counts.open} open
          <span />
          {remote ? "Database" : "Local file"}
        </p>
        <div className="atelier-book__tools">
          <Link href="/" className="atelier-book__ghost">
            Site
          </Link>
          <button type="button" className="atelier-book__ghost" onClick={() => void loadOrders()}>
            Refresh
          </button>
          <button type="button" className="atelier-book__ghost" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className="atelier-book__ghost" onClick={onLock}>
            Lock
          </button>
        </div>
      </header>

      <div className="atelier-book__toolbar">
        <nav className="atelier-book__filters" aria-label="Order filters">
          {(
            [
              ["open", "Open", counts.open],
              ["all", "All", counts.all],
              ["paid", "Paid", counts.paid],
              ["store", "Visits", counts.store],
              ["custom", "Custom", counts.custom],
            ] as const
          ).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "is-on" : undefined}
              onClick={() => setFilter(value)}
            >
              {label} {count}
            </button>
          ))}
        </nav>
        <input
          className="atelier-book__search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, id, piece"
          aria-label="Search orders"
        />
      </div>

      {visible.length === 0 ? (
        <p className="atelier-book__quiet">
          {orders.length === 0 ? "The book is empty. New visits and orders will appear here." : "No orders match this view."}
        </p>
      ) : (
        <div className="atelier-book__shell">
          <ol className="atelier-book__list">
            {visible.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  className={selected?.id === order.id ? "is-on" : undefined}
                  onClick={() => {
                    setFlash("");
                    setSelectedId(order.id);
                  }}
                >
                  <strong>{order.customer.fullName}</strong>
                  <span>{order.pieces[0]?.name ?? TYPE_LABELS[order.type]}</span>
                  <em>{STATUS_LABELS[order.status]}</em>
                </button>
              </li>
            ))}
          </ol>

          {selected ? (
            <article className="atelier-book__detail">
              <header className="atelier-book__person">
                <p className="atelier-book__kicker">{TYPE_LABELS[selected.type]}</p>
                <h2>{selected.customer.fullName}</h2>
                <p className="atelier-book__id">
                  {selected.id}
                  <button type="button" className="atelier-book__text-btn" onClick={() => void onCopy("Order id", selected.id)}>
                    Copy
                  </button>
                </p>
              </header>

              <ol className="atelier-book__pipeline" aria-label="House status">
                {PIPELINE.map((status) => (
                  <li key={status} className={currentStep >= 0 && PIPELINE.indexOf(status) <= currentStep ? "is-on" : undefined}>
                    {STATUS_LABELS[status]}
                  </li>
                ))}
              </ol>

              <dl className="atelier-book__facts">
                {facts.map(([label, value, kind]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {kind === "email" ? (
                        <>
                          <a href={`mailto:${value}`}>{value}</a>
                          <button type="button" className="atelier-book__text-btn" onClick={() => void onCopy("Email", value)}>
                            Copy
                          </button>
                        </>
                      ) : kind === "phone" ? (
                        <a href={whatsappHref(value)} target="_blank" rel="noreferrer">
                          WhatsApp {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <section className="atelier-book__block">
                <h3>Pieces</h3>
                <ul>
                  {selected.pieces.map((piece, index) => {
                    const product = productForPiece(piece.name);
                    return (
                      <li key={`${piece.name}-${index}`}>
                        {product ? <Link href={`/products/${product.slug}`}>{pieceLine(piece)}</Link> : pieceLine(piece)}
                      </li>
                    );
                  })}
                </ul>
              </section>

              {measures.length > 0 ? (
                <section className="atelier-book__block">
                  <h3>Measurements</h3>
                  <ul className="atelier-book__measures">
                    {measures.map(([label, value]) => (
                      <li key={label}>
                        <span>{label}</span>
                        {value}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {selected.notes ? (
                <section className="atelier-book__block">
                  <h3>Client notes</h3>
                  <pre>{selected.notes}</pre>
                </section>
              ) : null}

              <section className="atelier-book__desk">
                <h3>House desk</h3>
                <div className="atelier-book__fields">
                  <label>
                    Status
                    <select
                      value={draft.status}
                      onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as AtelierOrderStatus }))}
                    >
                      {ATELIER_ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Fulfilment
                    <select
                      value={draft.fulfilment}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          fulfilment: event.target.value as "" | "pickup" | "ship",
                        }))
                      }
                    >
                      <option value="">Not set</option>
                      <option value="pickup">Studio pickup</option>
                      <option value="ship">Ship</option>
                    </select>
                  </label>
                  <label>
                    Courier
                    <input
                      value={draft.trackingCourier}
                      onChange={(event) => setDraft((current) => ({ ...current, trackingCourier: event.target.value }))}
                      placeholder="Bluedart, Delhivery…"
                    />
                  </label>
                  <label>
                    Tracking link
                    <input
                      value={draft.trackingUrl}
                      onChange={(event) => setDraft((current) => ({ ...current, trackingUrl: event.target.value }))}
                      placeholder="https://"
                    />
                  </label>
                  <label className="atelier-book__notes">
                    House notes
                    <textarea
                      value={draft.houseNotes}
                      onChange={(event) => setDraft((current) => ({ ...current, houseNotes: event.target.value }))}
                      rows={4}
                      placeholder="Private to the house. Never sent to the client."
                    />
                  </label>
                </div>
                {error ? <p className="atelier-book__error">{error}</p> : null}
                {flash ? <p className="atelier-book__flash">{flash}</p> : null}
                <div className="atelier-book__actions">
                  <p className="atelier-book__hint">
                    {willLetter
                      ? "Saving will email the client the matching house letter."
                      : "Letters send only for In production, Ready, Shipped, and Delivered."}
                  </p>
                  <button type="button" className="atelier-book__save" onClick={onSave} disabled={busy}>
                    {busy ? "Saving…" : willLetter ? "Save & send letter" : "Save"}
                  </button>
                </div>
              </section>
            </article>
          ) : null}
        </div>
      )}
    </main>
  );
}
