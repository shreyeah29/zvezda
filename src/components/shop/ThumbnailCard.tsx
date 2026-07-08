"use client";

import { THUMB_SPACING } from "@/lib/motion/MotionUtilities";
import type { Product } from "@/data/products";

type ThumbnailCardProps = {
  product: Product;
  index: number;
  onClick: () => void;
};

/** Single premium thumbnail in the bottom product strip */
export function ThumbnailCard({ product, index, onClick }: ThumbnailCardProps) {
  const thumbSize = THUMB_SPACING - 12;

  return (
    <button
      type="button"
      data-thumb
      data-thumb-index={index}
      onClick={onClick}
      className="gpu shrink-0 overflow-hidden rounded-xl border border-cream/12 will-change-transform transition-[border-color] duration-500"
      style={{
        width: thumbSize,
        height: thumbSize * 1.35,
        opacity: 0.42,
        transform: "scale(1)",
      }}
      aria-label={`Select ${product.name}`}
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
}
