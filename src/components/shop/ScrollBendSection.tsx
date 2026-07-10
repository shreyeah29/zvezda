"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./ScrollBendSection.css";

type BendDirection = "inward" | "outward";

type ScrollBendSectionProps = {
  hero: ReactNode;
  children: ReactNode;
  backgroundColor?: string;
  topBend?: number;
  bendDirection?: BendDirection;
  pinHeight?: string;
};

function buildTopCurvePath(bend: number, direction: BendDirection) {
  const lip = Math.round(bend * 0.36);

  if (direction === "outward") {
    return `M0,${bend} L0,${lip} Q720,0 1440,${lip} L1440,${bend} Z`;
  }

  return `M0,${lip} Q720,${bend} 1440,${lip} L1440,${bend} L0,${bend} Z`;
}

export function ScrollBendSection({
  hero,
  children,
  backgroundColor = "#0a0908",
  topBend = 88,
  bendDirection = "inward",
  pinHeight = "125vh",
}: ScrollBendSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const root = rootRef.current;
    const pin = pinRef.current;
    const panel = panelRef.current;
    if (!root || !pin || !panel) return;

    let ctx: { revert: () => void } | undefined;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          panel,
          { y: "16vh" },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: "bottom top",
              scrub: 0.75,
            },
          },
        );
      }, root);

      ScrollTrigger.refresh();
    })();

    return () => {
      ctx?.revert();
    };
  }, [reduced]);

  const curvePath = buildTopCurvePath(topBend, bendDirection);

  return (
    <div ref={rootRef} className="scroll-bend-stack">
      <div ref={pinRef} className="scroll-bend-stack__pin" style={{ height: pinHeight }}>
        <div className="scroll-bend-stack__hero">{hero}</div>
      </div>

      <section
        ref={panelRef}
        className="scroll-bend-stack__panel"
        style={{ backgroundColor, "--scroll-bend-bg": backgroundColor } as React.CSSProperties}
      >
        <div className="scroll-bend-stack__curve" aria-hidden="true">
          <svg viewBox={`0 0 1440 ${topBend}`} preserveAspectRatio="none">
            <path d={curvePath} fill={backgroundColor} />
          </svg>
        </div>
        <div className="scroll-bend-stack__content">{children}</div>
      </section>
    </div>
  );
}
