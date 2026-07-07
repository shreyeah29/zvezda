"use client";

import { forwardRef } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

type ThumbnailStripProps = {
  products: Product[];
  activeIndex: number;
  onSelect: (index: number) => void;
  light?: boolean;
};

export const ThumbnailStrip = forwardRef<HTMLDivElement, ThumbnailStripProps>(
  function ThumbnailStrip({ products, activeIndex, onSelect, light = false }, ref) {
    const bg = light ? "bg-cream/90 border-ink/10" : "bg-ink/90 border-cream/10";
    const text = light ? "text-ink" : "text-cream";

    return (
      <div
        ref={ref}
        className={`shop-thumbnail-strip gpu fixed right-0 bottom-0 left-0 z-40 border-t backdrop-blur-md ${bg}`}
        style={{ opacity: 0, transform: "translateY(100%)" }}
      >
        <div className="mx-auto flex max-w-7xl items-end gap-3 overflow-x-auto px-4 py-4 md:gap-4 md:px-8 md:py-5">
          {products.map((product, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={product.slug}
                type="button"
                data-thumb-index={i}
                onMouseEnter={() => onSelect(i)}
                onFocus={() => onSelect(i)}
                className={`shop-thumb gpu shrink-0 overflow-hidden rounded-xl transition-[transform,opacity,filter] duration-500 ${
                  isActive ? "ring-1 ring-gold/60" : ""
                }`}
                style={{
                  width: isActive ? "clamp(72px, 8vw, 96px)" : "clamp(56px, 6vw, 72px)",
                  aspectRatio: "3/4",
                  opacity: isActive ? 1 : 0.55,
                }}
                aria-label={product.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.hero}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        {/* Active product detail — animated on hover */}
        <div
          data-product-detail
          className={`border-t px-6 py-4 md:px-10 ${light ? "border-ink/10" : "border-cream/10"}`}
        >
          <div className={`flex items-baseline justify-between gap-4 ${text}`}>
            <div>
              <p className="editorial-spacing text-[9px] opacity-50">
                {products[activeIndex]?.collectionLabel}
              </p>
              <p className="font-display mt-1 text-xl md:text-2xl">
                {products[activeIndex]?.name}
              </p>
            </div>
            <p data-detail-price className="font-display text-lg md:text-xl">
              {products[activeIndex] && formatPrice(products[activeIndex].price)}
            </p>
          </div>
          <p
            data-detail-desc
            className={`mt-2 max-w-xl text-xs leading-relaxed md:text-sm ${light ? "text-ink/60" : "text-cream/60"}`}
          >
            {products[activeIndex]?.description}
          </p>
        </div>
      </div>
    );
  }
);
