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
          Your order [{orderId}] has been confirmed. If it is a made-to-order piece, our team
          will reach out within 24 hours to confirm measurements and timeline. You&apos;ll
          receive a shipping notification once your piece is on its way. Feel like a star —
          we can&apos;t wait for you to wear this.
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
