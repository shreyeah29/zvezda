"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { LogoRotator } from "@/components/home/LogoRotator";
import { ScrollVelocity } from "@/components/ui/ScrollVelocity";
import { LightRays } from "@/components/ui/LightRays";
import "./HomeInstagramChapter.css";

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

export function HomeInstagramChapter() {
  const images = useMemo(() => buildRotatorImages(), []);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="instagram-chapter" aria-label="Instagram">
      <section className="instagram-chapter__static">
        <div className="instagram-chapter__rays" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#c4a574"
            raysSpeed={0.75}
            lightSpread={1.35}
            rayLength={1.15}
            followMouse
            mouseInfluence={0.08}
            noiseAmount={0.06}
            distortion={0.04}
            fadeDistance={1.8}
            saturation={0.85}
            className="instagram-chapter__rays-canvas"
          />
        </div>

        <div className="instagram-chapter__static-inner">
          <p className="instagram-chapter__label editorial-spacing">Instagram</p>

          <motion.h2
            className="instagram-chapter__heading"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            The Story Continues.
          </motion.h2>

          <motion.p
            className="instagram-chapter__body"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Behind-the-scenes moments and new collections from the atelier.
          </motion.p>

          <motion.div
            className="instagram-chapter__gallery"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoRotator
              images={images}
              speed={12}
              imageWidth={200}
              aspectRatio={0.75}
              imageRadius={10}
              onImageClick={openInstagram}
              premium
            />
          </motion.div>

          <motion.div
            className="instagram-chapter__velocity-band"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="instagram-chapter__velocity-band-fade instagram-chapter__velocity-band-fade--left" />
            <div className="instagram-chapter__velocity-band-fade instagram-chapter__velocity-band-fade--right" />
            <ScrollVelocity
              texts={["@zvezdaatelier", "@zvezdaatelier"]}
              velocity={22}
              numCopies={10}
              className="instagram-chapter__scroll-handle"
              parallaxClassName="instagram-chapter__velocity-track"
              scrollerClassName="instagram-chapter__velocity-scroller"
              velocityMapping={{ input: [0, 1200], output: [0, 3] }}
            />
          </motion.div>

          <button type="button" onClick={openInstagram} className="instagram-chapter__follow">
            <span>Follow the Story</span>
            <span className="instagram-chapter__follow-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
