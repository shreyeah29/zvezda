"use client";

import { useMemo, useState, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommerce } from "@/context/CommerceContext";
import { findProduct } from "@/data/findProduct";
import { formatPrice, cartLineName, cartLineUnitPrice } from "@/data/products";
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

type CustomerKey = keyof CheckoutCustomer;

function customerFieldNote(customer: CheckoutCustomer, key: CustomerKey) {
  const value = customer[key].trim();
  if (!value) return "Please fill this in";
  if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
  if (key === "phone" && value.replace(/\D/g, "").length < 10) return "Please enter a valid phone number";
  return "";
}

function customerNotes(customer: CheckoutCustomer) {
  return (Object.keys(customer) as CustomerKey[]).reduce(
    (notes, key) => {
      const note = customerFieldNote(customer, key);
      if (note) notes[key] = note;
      return notes;
    },
    {} as Partial<Record<CustomerKey, string>>,
  );
}

export function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCommerce();
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [notes, setNotes] = useState<Partial<Record<CustomerKey, string>>>({});
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

  function update<K extends CustomerKey>(key: K, value: CheckoutCustomer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
    setNotes((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function field(key: CustomerKey, props: InputHTMLAttributes<HTMLInputElement>) {
    const miss = notes[key];
    return (
      <>
        <input
          {...props}
          id={`checkout-${key}`}
          className={miss ? "is-invalid" : undefined}
          aria-invalid={miss ? true : undefined}
          aria-describedby={miss ? `checkout-${key}-note` : undefined}
          value={customer[key]}
          onChange={(event) => update(key, event.target.value)}
        />
        {miss ? (
          <p id={`checkout-${key}-note`} className="checkout-form__miss">
            {miss}
          </p>
        ) : null}
      </>
    );
  }

  async function pay() {
    if (!payable || busy) return;
    const nextNotes = customerNotes(customer);
    setNotes(nextNotes);
    if (Object.keys(nextNotes).length > 0) {
      const first = (Object.keys(nextNotes) as CustomerKey[])[0];
      document.getElementById(`checkout-${first}`)?.focus();
      return;
    }
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
            option: item.option,
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
            body: JSON.stringify({
              ...result,
              customer: {
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                pincode: customer.pincode,
                country: customer.country,
              },
              pieces: cart.map((item) => {
                const product = findProduct(item.slug);
                return {
                  name: product ? cartLineName(product, item.option) : item.slug,
                  size: item.size,
                  quantity: item.quantity,
                };
              }),
              amount: cartSubtotal,
            }),
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
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  void pay();
                }}
              >
                <h2>Delivery</h2>
                <label htmlFor="checkout-fullName">
                  Full name
                  {field("fullName", { autoComplete: "name" })}
                </label>
                <div className="checkout-form__row">
                  <label htmlFor="checkout-email">
                    Email
                    {field("email", { type: "email", autoComplete: "email" })}
                  </label>
                  <label htmlFor="checkout-phone">
                    Phone
                    {field("phone", { type: "tel", autoComplete: "tel" })}
                  </label>
                </div>
                <label htmlFor="checkout-address">
                  Address
                  {field("address", { autoComplete: "street-address" })}
                </label>
                <div className="checkout-form__row">
                  <label htmlFor="checkout-city">
                    City
                    {field("city", { autoComplete: "address-level2" })}
                  </label>
                  <label htmlFor="checkout-pincode">
                    PIN code
                    {field("pincode", { autoComplete: "postal-code" })}
                  </label>
                </div>
                <label htmlFor="checkout-country">
                  Country
                  {field("country", { autoComplete: "country-name" })}
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
                  Pay at store lets you try the piece at the Jubilee Hills studio, open 11:00 am
                  – 7:00 pm IST.
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
                    <li key={`${item.slug}-${item.size}-${item.option ?? "set"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.hero} alt="" />
                      <div>
                        <p>{cartLineName(product, item.option)}</p>
                        <p>
                          Size {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span>{formatPrice(cartLineUnitPrice(product, item.option) * item.quantity, product.currency)}</span>
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
