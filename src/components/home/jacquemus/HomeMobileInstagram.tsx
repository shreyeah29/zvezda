"use client";

import { useMaxWidth } from "@/hooks/useMaxWidth";
import { products } from "@/data/products";
import { ScrollTickerPro } from "@/components/ui/ScrollTickerPro";
import "./HomeMobileInstagram.css";

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/";

const INSTAGRAM_PICKS = [
  "set-12",
  "set-8",
  "set-1",
  "set-13",
  "set-5",
  "set-11",
] as const;

export function HomeMobileInstagram() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const images = INSTAGRAM_PICKS.map((slug) => products.find((p) => p.slug === slug)).filter(
    Boolean,
  );

  return (
    <section className="hm-instagram" aria-label="Follow our journey on Instagram">
      <div className="hm-instagram__header">
        <ScrollTickerPro className="hm-instagram__ticker-pro" />
      </div>

      <div className="hm-instagram__grid">
        {images.map((product) => (
          <a
            key={product!.slug}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="hm-instagram__cell"
            aria-label={`View ${product!.name} on Instagram`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product!.hero} alt="" className="hm-instagram__image" loading="lazy" />
          </a>
        ))}
      </div>

      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hm-instagram__cta">
        View more on Instagram
      </a>
    </section>
  );
}
