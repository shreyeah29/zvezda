"use client";

import Link from "next/link";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { findProduct } from "@/data/findProduct";
import {
  occasionHighlightCards,
  pinkHighlightCards,
  romanceHighlightCards,
  shopHighlightCards,
  statementHighlightCards,
  type ShopHighlightCard,
} from "@/data/shopHighlightCards";
import "./HomeMobileShop.css";

const BESPOKE_IMAGE = "/assets/images/shop/blooming-rosalia-3d-gown/BHA_4523.jpg";

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
    <section className="hm-shop hm-shop--noir" aria-label="Noir collection">
      <MobileSectionHeading primary="Noir" secondary="Collection" />
      <div className="hm-bento">
        {[a, b, c, d].map((card) => {
          const product = findProduct(card.slug);
          if (!product) return null;

          return (
            <MobileShopCard
              key={card.slug}
              href={`/products/${card.slug}`}
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
  return (
    <HomeMobileCollectionShop
      name="Pink"
      href="/collections/romance"
      cards={pinkHighlightCards}
    />
  );
}

function HomeMobileCollectionShop({
  name,
  href,
  cards,
}: {
  name: string;
  href: string;
  cards: ShopHighlightCard[];
}) {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  const hero = cards[0];
  const support = cards.slice(1, 3);
  const heroProduct = hero ? findProduct(hero.slug) : null;

  return (
    <section className="hm-shop hm-shop--pink" aria-label={`${name} collection`}>
      <MobileSectionHeading primary={name} secondary="Collection" />

      {hero && (
        <Link href={href} className="hm-pink__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.image}
            alt={heroProduct?.name ?? `${name} collection`}
            className="hm-pink__hero-image"
            loading="lazy"
          />
          <div className="hm-pink__hero-scrim" aria-hidden="true" />
          <div className="hm-pink__hero-copy">
            <span className="hm-pink__hero-line">{name}</span>
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
              href={`/products/${card.slug}`}
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

export function HomeMobileBespoke() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  return (
    <section className="hm-bespoke" aria-label="Bespoke">
      <Link href="/collections/bespoke" className="hm-bespoke__banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BESPOKE_IMAGE}
          alt="Bespoke"
          className="hm-bespoke__image"
        />
        <div className="hm-bespoke__copy">
          <span className="hm-bespoke__title">Bespoke</span>
          <span className="hm-bespoke__cta">Explore now</span>
        </div>
      </Link>
    </section>
  );
}

export function HomeMobileRomanceShop() {
  return (
    <HomeMobileCollectionShop
      name="Romance"
      href="/collections/romance"
      cards={romanceHighlightCards}
    />
  );
}

export function HomeMobileStatementShop() {
  return (
    <HomeMobileCollectionShop
      name="Statement"
      href="/collections/statement"
      cards={statementHighlightCards}
    />
  );
}

export function HomeMobileOccasionShop() {
  return (
    <HomeMobileCollectionShop
      name="Occasion"
      href="/collections/occasion"
      cards={occasionHighlightCards}
    />
  );
}
