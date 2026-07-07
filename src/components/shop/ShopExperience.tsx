"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { products, formatPrice } from "@/data/products";
import { useLenis } from "@/hooks/useLenis";
import { useShopScrollAnimations, animateCardHover } from "@/hooks/useShopScrollAnimations";
import { ShopNav } from "@/components/shop/ShopNav";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ThumbnailStrip } from "@/components/shop/ThumbnailStrip";

const FEATURED = products.slice(0, 5);

export function ShopExperience() {
  useLenis();

  const [lightMode, setLightMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onLightMode = useCallback((v: boolean) => setLightMode(v), []);

  useShopScrollAnimations(
    {
      root: rootRef,
      stage: stageRef,
      container: containerRef,
      nav: navRef,
      cards: cardRefs,
      copy: copyRef,
      headline: headlineRef,
      detailPanel: detailPanelRef,
      thumbStrip: thumbStripRef,
      page: pageRef,
    },
    onLightMode
  );

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Map full product index to featured card if within first 5, else highlight via opacity
    if (index < 5) {
      animateCardHover(cards, index);
    } else {
      // Dim all featured cards slightly when browsing non-featured thumbnails
      cards.forEach((card) => {
        gsap.to(card, { opacity: 0.35, filter: "blur(3px)", duration: 0.4 });
      });
    }

    // Animate price + description text
    const detail = thumbStripRef.current?.querySelector("[data-product-detail]");
    if (detail) {
      gsap.fromTo(
        detail.querySelectorAll("[data-detail-price], [data-detail-desc]"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    }
  };

  const activeProduct = products[activeIndex] ?? products[0];

  return (
    <div
      ref={pageRef}
      className={`min-h-screen transition-none ${lightMode ? "bg-cream" : "bg-ink"}`}
    >
      <section ref={rootRef} className="relative">
        {/* Pinned stage */}
        <div ref={stageRef} className="relative flex h-screen items-center justify-center">
          {/* 90vw rounded container — initially black */}
          <div
            ref={containerRef}
            className="gpu relative overflow-hidden rounded-[28px] border border-transparent md:rounded-[36px]"
            style={{
              width: "90vw",
              height: "clamp(520px, 85vh, 900px)",
              backgroundColor: "#0a0a0a",
            }}
          >
            <ShopNav ref={navRef} light={lightMode} />

            {/* Top-left copy */}
            <div
              ref={copyRef}
              className="absolute top-20 left-6 z-20 max-w-[200px] md:top-24 md:left-10 md:max-w-xs"
              style={{ color: "#f5f0e8" }}
            >
              <p className="editorial-spacing text-[9px] opacity-50">Collection</p>
              <p className="mt-3 text-xs leading-relaxed opacity-70 md:text-sm">
                {activeProduct.description}
              </p>
            </div>

            {/* Top-right headline */}
            <div
              ref={headlineRef}
              className="absolute top-20 right-6 z-20 text-right md:top-24 md:right-10"
              style={{ color: "#f5f0e8" }}
            >
              <h1 className="font-display text-3xl font-light tracking-wide md:text-5xl lg:text-6xl">
                {activeProduct.name}
              </h1>
              <p
                ref={detailPanelRef}
                className="mt-2 font-display text-lg opacity-60 md:text-xl"
              >
                {formatPrice(activeProduct.price)}
              </p>
            </div>

            {/* Product cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              {FEATURED.map((product, i) => (
                <ShopProductCard
                  key={product.slug}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  product={product}
                  index={i}
                  visible={i === 0}
                />
              ))}
            </div>

            {/* Scroll hint */}
            <p
              className={`editorial-spacing absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] ${
                lightMode ? "text-ink/40" : "text-cream/40"
              }`}
            >
              Scroll to explore
            </p>
          </div>
        </div>
      </section>

      {/* Thumbnail strip — all products, sticky at bottom */}
      <ThumbnailStrip
        ref={thumbStripRef}
        products={products}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        light={lightMode}
      />

      {/* Product links below scroll zone */}
      <div
        className={`px-6 py-24 md:px-12 ${lightMode ? "bg-cream text-ink" : "bg-ink text-cream"}`}
      >
        <div className="mx-auto max-w-7xl">
          <p className="editorial-spacing mb-12 text-[10px] opacity-50">All pieces</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group gpu block overflow-hidden rounded-2xl"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.hero}
                    alt={product.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="font-display text-xl">{product.name}</p>
                  <p className="text-sm opacity-60">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
