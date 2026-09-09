"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommerce } from "@/context/CommerceContext";
import { findProduct } from "@/data/findProduct";
import { formatPrice } from "@/data/products";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import type { CheckoutCustomer } from "@/lib/checkout";
import "./CheckoutPage.css";

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const INITIAL_CUSTOMER: CheckoutCustomer = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  country: "India",
};

export function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCommerce();
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
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

  const blocked = lines.filter(
    ({ product }) => product.priceOnRequest || product.currency !== "INR" || !product.price,
  );
  const payable = blocked.length === 0 && lines.length > 0;
  const currency = lines[0]?.product.currency ?? "INR";

  function update<K extends keyof CheckoutCustomer>(key: K, value: CheckoutCustomer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  async function pay() {
    if (!payable || busy) return;
    setError("");
    setBusy(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Could not load Razorpay. Check your connection and try again.");
      }

      const response = await fetch("/api/checkout/order", {
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
        keyId?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
      };

      if (!response.ok || !payload.orderId || !payload.keyId) {
        throw new Error(payload.error || "Unable to start Razorpay checkout.");
      }

      const checkout = new window.Razorpay({
        key: payload.keyId,
        amount: Number(payload.amount),
        currency: payload.currency ?? "INR",
        name: "ZVEZDA Atelier",
        description: "Feel like a star.",
        order_id: payload.orderId,
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          city: customer.city,
        },
        theme: { color: "#0c0a09" },
        handler: async (result) => {
          const verify = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          });
          const verified = (await verify.json()) as { error?: string; orderId?: string };

          if (!verify.ok) {
            setError(verified.error || "Payment could not be verified.");
            setBusy(false);
            return;
          }

          clearCart();
          router.push(`/checkout/success?order=${encodeURIComponent(result.razorpay_order_id)}`);
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });

      checkout.open();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <SmoothScroll>
      <main id="main-content" className="checkout-page">
        <div className="checkout-page__inner">
          <header className="checkout-page__header">
            <p className="checkout-page__eyebrow">Checkout</p>
            <h1 className="checkout-page__title">Complete your order</h1>
            <p className="checkout-page__subtitle">
              Pay securely with Razorpay — UPI, cards, netbanking, and wallets. Made-to-order
              pieces take 3–4 weeks to produce after payment is confirmed.
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
                  void pay();
                }}
              >
                <h2>Delivery</h2>
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
                  Address
                  <input
                    required
                    autoComplete="street-address"
                    value={customer.address}
                    onChange={(event) => update("address", event.target.value)}
                  />
                </label>
                <div className="checkout-form__row">
                  <label>
                    City
                    <input
                      required
                      autoComplete="address-level2"
                      value={customer.city}
                      onChange={(event) => update("city", event.target.value)}
                    />
                  </label>
                  <label>
                    PIN code
                    <input
                      required
                      autoComplete="postal-code"
                      value={customer.pincode}
                      onChange={(event) => update("pincode", event.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Country
                  <input
                    required
                    autoComplete="country-name"
                    value={customer.country}
                    onChange={(event) => update("country", event.target.value)}
                  />
                </label>

                {blocked.length > 0 && (
                  <p className="checkout-page__error" role="alert">
                    {blocked[0].product.name} needs an enquiry before payment. Custom and
                    price-on-request pieces are confirmed manually.
                  </p>
                )}
                {error && (
                  <p className="checkout-page__error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="checkout-page__pay" disabled={!payable || busy}>
                  {busy ? "Opening Razorpay…" : `Pay ${formatPrice(cartSubtotal, currency)}`}
                </button>
                <Link href="/checkout/store" className="checkout-page__store">
                  Pay at store instead
                </Link>
                <p className="checkout-page__fine">
                  In-stock orders can be cancelled within 12 hours, before dispatch. Once
                  production has started, made-to-order pieces cannot be cancelled or refunded.
                  Pay at store lets you try the piece in person — the atelier will be notified
                  that you are coming.
                </p>
                <Link
                  href={`/contact?product=${encodeURIComponent(lines[0]?.product.name ?? "")}#enquiry`}
                  className="checkout-page__enquire"
                >
                  Prefer a custom or made-to-measure order? Enquire instead
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
                      <span>{formatPrice(product.price * item.quantity, product.currency)}</span>
                    </li>
                  ))}
                </ul>
                <div className="checkout-summary__total">
                  <span>Total</span>
                  <strong>{formatPrice(cartSubtotal, currency)}</strong>
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
