"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CollectionCategory } from "@/data/collectionCategories";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type CategoryStorySectionProps = {
  category: CollectionCategory;
};

export function CategoryStorySection({ category }: CategoryStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-story-line]"), {
        y: 36,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-28 md:px-10 md:py-36"
      style={{ backgroundColor: category.backgroundColor }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${category.accentColor}18 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p
          data-story-line
          className="editorial-spacing text-[10px]"
          style={{ color: category.accentColor }}
        >
          Backstory
        </p>
        <h3
          data-story-line
          className="font-display mt-6 text-4xl font-light leading-tight md:text-6xl lg:text-7xl"
          style={{ color: category.textColor }}
        >
          {category.title}
        </h3>
        <div className="mx-auto mt-10 max-w-2xl space-y-6">
          {category.storyLines.map((line) => (
            <p
              key={line}
              data-story-line
              className="font-display text-xl font-light leading-relaxed md:text-2xl lg:text-3xl"
              style={{ color: category.mutedColor }}
            >
              {line}
            </p>
          ))}
        </div>
        <p
          data-story-line
          className="mx-auto mt-12 max-w-xl text-sm leading-[1.9] md:text-base"
          style={{ color: category.mutedColor }}
        >
          {category.story}
        </p>
      </div>
    </section>
  );
}
