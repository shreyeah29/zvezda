"use client";

import Link from "next/link";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { getProduct } from "@/data/products";
import { homeMobileNewInItems } from "@/data/homeMobileNewIn";
import { shopHighlightCards } from "@/data/shopHighlightCards";
import "./HomeMobileShop.css";

export function HomeMobileShop() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  return (
    <div className="hm-shop">
      <section className="hm-shop__categories" aria-label="Shop collections">
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
                <span className="hm-shop__cat-tag">New</span>
                <div className="hm-shop__cat-band">
                  <h3 className="hm-shop__cat-title">{card.title}</h3>
                </div>
                <span className="hm-shop__cat-cta">Shop now</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="hm-shop__new-in" aria-label="New in">
        <Link href="/shop" className="hm-shop__new-in-bar">
          <span>New in</span>
          <span className="hm-shop__new-in-arrow" aria-hidden="true">
            →
          </span>
        </Link>
        <div className="hm-shop__new-in-grid">
          {homeMobileNewInItems.map((item) => {
            const product = getProduct(item.slug);
            if (!product) return null;

            return (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="hm-shop__new-in-cell"
                aria-label={product.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  className="hm-shop__new-in-image"
                  loading="lazy"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <hr className="hm-shop__divider" aria-hidden="true" />
    </div>
  );
}
