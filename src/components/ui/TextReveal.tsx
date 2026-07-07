"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  split?: "chars" | "words" | "lines";
  trigger?: boolean;
};

export function TextReveal({
  children,
  className,
  as: Tag = "h2",
  delay = 0,
  split = "chars",
  trigger = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const splitInstance = new SplitType(el, { types: split });

    const targets =
      split === "chars"
        ? splitInstance.chars
        : split === "words"
          ? splitInstance.words
          : splitInstance.lines;

    if (!targets?.length) return;

    gsap.set(targets, { opacity: 0, y: 40 });

    const anim = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.03,
      delay,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          }
        : undefined,
    });

    return () => {
      anim.kill();
      splitInstance.revert();
    };
  }, [children, delay, split, trigger, reduced]);

  return (
    <Tag ref={ref as never} className={cn(className, reduced && "opacity-100")}>
      {children}
    </Tag>
  );
}
