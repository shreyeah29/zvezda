"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./EditorialMarquee.css";

const MARQUEE_SEGMENTS = [
  "ZVEZDA",
  "COLLECTION 2026",
  "HANDCRAFTED",
  "ATELIER",
  "LIMITED EDITION",
] as const;

function MarqueeRow() {
  return (
    <div className="editorial-marquee__row" aria-hidden="true">
      {MARQUEE_SEGMENTS.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-flex items-center gap-[clamp(1.5rem,4vw,3.5rem)]">
          <span className="editorial-marquee__word">{word}</span>
          <span className="editorial-marquee__star">✦</span>
        </span>
      ))}
    </div>
  );
}

export function HomeEditorialMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".editorial-marquee__track", {
        opacity: 0,
        y: 10,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="editorial-marquee snap-none" aria-label="Editorial marquee">
      <video
        className="editorial-marquee__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/assets/videos/film/GardenTrio.mp4" type="video/mp4" />
      </video>
      <div className="editorial-marquee__scrim" aria-hidden="true" />
      <div className="editorial-marquee__track">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </section>
  );
}
