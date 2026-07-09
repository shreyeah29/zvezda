"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { shopHighlightCards } from "@/data/shopHighlightCards";
import { ScrollCue } from "@/components/ui/ScrollCue";
import "./HomeShopCards.css";

export function HomeShopCards() {
  return (
    <section className="home-shop-cards" aria-label="Featured collections">
      <div className="home-shop-cards__grid">
        {shopHighlightCards.map((card, index) => (
          <motion.article
            key={card.slug}
            className="home-shop-cards__card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.image} alt={card.title} className="home-shop-cards__image" loading="lazy" />
            <div className="home-shop-cards__scrim" aria-hidden="true" />
            <h3 className="home-shop-cards__title">{card.title}</h3>
            <Link href={`/shop?set=${card.slug}`} className="home-shop-cards__shop">
              Shop
            </Link>
          </motion.article>
        ))}
      </div>
      <ScrollCue
        className="home-shop-cards__cue"
        label="Scroll down to explore the collection"
      />
    </section>
  );
}
