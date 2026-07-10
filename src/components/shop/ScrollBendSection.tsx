"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./ScrollBendSection.css";

type ScrollBendSectionProps = {
  hero: ReactNode;
  children: ReactNode;
  backgroundColor?: string;
  heroBackground?: string;
  topBend?: number;
  bottomBend?: number;
  cornerRadius?: number;
  sectionPadding?: string;
  scrollDistance?: string;
};

function buildOutwardTopPath(depth: number) {
  const lip = Math.round(depth * 0.62);
  return `M0,${depth} L0,${lip} Q720,0 1440,${lip} L1440,${depth} Z`;
}

function buildInwardBottomPath(depth: number) {
  const lip = Math.round(depth * 0.38);
  return `M0,0 L0,${lip} Q720,${depth} 1440,${lip} L1440,0 Z`;
}

export function ScrollBendSection({
  hero,
  children,
  backgroundColor = "#0a0908",
  heroBackground = "#0a0a0a",
  topBend = 120,
  bottomBend = 72,
  cornerRadius = 28,
  sectionPadding = "clamp(0.85rem, 2.8vw, 1.75rem)",
  scrollDistance = "100vh",
}: ScrollBendSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<SVGPathElement>(null);
  const curveWrapRef = useRef<HTMLDivElement>(null);
  const heroLipRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const root = rootRef.current;
    const pin = pinRef.current;
    const panel = panelRef.current;
    const curveWrap = curveWrapRef.current;
    const curvePath = curveRef.current;
    const heroLip = heroLipRef.current;
    if (!root || !pin || !panel || !curveWrap || !curvePath) return;

    let ctx: { revert: () => void } | undefined;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const flatBend = Math.round(topBend * 0.2);
      const flatPath = buildOutwardTopPath(flatBend);
      const flatHeroLip = buildInwardBottomPath(Math.round(bottomBend * 0.28));

      ctx = gsap.context(() => {
        const travel = () => window.innerHeight * 0.94;
        const curveStart = curveWrap.offsetHeight || 116;
        const curveEnd = Math.max(28, curveStart * 0.34);

        gsap.set(panel, { y: travel });

        const tween = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        tween.to(panel, { y: 0, ease: "none", duration: 1 }, 0);
        tween.to(curvePath, { attr: { d: flatPath }, ease: "none", duration: 1 }, 0);
        tween.to(curveWrap, { height: curveEnd, ease: "none", duration: 1 }, 0);

        if (heroLip) {
          tween.to(heroLip, { attr: { d: flatHeroLip }, ease: "none", duration: 1 }, 0);
        }
      }, root);

      ScrollTrigger.refresh();
    })();

    return () => {
      ctx?.revert();
    };
  }, [reduced, topBend, bottomBend, scrollDistance]);

  const frameStyle = {
    "--scroll-bend-bg": backgroundColor,
    "--scroll-bend-radius": `${cornerRadius}px`,
    "--scroll-bend-padding": sectionPadding,
  } as CSSProperties;

  return (
    <div ref={rootRef} className="scroll-bend-stack">
      <div
        ref={pinRef}
        className="scroll-bend-stack__pin"
        style={{ height: `calc(100vh + ${scrollDistance})` }}
      >
        <div className="scroll-bend-stack__hero">
          <div className="scroll-bend-stack__hero-media">{hero}</div>
          <div className="scroll-bend-stack__hero-lip" aria-hidden="true">
            <svg viewBox={`0 0 1440 ${bottomBend}`} preserveAspectRatio="none">
              <path ref={heroLipRef} d={buildInwardBottomPath(bottomBend)} fill={heroBackground} />
            </svg>
          </div>
        </div>
      </div>

      <div ref={panelRef} className="scroll-bend-stack__panel">
        <div
          ref={curveWrapRef}
          className="scroll-bend-stack__curve"
          style={{ height: "clamp(4.5rem, 11vw, 7.25rem)" }}
          aria-hidden="true"
        >
          <svg viewBox={`0 0 1440 ${topBend}`} preserveAspectRatio="none">
            <path ref={curveRef} d={buildOutwardTopPath(topBend)} fill={backgroundColor} />
          </svg>
        </div>

        <div className="scroll-bend-stack__frame" style={frameStyle}>
          <div className="scroll-bend-stack__frame-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
