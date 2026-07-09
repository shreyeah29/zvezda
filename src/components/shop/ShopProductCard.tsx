"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";

const EASE = [0.22, 1, 0.36, 1] as const;

type ShopProductCardProps = {
  product: Product;
  index?: number;
  compact?: boolean;
};

export function ShopProductCard({ product, index = 0, compact = false }: ShopProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const secondary = product.gallery[0] ?? product.detail ?? product.hero;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.06, ease: EASE }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={`relative overflow-hidden bg-zinc-950 ${
            compact ? "rounded-lg border border-cream/8" : "rounded-2xl border border-cream/10"
          }`}
        >
          <div className={`relative overflow-hidden ${compact ? "aspect-[3/4.2]" : "aspect-[3/4]"}`}>
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.05 : 1, opacity: hovered && secondary !== product.hero ? 0 : 1 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.hero}
                alt={product.name}
                className="h-full w-full object-cover object-[center_18%]"
              />
            </motion.div>
            {secondary !== product.hero && (
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.03 : 1.06 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={secondary}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover object-[center_18%]"
                />
              </motion.div>
            )}
          </div>
          <div
            className={`absolute z-10 rounded-full border border-cream/10 bg-ink/50 backdrop-blur-sm ${
              compact ? "top-2 right-2" : "top-3 right-3"
            }`}
          >
            <WishlistButton slug={product.slug} size="sm" />
          </div>
        </div>

        <div className={`relative overflow-hidden ${compact ? "mt-3" : "mt-4"}`}>
          <motion.p
            className={
              compact
                ? "font-[family-name:var(--font-shop-display)] text-sm font-medium text-cream md:text-[0.95rem]"
                : "font-[family-name:var(--font-shop-display)] text-base font-medium text-cream md:text-lg"
            }
            animate={{ y: hovered ? -2 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {product.name}
          </motion.p>
          <p className={`editorial-spacing text-gold/90 ${compact ? "mt-1.5 text-[9px]" : "mt-2 text-[10px]"}`}>
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>

      {!compact && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 pt-24 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-auto px-1 pb-1">
            <AddToCartButton slug={product.slug} className="w-full" label="Add to Cart" />
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
