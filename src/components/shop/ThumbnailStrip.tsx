"use client";

import { forwardRef } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

type ThumbnailStripProps = {
  products: Product[];
  activeIndex: number;
  onPreview: (index: number) => void;
  onOpenProduct: (index: number) => void;
};

export const ThumbnailStrip = forwardRef<HTMLDivElement, ThumbnailStripProps>(
  function ThumbnailStrip({ products, activeIndex, onPreview, onOpenProduct }, ref) {
    return (
      <div
        ref={ref}
        className="shop-thumbnail-strip gpu fixed right-0 bottom-0 left-0 z-40 border-t border-cream/10 bg-black/95 backdrop-blur-md"
        style={{ opacity: 0, transform: "translateY(100%)" }}
      >
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 md:px-8 md:py-5">
          <div className="flex min-w-max items-end gap-3 md:gap-4">
            {products.map((product, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={product.slug}
                  className="shop-thumb-col gpu shrink-0"
                  style={{ width: isActive ? 148 : 120 }}
                  onMouseEnter={() => onPreview(i)}
                  onFocus={() => onPreview(i)}
                >
                  <button
                    type="button"
                    onClick={() => onOpenProduct(i)}
                    className={`shop-thumb w-full overflow-hidden rounded-xl border transition-all duration-500 ${
                      isActive
                        ? "border-cream/35 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                        : "border-cream/10 opacity-70"
                    }`}
                    style={{
                      aspectRatio: "3/4",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                    aria-label={`Open ${product.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.hero}
                      alt=""
                      className="h-full w-full object-cover object-top"
                      draggable={false}
                    />
                  </button>

                  {/* Product info under thumbnail — reference layout */}
                  <button
                    type="button"
                    onClick={() => onOpenProduct(i)}
                    className={`mt-2 w-full text-left transition-opacity duration-300 ${
                      isActive ? "text-cream" : "text-cream/55"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-[11px] leading-tight md:text-xs">
                        {product.name}
                      </p>
                      <p className="shrink-0 text-[10px] md:text-[11px]">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                    <p className="mt-1 text-[9px] text-cream/40">★ 4.9</p>
                    {isActive && (
                      <p className="mt-1.5 line-clamp-2 text-[9px] leading-relaxed text-cream/45">
                        {product.description}
                      </p>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
