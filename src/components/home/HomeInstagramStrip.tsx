"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { LogoRotator } from "@/components/home/LogoRotator";

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;

function buildRotatorImages() {
  const picks = [
    products.find((p) => p.slug === "set-12"),
    products.find((p) => p.slug === "set-8"),
    products.find((p) => p.slug === "set-1"),
    products.find((p) => p.slug === "set-13"),
    products.find((p) => p.slug === "set-5"),
    products.find((p) => p.slug === "set-11"),
  ].filter(Boolean);

  return picks.map((product) => ({
    src: product!.hero,
    alt: product!.name,
  }));
}

export function HomeInstagramStrip() {
  const images = useMemo(() => buildRotatorImages(), []);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative bg-ink py-16 md:py-24" aria-label="Instagram gallery">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:px-10">
        <header className="text-center">
          <p className="editorial-spacing text-[10px] text-cream/40">Instagram</p>
          <h2 className="font-display mt-4 text-3xl font-light tracking-tight text-cream md:text-4xl">
            From the atelier to your feed
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/55 md:text-[15px]">
            Glimpses from behind the scenes, fittings, and editorial stills from the Zvezda atelier.
          </p>
        </header>

        <div className="relative overflow-hidden">
          <LogoRotator
            images={images}
            speed={14}
            imageWidth={300}
            aspectRatio={0.75}
            imageRadius={12}
            onImageClick={openInstagram}
          />
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
