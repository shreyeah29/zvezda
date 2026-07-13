"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import type { SlideshowProduct } from "./types";
import "./ProductSlideshow.css";

const SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 1,
};

/** Horizontal slot rhythm — equal spacing between every dress */
const SLOT_VW = 11;

type ProductSlideshowProps = {
  products?: SlideshowProduct[];
};

function InfoPanel({
  product,
  activeSize,
  activeColor,
  onSizeChange,
  onColorChange,
}: {
  product: SlideshowProduct;
  activeSize: string;
  activeColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}) {
  return (
    <aside className="ps-panel">
      <div className="ps-panel__block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={`title-${product.slug}`}
            className="ps-panel__title"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={SPRING}
          >
            {product.title}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`desc-${product.slug}`}
            className="ps-panel__description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {product.description}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`price-${product.slug}`}
            className="ps-panel__price"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={SPRING}
          >
            {product.price}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`variants-${product.slug}`}
          className="ps-panel__block ps-panel__block--variants"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <div className="ps-panel__row" aria-label="Sizes">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`ps-pill${size === activeSize ? " ps-pill--active" : ""}`}
                onClick={() => onSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="ps-panel__row" aria-label="Colors">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                className={`ps-pill${
                  color.name === activeColor ? " ps-pill--active" : ""
                }`}
                onClick={() => onColorChange(color.name)}
              >
                {color.name}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Link href={product.href} className="ps-panel__cta">
        View Product
      </Link>
    </aside>
  );
}

export function ProductSlideshow({ products }: ProductSlideshowProps) {
  const items = useMemo(
    () => (products && products.length > 0 ? products : getHomeProductSlideshowItems()),
    [products],
  );

  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const [sizes, setSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((item) => [item.slug, item.sizes[1] ?? item.sizes[0]])),
  );
  const [colors, setColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((item) => [item.slug, item.colors[0]?.name ?? ""])),
  );

  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const activeSize = sizes[active.slug] ?? active.sizes[0];
  const activeColor = colors[active.slug] ?? active.colors[0]?.name ?? "";

  const centerOffset = (items.length - 1) / 2;

  return (
    <div className="ps-root">
      <div className="ps-backdrop" aria-hidden="true">
        PRODUCTS
      </div>

      <InfoPanel
        product={active}
        activeSize={activeSize}
        activeColor={activeColor}
        onSizeChange={(size) => setSizes((prev) => ({ ...prev, [active.slug]: size }))}
        onColorChange={(color) =>
          setColors((prev) => ({ ...prev, [active.slug]: color }))
        }
      />

      <div className="ps-stage">
        <motion.div
          className="ps-track"
          animate={{ x: `${(centerOffset - activeIndex) * SLOT_VW}vw` }}
          transition={SPRING}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.slug}
                type="button"
                className="ps-slot"
                aria-label={`View ${item.title}`}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={item.image}
                  alt={item.alt}
                  className="ps-image"
                  draggable={false}
                  animate={{
                    height: isActive ? "42vh" : "17vh",
                    opacity: isActive ? 1 : 0.25,
                  }}
                  transition={SPRING}
                />
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default ProductSlideshow;
