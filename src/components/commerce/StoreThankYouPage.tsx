"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { atelierContact } from "@/data/atelier";
import { StudioVisit } from "@/components/atelier/StudioVisit";
import { formatPrice } from "@/data/products";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import {
  STORE_RESERVATION_KEY,
  type StoredStoreReservation,
} from "@/lib/storeReservation";
import "./CheckoutPage.css";

function ThankYouBody() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id") ?? "";
  const [stored, setStored] = useState<StoredStoreReservation | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_RESERVATION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredStoreReservation;
      if (!reservationId || parsed.reservationId === reservationId) {
        setStored(parsed);
      }
    } catch {
      setStored(null);
    }
  }, [reservationId]);

  const id = reservationId || stored?.reservationId || "your reservation";
  const lines = stored?.quote?.lines ?? [];
  const subtotal = stored?.quote?.subtotal ?? 0;

  return (
    <main id="main-content" className="checkout-page">
      <div className="checkout-page__inner checkout-success">
        <p className="checkout-page__eyebrow">Visit reserved</p>
        <h1 className="checkout-page__title">We will expect you at the atelier</h1>
        <p className="checkout-success__message">
          Thank you. Your pay-at-store reservation [{id}] has been sent to the atelier. Come in
          to try the piece, then pay in person. The studio is open 11:00 am – 7:00 pm IST.
        </p>
        <StudioVisit className="checkout-page__studio" />

        {stored && (
          <div className="store-thanks__details">
            <p>
              <strong>{stored.customer.fullName}</strong>
              <br />
              {stored.customer.email}
              <br />
              {stored.customer.phone}
              {stored.customer.notes ? (
                <>
                  <br />
                  Visit: {stored.customer.notes}
                </>
              ) : null}
            </p>
            {lines.length > 0 && (
              <ul>
                {lines.map((line) => (
                  <li key={`${line.name}-${line.size}`}>
                    {line.name} · Size {line.size} · Qty {line.quantity}
                    <span>
                      {line.priceOnRequest
                        ? "Price on request"
                        : formatPrice(line.lineTotal, "INR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {subtotal > 0 && (
              <p className="store-thanks__due">
                Due in store {formatPrice(subtotal, "INR")}
              </p>
            )}
          </div>
        )}

        <p className="checkout-success__message">
          Questions before you visit? Write to{" "}
          <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>.
        </p>

        <div className="checkout-success__actions">
          <Link href="/shop" className="checkout-page__pay">
            Continue shopping
          </Link>
          <Link href="/contact">Contact the atelier</Link>
        </div>
      </div>
    </main>
  );
}

export function StoreThankYouPage() {
  return (
    <SmoothScroll>
      <Suspense fallback={null}>
        <ThankYouBody />
      </Suspense>
      <JacquemusFooter />
    </SmoothScroll>
  );
}
