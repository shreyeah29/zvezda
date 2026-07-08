"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;

type InstagramImage = {
  src: string;
  alt: string;
};

function buildInstagramImages(): InstagramImage[] {
  const seen = new Set<string>();
  const images: InstagramImage[] = [];

  const add = (src: string | undefined | null, alt: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    images.push({ src, alt });
  };

  for (const product of products) {
    add(product.hero, product.name);
    add(product.detail, product.name);
  }

  return images.slice(0, 24);
}

export function HomeInstagramStrip() {
  const images = useMemo(() => buildInstagramImages(), []);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  const marqueeImages = [...images, ...images];

  return (
    <section className="relative bg-ink py-16 md:py-20" aria-label="Instagram gallery">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:px-10">
        <header className="text-center">
          <p className="editorial-spacing text-[10px] text-cream/40">Instagram</p>
          <h2 className="font-display mt-4 text-3xl font-light tracking-tight text-cream md:text-4xl">
            From the atelier to your feed
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/55 md:text-[15px]">
            Glimpses from behind the scenes, fittings, and editorial stills from the Zvezda atelier.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-[32px] border border-cream/10 bg-ink/80 px-6 py-8 md:px-10 md:py-10">
          <motion.div
            className="flex cursor-grab gap-6 md:gap-8"
            whileTap={{ cursor: "grabbing" }}
            drag="x"
            dragConstraints={{ left: -800, right: 0 }}
            onClick={openInstagram}
          >
            {marqueeImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${index}`}
                className="group relative h-[220px] w-[160px] overflow-hidden rounded-[22px] border border-cream/10 bg-black/40 shadow-[0_18px_40px_rgba(0,0,0,0.65)] md:h-[260px] md:w-[190px]"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover object-center"
                  draggable={false}
                  loading={index < 6 ? "eager" : "lazy"}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="overflow-hidden border-t border-cream/15 pt-6">
          <motion.div
            className="flex gap-10 whitespace-nowrap text-[11px] md:text-[12px]"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          >
            {Array.from({ length: 4 }).map((_, loopIndex) => (
              <button
                key={loopIndex}
                type="button"
                onClick={openInstagram}
                className="editorial-spacing flex items-center gap-3 text-cream/60 transition-colors hover:text-cream"
              >
                <span className="h-px w-8 bg-cream/35" />
                <span>Follow on Instagram</span>
                <span>@zvezda_atelier</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
