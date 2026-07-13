"use client";

import Link from "next/link";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { getProduct } from "@/data/products";
import { pinkHighlightCards, shopHighlightCards } from "@/data/shopHighlightCards";
import "./HomeMobileShop.css";

export function HomeMobileShop() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  return (
    <section className="hm-shop hm-shop--bw" aria-label="Black and white collection">
      <div className="hm-shop__cat-grid">
        {shopHighlightCards.map((card) => {
          const product = getProduct(card.slug);
          if (!product) return null;

          return (
            <Link
              key={card.slug}
              href={`/products/${card.slug}`}
              className="hm-shop__cat-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={product.name}
                className="hm-shop__cat-image"
                loading="lazy"
              />
              <div className="hm-shop__cat-scrim" aria-hidden="true" />
              <div className="hm-shop__cat-band">
                <h3 className="hm-shop__cat-title">{card.title}</h3>
              </div>
              <span className="hm-shop__cat-cta">Shop now</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function HomeMobilePinkShop() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  return (
    <section className="hm-shop hm-shop--pink" aria-label="Pink collection">
      <div className="hm-shop__cat-grid">
        {pinkHighlightCards.map((card) => {
          const product = getProduct(card.slug);
          if (!product) return null;

          return (
            <Link
              key={card.slug}
              href={`/products/${card.slug}`}
              className="hm-shop__cat-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={product.name}
                className="hm-shop__cat-image"
                loading="lazy"
              />
              <div className="hm-shop__cat-scrim" aria-hidden="true" />
              <div className="hm-shop__cat-band">
                <h3 className="hm-shop__cat-title">{card.title}</h3>
              </div>
              <span className="hm-shop__cat-cta">Shop now</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
