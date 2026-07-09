"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CollectionCategory } from "@/data/collectionCategories";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type CategoryVideoHeroProps = {
  category: CollectionCategory;
};

export function CategoryVideoHero({ category }: CategoryVideoHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-hero-reveal]"), {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="hero-screen relative isolate w-full overflow-hidden"
      style={{ backgroundColor: category.backgroundColor }}
    >
      <motion.div className="absolute inset-0" style={{ scale, opacity }}>
        {category.heroPoster && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${category.heroPoster})` }}
            aria-hidden
          />
        )}
        {category.heroVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={category.heroPoster}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={category.heroVideo} type="video/mp4" />
          </video>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${category.backgroundColor}88 0%, transparent 35%, ${category.backgroundColor}cc 100%)`,
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center md:px-10"
        style={{ y }}
      >
        <p
          data-hero-reveal
          className="editorial-spacing text-[10px] md:text-[11px]"
          style={{ color: category.accentColor }}
        >
          {category.subtitle}
        </p>
        <h2
          data-hero-reveal
          className="font-display mt-6 text-[clamp(4rem,14vw,11rem)] leading-[0.85] font-light tracking-[-0.04em]"
          style={{ color: category.textColor }}
        >
          {category.displayTitle}
        </h2>
      </motion.div>
    </section>
  );
}
