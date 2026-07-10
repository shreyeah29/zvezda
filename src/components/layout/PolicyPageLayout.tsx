"use client";

import Link from "next/link";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import "./PolicyPageLayout.css";

type PolicyPageLayoutProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function PolicyPageLayout({
  title,
  eyebrow = "Customer Care",
  children,
}: PolicyPageLayoutProps) {
  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main className="policy-page">
          <article className="policy-page__inner">
            <Link href="/shop" className="policy-page__back editorial-spacing">
              ← Back to Shop
            </Link>
            <p className="policy-page__eyebrow editorial-spacing">{eyebrow}</p>
            <h1 className="policy-page__title font-display">{title}</h1>
            <div className="policy-page__body">{children}</div>
          </article>
        </main>
        <Footer />
      </SmoothScroll>
    </SessionLoadGate>
  );
}
