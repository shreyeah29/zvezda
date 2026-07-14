"use client";

import Link from "next/link";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./about.css";

export default function AboutPage() {
  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content" className="about-soon jacquemus-home">
          <section className="about-soon__stage" aria-labelledby="about-soon-title">
            <p className="about-soon__eyebrow">The House</p>
            <h1 id="about-soon-title" className="about-soon__title">
              Coming Soon
            </h1>
            <p className="about-soon__copy">
              We&apos;re still shaping this chapter of ZVEZDA Atelier.
              <br />
              Check back shortly for the story of the house.
            </p>
            <div className="about-soon__actions">
              <Link href="/collections" className="about-soon__cta">
                Explore Collections
              </Link>
              <Link href="/shop" className="about-soon__cta about-soon__cta--ghost">
                Shop
              </Link>
            </div>
          </section>
        </main>
        <JacquemusFooter />
      </SmoothScroll>
    </SessionLoadGate>
  );
}
