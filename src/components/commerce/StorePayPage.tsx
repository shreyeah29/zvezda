"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommerce } from "@/context/CommerceContext";
import { findProduct } from "@/data/findProduct";
import { formatPrice, formatProductPrice } from "@/data/products";
import { studioHoursText } from "@/data/atelier";
import { StudioVisit } from "@/components/atelier/StudioVisit";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import type { StoreCustomer } from "@/lib/checkout";
import { STORE_RESERVATION_KEY } from "@/lib/storeReservation";
import "./CheckoutPage.css";

const INITIAL: StoreCustomer = {
  fullName: "",
  email: "",
  phone: "",
  notes: "",
};

export function StorePayPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCommerce();
  const [customer, setCustomer] = useState(INITIAL);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const lines = useMemo(
    () =>
      cart.flatMap((item) => {
        const product = findProduct(item.slug);
        if (!product) return [];
        return [{ item, product }];
      }),
    [cart],
  );

  const currency = lines[0]?.product.currency ?? "INR";

  function update<K extends keyof StoreCustomer>(key: K, value: StoreCustomer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  async function reserve() {
    if (busy || cart.length === 0) return;
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/checkout/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map((item) => ({
            slug: item.slug,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        reservationId?: string;
        notified?: boolean;
        quote?: {
          subtotal: number;
          lines: Array<{
            name: string;
            size: string;
            quantity: number;
            lineTotal: number;
            priceOnRequest?: boolean;
          }>;
        };
      };

      if (!response.ok || !payload.reservationId) {
        throw new Error(payload.error || "Unable to reserve this visit.");
      }

      sessionStorage.setItem(
        STORE_RESERVATION_KEY,
        JSON.stringify({
          reservationId: payload.reservationId,
          customer,
          quote: payload.quote,
          createdAt: Date.now(),
        }),
      );

      clearCart();
      router.push(
        `/checkout/store/thank-you?id=${encodeURIComponent(payload.reservationId)}`,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reserve this visit.");
      setBusy(false);
    }
  }

  return (
    <SmoothScroll>
      <main id="main-content" className="checkout-page">
        <div className="checkout-page__inner">
          <header className="checkout-page__header">
            <p className="checkout-page__eyebrow">Pay at store</p>
            <h1 className="checkout-page__title">Reserve your visit</h1>
            <p className="checkout-page__subtitle">
              Share your details and we will tell the atelier you are coming. Try the piece in
              person, then pay at the store. {studioHoursText()}.
            </p>
          </header>

          {cart.length === 0 ? (
            <div className="checkout-page__empty">
              <p>Your cart is empty.</p>
              <Link href="/shop">Continue shopping</Link>
            </div>
          ) : (
            <div className="checkout-page__grid">
              <form
                className="checkout-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void reserve();
                }}
              >
                <h2>Your details</h2>
                <label>
                  Full name
                  <input
                    required
                    autoComplete="name"
                    value={customer.fullName}
                    onChange={(event) => update("fullName", event.target.value)}
                  />
                </label>
                <div className="checkout-form__row">
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={customer.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      value={customer.phone}
                      onChange={(event) => update("phone", event.target.value)}
                    />
                  </label>
                </div>
                <label>
                  When would you like to visit? (optional)
                  <input
                    value={customer.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="e.g. Saturday afternoon, or this weekend"
                  />
                </label>

                {error && (
                  <p className="checkout-page__error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="checkout-page__pay" disabled={busy}>
                  {busy ? "Reserving…" : "Reserve visit"}
                </button>
                <p className="checkout-page__fine">
                  No payment is taken now. Come to the studio during open hours — we will expect
                  you with this selection.
                </p>
                <StudioVisit className="checkout-page__studio" />
                <Link href="/checkout" className="checkout-page__enquire">
                  Prefer to pay online instead?
                </Link>
              </form>

              <aside className="checkout-summary">
                <h2>Your selection</h2>
                <ul>
                  {lines.map(({ item, product }) => (
                    <li key={`${item.slug}-${item.size}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.hero} alt="" />
                      <div>
                        <p>{product.name}</p>
                        <p>
                          Size {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span>
                        {product.priceOnRequest
                          ? formatProductPrice(product)
                          : formatPrice(product.price * item.quantity, product.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="checkout-summary__total">
                  <span>Due in store</span>
                  <strong>
                    {cartSubtotal > 0 ? formatPrice(cartSubtotal, currency) : "To confirm"}
                  </strong>
                </div>
                <Link href="/cart">Edit cart</Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <JacquemusFooter />
    </SmoothScroll>
  );
}
