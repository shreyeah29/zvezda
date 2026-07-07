"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getResponsiveEntry, getResponsiveLayouts } from "@/components/shop/cardLayouts";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ShopAnimationRefs = {
  root: RefObject<HTMLElement | null>;
  stage: RefObject<HTMLDivElement | null>;
  container: RefObject<HTMLDivElement | null>;
  nav: RefObject<HTMLElement | null>;
  cards: RefObject<(HTMLDivElement | null)[]>;
  copy: RefObject<HTMLDivElement | null>;
  headline: RefObject<HTMLDivElement | null>;
  detailPanel: RefObject<HTMLDivElement | null>;
  thumbStrip: RefObject<HTMLDivElement | null>;
  page: RefObject<HTMLDivElement | null>;
};

export function useShopScrollAnimations(refs: ShopAnimationRefs, onLightMode: (v: boolean) => void) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onLightModeRef = onLightMode;
    const {
      root,
      stage,
      container,
      nav,
      cards,
      copy,
      headline,
      detailPanel,
      thumbStrip,
      page,
    } = refs;

    if (reduced || !root.current || !stage.current || !container.current) return;

    const cardEls = cards.current.filter(Boolean) as HTMLDivElement[];
    if (cardEls.length < 5) return;

    const layouts = getResponsiveLayouts();
    const entries = getResponsiveEntry();

    const ctx = gsap.context(() => {
      // ── Set initial card positions (only center visible) ──
      cardEls.forEach((card, i) => {
        const entry = entries[i];
        gsap.set(card, {
          x: entry.translateX,
          y: entry.translateY,
          rotation: entry.rotate,
          scale: entry.scale,
          opacity: i === 0 ? 1 : 0,
          zIndex: layouts[i].zIndex,
          transformOrigin: "center center",
        });
      });

      // ── Master scroll timeline — pinned stage, scrubbed by scroll ──
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=450%",
          pin: stage.current,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // ═══════════════════════════════════════
      // PHASE 1 — Collection expansion
      // Center card stays fixed; left/right cards enter with elastic settle
      // ═══════════════════════════════════════
      const expandTl = gsap.timeline();

      // 1. Center card remains fixed (hold)
      expandTl.to({}, { duration: 0.15 });

      // 2. Left cards enter
      expandTl.to(
        [cardEls[1], cardEls[2]],
        {
          x: (i) => layouts[i + 1].translateX,
          y: (i) => layouts[i + 1].translateY,
          rotation: (i) => layouts[i + 1].rotate,
          scale: (i) => layouts[i + 1].scale,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
        },
        0.15
      );

      // 3. Right cards enter
      expandTl.to(
        [cardEls[3], cardEls[4]],
        {
          x: (i) => layouts[i + 3].translateX,
          y: (i) => layouts[i + 3].translateY,
          rotation: (i) => layouts[i + 3].rotate,
          scale: (i) => layouts[i + 3].scale,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
        },
        0.35
      );

      // 4. Elastic settle on all outer cards
      expandTl.to(
        [cardEls[1], cardEls[2], cardEls[3], cardEls[4]],
        {
          y: (i) => layouts[i + 1].translateY - 6,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        },
        1.2
      );
      expandTl.to(
        [cardEls[1], cardEls[2], cardEls[3], cardEls[4]],
        {
          y: (i) => layouts[i + 1].translateY,
          duration: 0.5,
          ease: "power2.out",
        },
        1.5
      );

      master.add(expandTl, 0);

      // ═══════════════════════════════════════
      // PHASE 2 — Card backgrounds dissolve; models remain via clip-path + opacity
      // ═══════════════════════════════════════
      const dissolveTl = gsap.timeline();

      cardEls.forEach((card) => {
        const bg = card.querySelector("[data-card-bg]");
        const mask = card.querySelector("[data-card-mask]");
        const model = card.querySelector("[data-card-model]");

        if (bg) {
          dissolveTl.to(
            bg,
            { opacity: 0, duration: 0.8, ease: "power2.inOut" },
            0
          );
        }
        if (mask) {
          dissolveTl.to(
            mask,
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              duration: 1,
              ease: "power3.inOut",
            },
            0.1
          );
        }
        if (model) {
          dissolveTl.to(
            model,
            { scale: 1.06, duration: 1, ease: "power2.out" },
            0.2
          );
        }
      });

      master.add(dissolveTl, 1.8);

      // ═══════════════════════════════════════
      // PHASE 3 — Theme inversion: black → white
      // Background, border, text, buttons animate simultaneously
      // ═══════════════════════════════════════
      const themeTl = gsap.timeline({
        onUpdate: function () {
          if (this.progress() > 0.5) onLightModeRef(true);
          else onLightModeRef(false);
        },
      });

      themeTl.to(
        container.current,
        {
          backgroundColor: "#f5f0e8",
          borderColor: "rgba(10,10,10,0.08)",
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      if (page.current) {
        themeTl.to(
          page.current,
          { backgroundColor: "#f5f0e8", duration: 1, ease: "power2.inOut" },
          0
        );
      }

      if (copy.current) {
        themeTl.to(copy.current, { color: "#0a0a0a", duration: 1, ease: "power2.inOut" }, 0);
      }
      if (headline.current) {
        themeTl.to(headline.current, { color: "#0a0a0a", duration: 1, ease: "power2.inOut" }, 0);
      }
      if (detailPanel.current) {
        themeTl.to(
          detailPanel.current,
          { color: "#0a0a0a", duration: 1, ease: "power2.inOut" },
          0
        );
      }
      if (nav.current) {
        themeTl.to(nav.current, { color: "#0a0a0a", duration: 1, ease: "power2.inOut" }, 0);
      }

      master.add(themeTl, 3.2);

      // ═══════════════════════════════════════
      // PHASE 4 — Thumbnail strip slides up with stagger
      // ═══════════════════════════════════════
      if (thumbStrip.current) {
        const stripTl = gsap.timeline();

        stripTl.to(
          thumbStrip.current,
          {
            y: "0%",
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          0
        );

        const thumbs = thumbStrip.current.querySelectorAll(".shop-thumb");
        stripTl.fromTo(
          thumbs,
          { opacity: 0, y: 24, scale: 0.92 },
          {
            opacity: (i) => (i === 0 ? 1 : 0.55),
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.15
        );

        master.add(stripTl, 4.5);
      }
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}

/** Hover interaction — scale active model, blur/dim others */
export function animateCardHover(
  cards: HTMLDivElement[],
  activeIndex: number,
  featuredCount = 5
) {
  cards.slice(0, featuredCount).forEach((card, i) => {
    const model = card.querySelector("[data-card-model]");
    if (!model) return;

    const isActive = i === activeIndex;

    gsap.to(card, {
      scale: isActive ? 1.02 : 1,
      opacity: isActive ? 1 : 0.45,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(model, {
      scale: isActive ? 1.08 : 1.06,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  // Thumbnail scale
  document.querySelectorAll(".shop-thumb").forEach((thumb, i) => {
    gsap.to(thumb, {
      width: i === activeIndex ? "clamp(72px, 8vw, 96px)" : "clamp(56px, 6vw, 72px)",
      opacity: i === activeIndex ? 1 : 0.45,
      duration: 0.4,
      ease: "power2.out",
    });
  });
}
