"use client";

import { forwardRef } from "react";
import type { Product } from "@/data/products";

type ShopProductCardProps = {
  product: Product;
  index: number;
  visible?: boolean;
};

export const ShopProductCard = forwardRef<HTMLDivElement, ShopProductCardProps>(
  function ShopProductCard({ product, index, visible = index === 0 }, ref) {
    return (
      <div
        ref={ref}
        data-card-index={index}
        className="shop-card gpu pointer-events-none absolute will-change-transform"
        style={{
          width: "clamp(200px, 22vw, 280px)",
          aspectRatio: "3/4",
          opacity: visible ? 1 : 0,
          zIndex: index === 0 ? 5 : 1,
        }}
      >
        {/* White card background — dissolved in phase 2 */}
        <div
          data-card-bg
          className="absolute inset-0 rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:rounded-3xl"
        />

        {/* Image mask wrapper — clip-path animated in phase 2 */}
        <div
          data-card-mask
          className="absolute inset-3 overflow-hidden rounded-xl md:inset-4 md:rounded-2xl"
          style={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-card-model
            src={product.hero}
            alt={product.name}
            className="h-full w-full object-cover object-top"
            draggable={false}
          />
        </div>
      </div>
    );
  }
);
