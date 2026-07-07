"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collections } from "@/data/collections";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalRunway() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return;

    const totalWidth = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className="absolute top-12 left-6 z-10 md:left-12">
        <p className="editorial-spacing text-[10px] text-muted">Collections</p>
        <h2 className="font-display mt-2 text-3xl text-cream md:text-4xl">The Runway</h2>
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-center gap-0"
        style={{ width: `${collections.length * 100}vw` }}
      >
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group relative h-full w-screen shrink-0 overflow-hidden"
            data-cursor="EXPLORE"
          >
            <EditorialImage
              src={col.cover}
              alt={`${col.title} collection`}
              accent={col.accent}
              className="h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute right-12 bottom-24 left-12">
              <p className="editorial-spacing text-[10px] text-cream/60">{col.season}</p>
              <h3 className="font-display mt-2 text-6xl font-light text-cream md:text-8xl">
                {col.title}
              </h3>
              <p className="mt-4 max-w-md text-sm text-cream/60">{col.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
