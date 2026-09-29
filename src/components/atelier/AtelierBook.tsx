"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ATELIER_ORDER_STATUSES,
  STATUS_LABELS,
  TYPE_LABELS,
  type AtelierOrder,
  type AtelierOrderStatus,
  type AtelierOrderType,
} from "@/lib/orders/types";
import "./AtelierBook.css";

type Filter = "open" | AtelierOrderType | "all";

const CLOSED: AtelierOrderStatus[] = ["delivered", "cancelled"];

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    status: "new" as AtelierOrderStatus,
    fulfilment: "" as "" | "pickup" | "ship",
    trackingCourier: "",
    trackingUrl: "",
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

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "open") return orders.filter((order) => !CLOSED.includes(order.status));
    return orders.filter((order) => order.type === filter);
  }, [filter, orders]);

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
    });
  }, [selected]);

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
    try {
      const response = await fetch(`/api/atelier/orders/${encodeURIComponent(selected.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: draft.status,
          fulfilment: draft.fulfilment || undefined,
          trackingCourier: draft.trackingCourier,
          trackingUrl: draft.trackingUrl,
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
          : draft.status === selected.status
            ? "Saved."
            : "Saved. No letter is tied to this status.",
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update this order.");
    } finally {
      setBusy(false);
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
          <p className="atelier-book__eyebrow">Private</p>
          <h1>The house book</h1>
          <p className="atelier-book__lede">
            {configured
              ? "This page is not in the public rooms. Enter the house password."
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

  return (
    <main className="atelier-book">
      <header className="atelier-book__header">
        <div>
          <p className="atelier-book__eyebrow">Atelier</p>
          <h1>Order book</h1>
          <p className="atelier-book__lede">
            Paid, studio visits, and custom work. Changing production, ready, shipped, or delivered
            sends the client letter.
            {!remote ? " This machine is keeping a local file — add Upstash Redis on Vercel so live orders stay." : null}
          </p>
        </div>
        <button type="button" className="atelier-book__ghost" onClick={onLock}>
          Lock
        </button>
      </header>

      <nav className="atelier-book__filters" aria-label="Order filters">
        {(
          [
            ["open", "Open"],
            ["all", "All"],
            ["paid", "Paid"],
            ["store", "Visits"],
            ["custom", "Custom"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={filter === value ? "is-on" : undefined}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="atelier-book__quiet">No orders in this view yet.</p>
      ) : (
        <div className="atelier-book__grid">
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
                  <span className="atelier-book__list-id">{order.id}</span>
                  <span className="atelier-book__list-name">{order.customer.fullName}</span>
                  <span className="atelier-book__list-meta">
                    {TYPE_LABELS[order.type]} · {STATUS_LABELS[order.status]}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {selected ? (
            <article className="atelier-book__detail">
              <header>
                <p className="atelier-book__eyebrow">{TYPE_LABELS[selected.type]}</p>
                <h2>{selected.customer.fullName}</h2>
                <p className="atelier-book__id">{selected.id}</p>
              </header>

              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${selected.customer.email}`}>{selected.customer.email}</a>
                  </dd>
                </div>
                {selected.customer.phone ? (
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`https://wa.me/${selected.customer.phone.replace(/\D/g, "")}`}>
                        {selected.customer.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {selected.customer.city ? (
                  <div>
                    <dt>City</dt>
                    <dd>{selected.customer.city}</dd>
                  </div>
                ) : null}
                {selected.customer.address ? (
                  <div>
                    <dt>Address</dt>
                    <dd>{selected.customer.address}</dd>
                  </div>
                ) : null}
                {selected.amount ? (
                  <div>
                    <dt>Amount</dt>
                    <dd>{selected.amount}</dd>
                  </div>
                ) : null}
                {selected.visitWhen ? (
                  <div>
                    <dt>Visit</dt>
                    <dd>{selected.visitWhen}</dd>
                  </div>
                ) : null}
                {selected.paymentId ? (
                  <div>
                    <dt>Payment</dt>
                    <dd>{selected.paymentId}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Received</dt>
                  <dd>{formatWhen(selected.createdAt)}</dd>
                </div>
              </dl>

              <section>
                <h3>Pieces</h3>
                <ul>
                  {selected.pieces.map((piece, index) => (
                    <li key={`${piece.name}-${index}`}>{pieceLine(piece)}</li>
                  ))}
                </ul>
              </section>

              {measures.length > 0 ? (
                <section>
                  <h3>Measurements</h3>
                  <ul>
                    {measures.map(([label, value]) => (
                      <li key={label}>
                        {label}: {value}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {selected.notes ? (
                <section>
                  <h3>Notes</h3>
                  <pre>{selected.notes}</pre>
                </section>
              ) : null}

              <section className="atelier-book__status">
                <h3>House status</h3>
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
                {error ? <p className="atelier-book__error">{error}</p> : null}
                {flash ? <p className="atelier-book__flash">{flash}</p> : null}
                <button type="button" onClick={onSave} disabled={busy}>
                  {busy ? "Saving…" : "Update & send letter"}
                </button>
              </section>
            </article>
          ) : null}
        </div>
      )}
    </main>
  );
}
