"use client";

import { useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import { LogoRotator } from "@/components/home/LogoRotator";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./HomeInstagramStrip.css";

gsap.registerPlugin(ScrollTrigger);

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;

const HEADING_LINES = ["BEYOND", "THE", "ATELIER."] as const;

function buildRotatorImages() {
  const picks = [
    products.find((p) => p.slug === "set-12"),
    products.find((p) => p.slug === "set-8"),
    products.find((p) => p.slug === "set-1"),
    products.find((p) => p.slug === "set-13"),
    products.find((p) => p.slug === "set-5"),
    products.find((p) => p.slug === "set-11"),
  ].filter(Boolean);

  return picks.map((product) => ({
    src: product!.hero,
    alt: product!.name,
  }));
}

export function HomeInstagramStrip() {
  const images = useMemo(() => buildRotatorImages(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean);
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      if (bodyRef.current) gsap.set(bodyRef.current, { y: 28, opacity: 0 });
      if (footerRef.current) gsap.set(footerRef.current, { y: 24, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.14,
        ease: "power3.out",
      })
        .to(bodyRef.current, { y: 0, opacity: 1, duration: 0.85, ease: "power2.out" }, "-=0.55")
        .to(footerRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.35");
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section ref={sectionRef} className="instagram-editorial" aria-label="Beyond the atelier — Instagram">
      <div className="instagram-editorial__fade-top" aria-hidden="true" />
      <div className="instagram-editorial__fade-bottom" aria-hidden="true" />

      <div className="instagram-editorial__inner">
        <header className="instagram-editorial__header">
          <p className="instagram-editorial__label editorial-spacing">Instagram</p>
          <h2 className="instagram-editorial__heading" aria-label="Beyond the Atelier">
            {HEADING_LINES.map((line, index) => (
              <span key={line} className="instagram-editorial__line">
                <span
                  ref={(el) => {
                    lineRefs.current[index] = el;
                  }}
                  className="instagram-editorial__line-inner"
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <p ref={bodyRef} className="instagram-editorial__body">
            From behind-the-scenes moments to new collections, discover the stories that never make
            it to the runway.
          </p>
        </header>

        <div className="instagram-editorial__gallery">
          <LogoRotator
            images={images}
            speed={14}
            imageWidth={300}
            aspectRatio={0.75}
            imageRadius={12}
            onImageClick={openInstagram}
            premium
          />
        </div>

        <div ref={footerRef} className="instagram-editorial__footer">
          <p className="instagram-editorial__handle">@zvezdaatelier</p>
          <button type="button" onClick={openInstagram} className="instagram-editorial__follow">
            <span>Follow the Story</span>
            <span className="instagram-editorial__follow-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
