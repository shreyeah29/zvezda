"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import "./HomeInstagramSection.css";

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;
const EASE = [0.22, 1, 0.36, 1] as const;

const CAPTIONS = [
  "Behind the atelier doors",
  "Silk in motion",
  "Conservatory light",
  "The making of Crimson",
  "Garden campaign",
  "Evening rehearsal",
];

function buildInstagramGrid() {
  const slugs = ["set-12", "set-1", "set-8", "set-13", "set-5", "set-11"];
  return slugs
    .map((slug, i) => {
      const product = products.find((p) => p.slug === slug);
      if (!product) return null;
      return {
        src: product.hero,
        alt: product.name,
        caption: CAPTIONS[i] ?? product.name,
      };
    })
    .filter(Boolean) as { src: string; alt: string; caption: string }[];
}

export function HomeInstagramSection() {
  const items = useMemo(() => buildInstagramGrid(), []);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="home-instagram editorial-section" aria-labelledby="home-instagram-heading">
      <div className="editorial-container">
        <header className="home-instagram__header">
          <p className="editorial-eyebrow">Instagram</p>
          <motion.h2
            id="home-instagram-heading"
            className="editorial-heading home-instagram__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Beyond the Atelier
          </motion.h2>
        </header>

        <div className="home-instagram__grid">
          {items.map((item, index) => (
            <motion.button
              key={item.src}
              type="button"
              className={`home-instagram__item home-instagram__item--${(index % 3) + 1}`}
              onClick={openInstagram}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: index * 0.06, ease: EASE }}
              whileHover={{ y: -6 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="home-instagram__image" loading="lazy" />
              <span className="home-instagram__caption">{item.caption}</span>
            </motion.button>
          ))}
        </div>

        <div className="home-instagram__cta-wrap">
          <button type="button" onClick={openInstagram} className="editorial-link-arrow home-instagram__cta">
            View on Instagram
            <span className="editorial-link-arrow__icon" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
