"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./CheckoutPage.css";

function SuccessBody() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "your order";

  return (
    <main id="main-content" className="checkout-page">
      <div className="checkout-page__inner checkout-success">
        <p className="checkout-page__eyebrow">Order confirmed</p>
        <h1 className="checkout-page__title">Thank you for choosing ZVEZDA</h1>
        <p className="checkout-success__message">
          Your order [{orderId}] is confirmed and payment has been received. A letter is on its
          way to you. If this is a made-to-order piece, the atelier will write again when
          cutting begins. Most pieces take 3–4 weeks. You may also collect from the Jubilee
          Hills studio, open 11:00 am – 7:00 pm IST.
        </p>
        <div className="checkout-success__actions">
          <Link href="/shop" className="checkout-page__pay">
            Continue shopping
          </Link>
          <Link href="/contact">Questions? Contact us</Link>
        </div>
      </div>
    </main>
  );
}

export function CheckoutSuccessPage() {
  return (
    <SmoothScroll>
      <Suspense fallback={null}>
        <SuccessBody />
      </Suspense>
      <JacquemusFooter />
    </SmoothScroll>
  );
}
