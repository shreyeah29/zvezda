"use client";

import { useMaxWidth } from "@/hooks/useMaxWidth";
import { products } from "@/data/products";
import "./HomeMobileInstagram.css";

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/";

const INSTAGRAM_PICKS = ["set-15", "set-12", "set-1"] as const;

function InstagramGlyph() {
  return (
    <svg
      className="hm-instagram__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" />
    </svg>
  );
}

export function HomeMobileInstagram() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const images = INSTAGRAM_PICKS.map((slug) => products.find((p) => p.slug === slug)).filter(
    Boolean,
  );

  return (
    <section className="hm-instagram" aria-labelledby="hm-instagram-heading">
      <div className="hm-instagram__header">
        <InstagramGlyph />
        <h2 id="hm-instagram-heading" className="hm-instagram__heading">
          Instagram
        </h2>
      </div>

      <div className="hm-instagram__strip" role="list">
        {images.map((product) => (
          <a
            key={product!.slug}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="hm-instagram__cell"
            role="listitem"
            aria-label={`Open Instagram — ${product!.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product!.hero} alt="" className="hm-instagram__image" loading="lazy" />
          </a>
        ))}
      </div>

      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hm-instagram__handle">
        @zvezda_atelier
      </a>
    </section>
  );
}
