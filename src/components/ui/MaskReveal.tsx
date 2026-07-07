"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { EditorialImage } from "./EditorialImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type MaskRevealProps = {
  src: string;
  alt: string;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  accent?: string;
};

export function MaskReveal({
  src,
  alt,
  className,
  direction = "up",
  accent,
}: MaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;

    const clipMap = {
      up: { from: "inset(100% 0% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
      down: { from: "inset(0% 0% 100% 0%)", to: "inset(0% 0% 0% 0%)" },
      left: { from: "inset(0% 100% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
      right: { from: "inset(0% 0% 0% 100%)", to: "inset(0% 0% 0% 0%)" },
    };

    const { from, to } = clipMap[direction];

    gsap.fromTo(
      el,
      { clipPath: from },
      {
        clipPath: to,
        duration: 1.4,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [direction, reduced]);

  return (
    <div
      ref={containerRef}
      className={cn("gpu overflow-hidden", className, reduced && "clip-path-none")}
      style={reduced ? undefined : { clipPath: "inset(100% 0% 0% 0%)" }}
    >
      <EditorialImage src={src} alt={alt} accent={accent} className="aspect-[3/4] md:aspect-[16/10]" />
    </div>
  );
}
