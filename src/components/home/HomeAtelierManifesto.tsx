"use client";

import Link from "next/link";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { products } from "@/data/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./AtelierManifesto.css";

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO_IMAGE =
  products.find((p) => p.slug === "set-12")?.detail ??
  products.find((p) => p.slug === "set-8")?.hero ??
  "/assets/images/film/HSP_4662.jpg";

export function HomeAtelierManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const body = bodyRef.current;
    const cta = ctaRef.current;
    const imageWrap = imageWrapRef.current;
    const image = imageRef.current;

    if (!section || !heading || reduced) return;

    const split = new SplitType(heading, { types: "lines,chars" });
    const chars = split.chars ?? [];

    const ctx = gsap.context(() => {
      gsap.set(section, { opacity: 0, y: 36 });
      gsap.set(chars, { opacity: 0, y: 48 });
      if (body) gsap.set(body, { opacity: 0, y: 28 });
      if (cta) gsap.set(cta, { opacity: 0, y: 20 });
      if (image) gsap.set(image, { scale: 1.08 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.to(section, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(
          chars,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: { each: 0.018, from: "start" },
            ease: "power3.out",
          },
          "-=0.55"
        )
        .to(body, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.45")
        .to(cta, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.55");

      if (image) {
        gsap.to(image, {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    }, section);

    const onMove = (event: PointerEvent) => {
      if (!imageWrap || !image) return;
      const rect = imageWrap.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
      gsap.to(image, { x, y, duration: 0.8, ease: "power2.out" });
    };

    imageWrap?.addEventListener("pointermove", onMove);

    return () => {
      imageWrap?.removeEventListener("pointermove", onMove);
      split.revert();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="atelier-manifesto snap-none" aria-label="Atelier manifesto">
      <div className="atelier-manifesto__inner">
        <div>
          <p className="atelier-manifesto__label">Atelier</p>
          <h2 ref={headingRef} className="atelier-manifesto__heading">
            EVERY GARMENT IS CREATED TO OUTLIVE A SEASON.
          </h2>
          <p ref={bodyRef} className="atelier-manifesto__body">
            Each silhouette is shaped slowly in our atelier — hand-finished, structurally considered,
            and intended to be worn across years. Couture is not a moment. It is a memory you return to.
          </p>
          <Link ref={ctaRef} href="/about" className="atelier-manifesto__cta">
            Explore
          </Link>
        </div>

        <div ref={imageWrapRef} className="atelier-manifesto__visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imageRef} src={MANIFESTO_IMAGE} alt="Couture fabric detail" draggable={false} />
        </div>
      </div>
    </section>
  );
}
