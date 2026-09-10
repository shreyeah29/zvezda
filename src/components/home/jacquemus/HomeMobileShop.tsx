"use client";

import Link from "next/link";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { findProduct } from "@/data/findProduct";
import { pinkHighlightCards, shopHighlightCards } from "@/data/shopHighlightCards";
import "./HomeMobileShop.css";

function MobileSectionHeading({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div className="hm-section-heading">
      <div className="hm-section-heading__lines" aria-hidden="true">
        <span className="hm-section-heading__primary">{primary}</span>
        <span className="hm-section-heading__secondary">{secondary}</span>
      </div>
    </div>
  );
}

function MobileShopCard({
  href,
  image,
  alt,
  title,
  size = "default",
  showCta = true,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  size?: "default" | "large" | "small" | "hero" | "support";
  showCta?: boolean;
}) {
  return (
    <Link href={href} className={`hm-shop__cat-card hm-shop__cat-card--${size}`}>
      <div className="hm-shop__cat-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className="hm-shop__cat-image" loading="lazy" />
        <div className="hm-shop__cat-scrim" aria-hidden="true" />
      </div>
      <div className="hm-shop__cat-copy">
        <h3 className="hm-shop__cat-title">{title}</h3>
        {showCta && <span className="hm-shop__cat-cta">Shop now</span>}
      </div>
    </Link>
  );
}

export function HomeMobileShop() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const [a, b, c, d] = shopHighlightCards;

  return (
    <section className="hm-shop hm-shop--noir" aria-label="Statement collection">
      <MobileSectionHeading primary="Statement" secondary="Collection" />
      <div className="hm-bento">
        {[a, b, c, d].map((card) => {
          const product = findProduct(card.slug);
          if (!product) return null;

          return (
            <MobileShopCard
              key={card.slug}
              href="/collections/statement"
              image={card.image}
              alt={product.name}
              title={product.name}
            />
          );
        })}
      </div>
    </section>
  );
}

export function HomeMobilePinkShop() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const hero = pinkHighlightCards[0];
  const support = pinkHighlightCards.slice(1, 3);
  const heroProduct = hero ? findProduct(hero.slug) : null;

  return (
    <section className="hm-shop hm-shop--pink" aria-label="Romance collection">
      <MobileSectionHeading primary="Romance" secondary="Collection" />

      {hero && heroProduct && (
        <Link href="/collections/romance" className="hm-pink__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.image}
            alt={heroProduct.name}
            className="hm-pink__hero-image"
            loading="lazy"
          />
          <div className="hm-pink__hero-scrim" aria-hidden="true" />
          <div className="hm-pink__hero-copy">
            <span className="hm-pink__hero-line">Romance</span>
            <span className="hm-pink__hero-line">Collection</span>
            <span className="hm-pink__hero-cta">Shop now</span>
          </div>
        </Link>
      )}

      <div className="hm-pink__support">
        {support.map((card) => {
          const product = findProduct(card.slug);
          if (!product) return null;

          return (
            <MobileShopCard
              key={card.slug}
              href="/collections/romance"
              image={card.image}
              alt={product.name}
              title={product.name}
              size="support"
            />
          );
        })}
      </div>
    </section>
  );
}
