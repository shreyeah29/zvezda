"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Collection } from "@/data/collections";
import {
  collectionThemes,
  getCollectionProducts,
} from "@/components/collections/collectionThemes";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type CollectionSectionProps = {
  collection: Collection;
  index: number;
};

export function CollectionSection({ collection, index }: CollectionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const theme = collectionThemes[collection.slug] ?? collectionThemes.noir;
  const products = getCollectionProducts(collection);
  const reducedMotion = usePrefersReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 80, damping: 20 });
  const py = useSpring(my, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-reveal]"), {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 18);
    my.set(y * 12);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: theme.bg, color: theme.text }}
      onMouseMove={onMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.overlay }}
        aria-hidden
      />
      {theme.movingLight && (
        <motion.div
          className="pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)`,
            top: "10%",
            right: "5%",
          }}
          animate={reducedMotion ? undefined : { x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div data-reveal className="mb-16 max-w-2xl md:mb-24">
          <p
            className="editorial-spacing text-[10px]"
            style={{ color: theme.accent }}
          >
            {collection.season}
          </p>
          <h2 className="font-display mt-5 text-5xl font-light md:text-7xl lg:text-8xl">
            {collection.title}
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed md:text-base" style={{ color: theme.muted }}>
            {collection.description}
          </p>
        </div>

        <motion.div
          className="columns-2 gap-4 md:columns-3 md:gap-5 lg:columns-4"
          style={{ x: px, y: py }}
        >
          {products.map((product, i) => {
            if (!product) return null;
            const offsets = ["mt-0", "mt-8 md:mt-12", "mt-4 md:mt-6", "mt-10 md:mt-16"];
            const aspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[3/5]", "aspect-[4/4]"];
            return (
              <motion.div
                key={product.slug}
                data-reveal
                className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-xl md:mb-5 md:rounded-2xl ${offsets[i % offsets.length]}`}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <Link href={`/products/${product.slug}`} className="block w-full">
                  <div className={`relative overflow-hidden ${aspects[i % aspects.length]}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.hero}
                      alt={product.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading={index === 0 && i < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(to top, ${theme.bg}cc 0%, transparent 55%)`,
                    }}
                  />
                  <p
                    className="editorial-spacing absolute bottom-4 left-4 text-[8px] opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
                    style={{ color: theme.text }}
                  >
                    {product.name}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
