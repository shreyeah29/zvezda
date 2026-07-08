"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./EditorialMarquee.css";

gsap.registerPlugin(ScrollTrigger);

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
      gsap.fromTo(
        section,
        { opacity: 0.35 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "bottom 10%",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="editorial-marquee snap-none" aria-label="Editorial marquee">
      <div className="editorial-marquee__track">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </section>
  );
}
