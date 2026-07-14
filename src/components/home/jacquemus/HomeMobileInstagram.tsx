"use client";

import { useMaxWidth } from "@/hooks/useMaxWidth";
import { products } from "@/data/products";
import "./HomeMobileInstagram.css";

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/";

const INSTAGRAM_PICKS = ["set-15", "set-12", "set-1", "set-13"] as const;

export function HomeMobileInstagram() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const images = INSTAGRAM_PICKS.map((slug) => products.find((p) => p.slug === slug)).filter(
    Boolean,
  );

  return (
    <section className="hm-instagram" aria-label="Follow ZVEZDA Atelier on Instagram">
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

      <div className="hm-instagram__meta">
        <p className="hm-instagram__label">Atelier journal</p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hm-instagram__handle">
          @zvezda_atelier
        </a>
      </div>
    </section>
  );
}
