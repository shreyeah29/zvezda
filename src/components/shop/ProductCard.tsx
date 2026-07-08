"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { CARD_HEIGHT, CARD_RADIUS, CARD_WIDTH } from "@/lib/motion/MotionUtilities";

type ProductCardProps = {
  product: Product;
  index: number;
  isSelected: boolean;
  isCenter: boolean;
  onSelect: (index: number) => void;
};

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  function ProductCard({ product, index, isSelected, isCenter, onSelect }, ref) {
    const showSharedLayout = isSelected && isCenter;

    return (
      <div
        ref={ref}
        data-product-index={index}
        className="gpu absolute top-1/2 will-change-transform"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginTop: -CARD_HEIGHT / 2,
          transform: "translate3d(0,0,0)",
        }}
        onClick={() => onSelect(index)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(index);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          showSharedLayout
            ? `Open ${product.name} product page`
            : `Select ${product.name}`
        }
      >
        <motion.div
          layoutId={showSharedLayout ? `product-card-${product.slug}` : undefined}
          className="relative h-full w-full overflow-hidden border bg-zinc-950/80"
          style={{
            borderRadius: CARD_RADIUS,
            borderColor: isSelected ? "rgba(245,240,232,0.28)" : "rgba(245,240,232,0.16)",
            boxShadow: isCenter
              ? "0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,240,232,0.06) inset"
              : "0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,240,232,0.04) inset",
            cursor: showSharedLayout ? "pointer" : "grab",
          }}
          transition={{ layout: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-card-image
            src={product.hero}
            alt={product.name}
            className="pointer-events-none h-full w-full object-cover object-top"
            draggable={false}
          />

          {/* Subtle vignette — keeps border visible */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 100%)",
            }}
          />

          {showSharedLayout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-10"
            >
              <p className="editorial-spacing text-[8px] text-cream/70">Explore Piece →</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }
);
