"use client";

import { useMaxWidth } from "@/hooks/useMaxWidth";
import { products } from "@/data/products";
import { ScrollTicker } from "@/components/ui/ScrollTicker";
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

const TICKER_ITEMS = ["Follow our journey", "@zvezda.atelier", "ZVEZDA"] as const;

export function HomeMobileInstagram() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const images = INSTAGRAM_PICKS.map((slug) => products.find((p) => p.slug === slug)).filter(
    Boolean,
  );

  return (
    <section className="hm-instagram" aria-label="Follow our journey on Instagram">
      <div className="hm-instagram__header">
        <ScrollTicker
          className="hm-instagram__ticker"
          baseSpeed={70}
          gap={28}
          boostIntensity={1.2}
          initialDirection="left"
        >
          {TICKER_ITEMS.map((label) => (
            <span key={label} className="scroll-ticker__item">
              <span>{label}</span>
              <span className="scroll-ticker__dot" aria-hidden="true" />
            </span>
          ))}
        </ScrollTicker>
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
