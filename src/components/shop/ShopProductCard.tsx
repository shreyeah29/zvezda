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
};

export function ShopProductCard({ product, index = 0 }: ShopProductCardProps) {
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
        <div className="relative overflow-hidden rounded-2xl border border-cream/10 bg-zinc-950">
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.06 : 1, opacity: hovered && secondary !== product.hero ? 0 : 1 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.hero}
                alt={product.name}
                className="h-full w-full object-cover object-top"
              />
            </motion.div>
            {secondary !== product.hero && (
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.04 : 1.08 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={secondary}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover object-top"
                />
              </motion.div>
            )}
          </div>
          <div className="absolute top-3 right-3 z-10 rounded-full border border-cream/10 bg-ink/50 backdrop-blur-sm">
            <WishlistButton slug={product.slug} size="sm" />
          </div>
        </div>

        <div className="relative mt-5 overflow-hidden">
          <motion.p
            className="font-display text-xl font-light text-cream md:text-2xl"
            animate={{ y: hovered ? -4 : 0, opacity: hovered ? 1 : 0.88 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {product.name}
          </motion.p>
          <motion.p
            className="editorial-spacing mt-2 text-[9px] text-gold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {formatPrice(product.price, product.currency)}
          </motion.p>
        </div>
      </Link>

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
    </motion.article>
  );
}
