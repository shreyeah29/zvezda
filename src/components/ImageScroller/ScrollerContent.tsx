"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "@/data/products";
import type { ScrollerItem } from "@/components/ImageScroller/types";

type ScrollerContentProps = {
  item: ScrollerItem;
  activeIndex: number;
  total: number;
};

/** Sticky left panel — copy updates only when the active video changes */
export function ScrollerContent({ item, activeIndex, total }: ScrollerContentProps) {
  return (
    <div className="flex h-full flex-col justify-between px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16">
      <div>
        <p className="editorial-spacing text-[9px] text-cream/40">Collection</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-md"
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="editorial-spacing text-[10px] text-gold"
            >
              {item.collectionLabel}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="mt-4 font-display text-4xl font-light leading-[1.05] text-cream md:text-5xl lg:text-6xl"
            >
              {item.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="mt-5 text-sm leading-relaxed text-cream/55 md:text-[15px]"
            >
              {item.story}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="mt-6 font-display text-2xl text-cream md:text-3xl"
            >
              {formatPrice(item.price, item.currency)}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-end justify-between gap-6">
        <div>
          <p className="editorial-spacing text-[9px] text-cream/35">Piece</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${item.id}-number`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mt-2 font-display text-3xl text-cream/80"
            >
              {item.number}
              <span className="text-cream/25"> / {String(total).padStart(2, "0")}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        <Link
          href={`/products/${item.slug}`}
          className="editorial-spacing rounded-full border border-cream/20 px-5 py-3 text-[10px] text-cream/75 transition-colors hover:border-cream/45 hover:text-cream"
        >
          View Piece
        </Link>
      </div>
    </div>
  );
}
