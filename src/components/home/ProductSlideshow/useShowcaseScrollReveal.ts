"use client";

import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseScrollRevealRefs = {
  wrapRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLElement | null>;
  washRef: RefObject<HTMLElement | null>;
  wordRowRef: RefObject<HTMLElement | null>;
  rootRef: RefObject<HTMLElement | null>;
};

export function useShowcaseScrollReveal({
  wrapRef,
  pinRef,
  washRef,
  wordRowRef,
  rootRef,
}: ShowcaseScrollRevealRefs) {
  const reduced = usePrefersReducedMotion();
  const [revealComplete, setRevealComplete] = useState(reduced);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    const wash = washRef.current;
    const wordRow = wordRowRef.current;
    const root = rootRef.current;

    if (!wrap || !pin || !wash || !wordRow || !root) return;

    if (reduced) {
      gsap.set(wash, { opacity: 1 });
      gsap.set(wordRow, {
        clearProps: "scale,filter,letterSpacing,textTransform",
      });
      gsap.set(wordRow.querySelectorAll(".ps-backdrop-char"), { opacity: 0.08 });
      gsap.set(root.querySelectorAll(".ps-slot--on-letter .ps-image"), {
        clearProps: "opacity,y",
      });
      setRevealComplete(true);
      return;
    }

    const chars = wordRow.querySelectorAll<HTMLElement>(".ps-backdrop-char");
    const dresses = root.querySelectorAll<HTMLElement>(".ps-slot--on-letter");
    const dressImages = root.querySelectorAll<HTMLElement>(
      ".ps-slot--on-letter .ps-image",
    );

    gsap.set(wash, { opacity: 0 });
    gsap.set(wordRow, {
      scale: 0.08,
      letterSpacing: "0.08em",
      filter: "blur(7px)",
      textTransform: "lowercase",
      transformOrigin: "50% 50%",
    });
    gsap.set(chars, { opacity: 0.02 });
    gsap.set(dressImages, { opacity: 0, y: 25 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "top top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(wash, { opacity: self.progress });
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=140%",
          pin: pin,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => setRevealComplete(true),
          onEnterBack: () => setRevealComplete(false),
        },
      });

      tl.to(
        wordRow,
        {
          scale: 1,
          letterSpacing: "-0.04em",
          filter: "blur(0px)",
          textTransform: "uppercase",
          duration: 0.62,
          ease: "none",
        },
        0,
      );

      tl.to(
        chars,
        { opacity: 0.08, duration: 0.62, ease: "none" },
        0,
      );

      dresses.forEach((dress, index) => {
        const image = dress.querySelector<HTMLElement>(".ps-image");
        if (!image) return;

        tl.to(
          image,
          {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: "power2.out",
          },
          0.7 + index * 0.045,
        );
      });

      tl.call(() => setRevealComplete(true), [], 0.98);
    }, wrap);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
      setRevealComplete(false);
    };
  }, [reduced, wrapRef, pinRef, washRef, wordRowRef, rootRef]);

  return { revealComplete };
}
