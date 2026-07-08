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
};

export function useShopScrollAnimations(
  refs: ShopAnimationRefs,
  onScrollComplete?: () => void
) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const { root, stage, container, cards, thumbStrip } = refs;

    if (reduced) {
      onScrollComplete?.();
      return;
    }
    if (!root.current || !stage.current || !container.current) return;

    const cardEls = cards.current.filter(Boolean) as HTMLDivElement[];
    if (cardEls.length < 5) return;

    const layouts = getResponsiveLayouts();
    const entries = getResponsiveEntry();

    const ctx = gsap.context(() => {
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

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=420%",
          pin: stage.current,
          scrub: 0.6,
          anticipatePin: 1,
          onLeave: () => onScrollComplete?.(),
        },
      });

      // Phase 1 — five cards expand from center
      const expandTl = gsap.timeline();
      expandTl.to({}, { duration: 0.15 });
      expandTl.to(
        [cardEls[1], cardEls[2]],
        {
          x: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].translateX,
          y: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].translateY,
          rotation: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].rotate,
          scale: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].scale,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
        },
        0.15
      );
      expandTl.to(
        [cardEls[3], cardEls[4]],
        {
          x: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].translateX,
          y: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].translateY,
          rotation: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].rotate,
          scale: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].scale,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
        },
        0.35
      );
      expandTl.to(
        [cardEls[1], cardEls[2], cardEls[3], cardEls[4]],
        {
          y: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].translateY - 6,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        },
        1.2
      );
      expandTl.to(
        [cardEls[1], cardEls[2], cardEls[3], cardEls[4]],
        {
          y: (_i, el) => layouts[Number((el as HTMLElement).dataset.cardIndex)].translateY,
          duration: 0.5,
          ease: "power2.out",
        },
        1.5
      );
      master.add(expandTl, 0);

      // Phase 2 — card backgrounds dissolve, models remain
      const dissolveTl = gsap.timeline();
      cardEls.forEach((card) => {
        const bg = card.querySelector("[data-card-bg]");
        const mask = card.querySelector("[data-card-mask]");
        const model = card.querySelector("[data-card-model]");
        if (bg) dissolveTl.to(bg, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0);
        if (mask) {
          dissolveTl.to(
            mask,
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1, ease: "power3.inOut" },
            0.1
          );
        }
        if (model) dissolveTl.to(model, { scale: 1.06, duration: 1, ease: "power2.out" }, 0.2);
      });
      master.add(dissolveTl, 1.8);

      // Phase 3 — thumbnail strip slides up (no theme inversion — stays black)
      if (thumbStrip.current) {
        const stripTl = gsap.timeline();
        stripTl.to(
          thumbStrip.current,
          { y: "0%", opacity: 1, duration: 0.7, ease: "power3.out" },
          0
        );
        const cols = thumbStrip.current.querySelectorAll(".shop-thumb-col");
        stripTl.fromTo(
          cols,
          { opacity: 0, y: 28, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.12
        );
        master.add(stripTl, 3.0);
      }
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, onScrollComplete]);
}

/** Highlight active card in the featured fan */
export function animateCardHover(cards: HTMLDivElement[], activeIndex: number) {
  cards.forEach((card, i) => {
    const model = card.querySelector("[data-card-model]");
    const isActive = i === activeIndex;

    gsap.to(card, {
      scale: isActive ? 1.04 : 1,
      opacity: isActive ? 1 : 0.42,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      duration: 0.55,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (model) {
      gsap.to(model, {
        scale: isActive ? 1.1 : 1.06,
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });
}

/** Fade featured fan when browsing overflow products */
export function fadeFeaturedFan(cards: HTMLDivElement[], visible: boolean) {
  gsap.to(cards, {
    opacity: visible ? 1 : 0.12,
    filter: visible ? "blur(0px)" : "blur(4px)",
    duration: 0.7,
    ease: "power2.inOut",
  });
}
