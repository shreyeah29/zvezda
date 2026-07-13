"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import type { SlideshowProduct } from "./types";
import "./ProductSlideshow.css";

const SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

const PANEL_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
};

type ProductSlideshowProps = {
  products?: SlideshowProduct[];
};

function ProductPanel({
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
    <div className="product-slideshow__panel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={product.slug}
          className="product-slideshow__panel-inner"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <div className="product-slideshow__panel-copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={`title-${product.slug}`}
                className="product-slideshow__title"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={PANEL_SPRING}
              >
                {product.title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`desc-${product.slug}`}
                className="product-slideshow__description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                {product.description}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`price-${product.slug}`}
                className="product-slideshow__price"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={PANEL_SPRING}
              >
                {product.price}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="product-slideshow__variants">
            <div className="product-slideshow__variant-row" aria-label="Sizes">
              {product.sizes.map((size) => {
                const isActive = size === activeSize;
                return (
                  <button
                    key={size}
                    type="button"
                    className={`product-slideshow__pill${
                      isActive ? " product-slideshow__pill--active" : ""
                    }`}
                    onClick={() => onSizeChange(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <div className="product-slideshow__variant-row" aria-label="Colors">
              {product.colors.map((color) => {
                const isActive = color.name === activeColor;
                return (
                  <button
                    key={color.name}
                    type="button"
                    className={`product-slideshow__pill product-slideshow__pill--color${
                      isActive ? " product-slideshow__pill--active" : ""
                    }`}
                    onClick={() => onColorChange(color.name)}
                  >
                    {color.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Link href={product.href} className="product-slideshow__cta">
            VIEW PRODUCT
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
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
    Object.fromEntries(items.map((item) => [item.slug, item.colors[0]?.name ?? "Default"])),
  );

  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const activeSize = sizes[active.slug] ?? active.sizes[0];
  const activeColor = colors[active.slug] ?? active.colors[0]?.name ?? "Default";

  return (
    <div className="product-slideshow">
      <p className="product-slideshow__hint">CLICK ON THE IMAGES</p>

      <div className="product-slideshow__backdrop" aria-hidden="true">
        PRODUCTS
      </div>

      <ProductPanel
        product={active}
        activeSize={activeSize}
        activeColor={activeColor}
        onSizeChange={(size) => setSizes((prev) => ({ ...prev, [active.slug]: size }))}
        onColorChange={(color) => setColors((prev) => ({ ...prev, [active.slug]: color }))}
      />

      <LayoutGroup>
        <div className="product-slideshow__stage">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;
            const baseWidth = 200;
            const spacing = 164;

            return (
              <motion.button
                key={item.slug}
                type="button"
                layout
                layoutId={`slideshow-product-${item.slug}`}
                className="product-slideshow__figure"
                aria-label={`View ${item.title}`}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                animate={{
                  x: offset * spacing - baseWidth / 2,
                  scale: isActive ? 1 : 0.74,
                  opacity: isActive ? 1 : 0.55,
                }}
                transition={SPRING}
                style={{
                  zIndex: isActive ? 20 : 10 - Math.abs(offset),
                  originY: 1,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="product-slideshow__image"
                  draggable={false}
                />
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

export default ProductSlideshow;
