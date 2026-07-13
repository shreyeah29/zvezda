"use client";

import Link from "next/link";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { getProduct } from "@/data/products";
import { pinkHighlightCards, shopHighlightCards } from "@/data/shopHighlightCards";
import "./HomeMobileShop.css";

const PINK_MOBILE_TITLES = [
  "Pink Collection",
  "Rose Cascade Collection",
  "Blush Coordination",
  "Petal Garden & Rose Mirage",
];

function MobileSectionHeading({ label }: { label: string }) {
  return (
    <div className="hm-section-heading">
      <span>{label}</span>
    </div>
  );
}

function MobileShopCard({
  href,
  image,
  alt,
  title,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
}) {
  return (
    <Link href={href} className="hm-shop__cat-card">
      <div className="hm-shop__cat-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className="hm-shop__cat-image" loading="lazy" />
        <div className="hm-shop__cat-scrim" aria-hidden="true" />
      </div>
      <div className="hm-shop__cat-copy">
        <h3 className="hm-shop__cat-title">{title}</h3>
        <span className="hm-shop__cat-cta">Shop now</span>
      </div>
    </Link>
  );
}

export function HomeMobileShop() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  return (
    <section className="hm-shop hm-shop--bw" aria-label="Noir collection">
      <MobileSectionHeading label="Noir Collection" />
      <div className="hm-shop__cat-grid">
        {shopHighlightCards.map((card) => {
          const product = getProduct(card.slug);
          if (!product) return null;

          return (
            <MobileShopCard
              key={card.slug}
              href={`/products/${card.slug}`}
              image={card.image}
              alt={product.name}
              title={card.title}
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

  return (
    <section className="hm-shop hm-shop--pink" aria-label="Pink collection">
      <MobileSectionHeading label="Pink Collection" />
      <div className="hm-shop__cat-grid">
        {pinkHighlightCards.map((card, index) => {
          const product = getProduct(card.slug);
          if (!product) return null;

          return (
            <MobileShopCard
              key={card.slug}
              href={`/products/${card.slug}`}
              image={card.image}
              alt={product.name}
              title={PINK_MOBILE_TITLES[index] ?? card.title}
            />
          );
        })}
      </div>
    </section>
  );
}
