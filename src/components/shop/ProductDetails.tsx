"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, type Product } from "@/data/products";

const SIZES = ["XS", "S", "M", "L", "XL"];

const COLLECTION_COLORS: Record<string, string[]> = {
  garden: ["#4a5240", "#6b7560", "#3d4436"],
  peach: ["#d4a088", "#e8c4b0", "#c48870"],
  pink: ["#e8a4b8", "#f5c6d4", "#d4849c"],
  noir: ["#1a1a1a", "#4a4a4a", "#f5f0e8"],
  yellow: ["#c9a227", "#e8c547", "#a68520"],
  red: ["#8b1a2b", "#c42d42", "#5c1019"],
  orange: ["#c47a3a", "#e89a55", "#9a5520"],
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type ProductDetailsProps = {
  product: Product;
  className?: string;
};

export function ProductDetails({ product, className = "" }: ProductDetailsProps) {
  const colors = COLLECTION_COLORS[product.collection] ?? ["#c4a574"];

  return (
    <aside
      className={`relative z-40 w-[300px] shrink-0 flex-col justify-center border-l border-cream/10 px-8 py-10 xl:w-[340px] ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={product.slug}
          variants={stagger}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="space-y-5"
        >
          <motion.p variants={item} className="editorial-spacing text-[9px] text-cream/40">
            {product.collectionLabel}
          </motion.p>

          <motion.h2 variants={item} className="font-display text-3xl font-light leading-tight text-cream">
            {product.name}
          </motion.h2>

          <motion.p variants={item} className="text-xs leading-relaxed text-cream/55">
            {product.story}
          </motion.p>

          <motion.p variants={item} className="font-display text-2xl text-cream/90">
            {formatPrice(product.price, product.currency)}
          </motion.p>

          {/* Color swatches */}
          <motion.div variants={item} className="flex gap-2 pt-1">
            {colors.map((color, i) => (
              <button
                key={color}
                type="button"
                className="h-5 w-5 rounded-full border border-cream/20 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  outline: i === 0 ? "1px solid rgba(245,240,232,0.5)" : "none",
                  outlineOffset: 2,
                }}
                aria-label={`Color option ${i + 1}`}
              />
            ))}
          </motion.div>

          {/* Sizes */}
          <motion.div variants={item} className="flex flex-wrap gap-2 pt-1">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className="editorial-spacing border border-cream/15 px-3 py-2 text-[9px] text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
              >
                {size}
              </button>
            ))}
          </motion.div>

          <motion.p variants={item} className="text-[10px] text-cream/35">
            Made to order · 6–8 weeks
          </motion.p>

          <motion.div variants={item} className="flex gap-3 pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="editorial-spacing flex-1 border border-cream/30 py-3.5 text-[9px] text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              Add to Cart
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="editorial-spacing border border-cream/15 px-4 py-3.5 text-[9px] text-cream/50 transition-colors hover:text-cream"
              aria-label="Add to wishlist"
            >
              ♡
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
