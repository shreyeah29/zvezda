"use client";

import { forwardRef } from "react";
import type { Product } from "@/data/products";

type OverflowProductCardProps = {
  product: Product;
  index: number;
};

export const OverflowProductCard = forwardRef<HTMLDivElement, OverflowProductCardProps>(
  function OverflowProductCard({ product, index }, ref) {
    return (
      <div
        ref={ref}
        data-overflow-index={index}
        className="gpu absolute top-1/2 will-change-transform"
        style={{
          width: "clamp(200px, 20vw, 260px)",
          aspectRatio: "3/4",
          marginTop: "calc(-1 * clamp(200px, 20vw, 260px) * 4 / 6)",
          transform: "translate3d(0,0,0)",
          opacity: 0,
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cream/18 bg-zinc-950 shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-overflow-image
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
