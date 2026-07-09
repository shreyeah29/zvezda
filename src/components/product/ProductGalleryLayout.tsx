"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const EASE = [0.16, 1, 0.3, 1] as const;

const COLLECTION_COLORS: Record<string, string[]> = {
  garden: ["#4a5240", "#6b7560", "#3d4436"],
  peach: ["#d4a088", "#e8c4b0", "#c48870"],
  noir: ["#1a1a1a", "#4a4a4a", "#f5f0e8"],
  yellow: ["#c9a227", "#e8c547", "#a68520"],
  red: ["#8b1a2b", "#c42d42", "#5c1019"],
  orange: ["#c47a3a", "#e89a55", "#9a5520"],
};

type ProductGalleryLayoutProps = {
  product: Product;
  images: string[];
  collectionTitle?: string;
};

/** Directional slide — moves with thumbnail selection order */
const imageVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 56,
    scale: 1.04,
    filter: "blur(10px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -56,
    scale: 0.97,
    filter: "blur(6px)",
  }),
};

export function ProductGalleryLayout({
  product,
  images,
  collectionTitle,
}: ProductGalleryLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const prevIndex = useRef(0);

  const colors = COLLECTION_COLORS[product.collection] ?? ["#c4a574"];
  const activeImage = images[activeIndex] ?? product.hero;

  const selectImage = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > prevIndex.current ? 1 : -1);
    prevIndex.current = index;
    setActiveIndex(index);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[72px_1fr_340px] lg:gap-10 xl:grid-cols-[80px_1fr_380px]">
        {/* Left — vertical thumbnails with active indicator */}
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                key={`${img}-${i}`}
                type="button"
                onClick={() => selectImage(i)}
                animate={{
                  opacity: isActive ? 1 : 0.45,
                  scale: isActive ? 1.04 : 1,
                }}
                whileHover={{ opacity: isActive ? 1 : 0.75, scale: isActive ? 1.04 : 1.02 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`gpu relative shrink-0 overflow-hidden rounded-lg border lg:w-full ${
                  isActive ? "border-cream/45" : "border-cream/10"
                }`}
                style={{ width: 56, aspectRatio: "3/4" }}
                aria-label={`View image ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="thumb-active-ring"
                    className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-cream/30 ring-inset"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover object-top" />
              </motion.button>
            );
          })}
        </div>

        {/* Center — main image with directional editorial transition */}
        <div className="order-1 overflow-hidden lg:order-2">
          <div className="relative overflow-hidden rounded-[28px] border border-cream/12 bg-zinc-950 md:rounded-[32px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeImage}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EASE }}
                className="relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={product.name}
                  className="aspect-[3/4] w-full object-cover object-top md:aspect-[4/5]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Image counter */}
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">
              <p className="editorial-spacing text-[8px] text-cream/70">
                {activeIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>

        {/* Right — product details */}
        <div className="order-3 lg:sticky lg:top-24 lg:self-start">
          <p className="editorial-spacing text-[9px] text-cream/40">
            {collectionTitle ?? product.collectionLabel}
          </p>
          <h1 className="font-display mt-3 text-3xl font-light text-cream md:text-4xl">
            {product.name}
          </h1>
          <p className="font-display mt-4 text-2xl text-cream/85">
            {formatPrice(product.price, product.currency)}
          </p>

          <div className="mt-8">
            <p className="editorial-spacing mb-3 text-[9px] text-cream/40">Color</p>
            <div className="flex gap-2">
              {colors.map((color, i) => (
                <button
                  key={color}
                  type="button"
                  className="h-6 w-6 rounded-full border border-cream/20 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: i === 0 ? "1px solid rgba(245,240,232,0.5)" : "none",
                    outlineOffset: 2,
                  }}
                  aria-label={`Color ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="editorial-spacing text-[9px] text-cream/40">Size</p>
              <button
                type="button"
                className="editorial-spacing text-[9px] text-cream/40 underline-offset-2 hover:text-cream hover:underline"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`editorial-spacing border py-2.5 text-[9px] transition-colors ${
                    selectedSize === size
                      ? "border-cream bg-cream text-ink"
                      : "border-cream/15 text-cream/55 hover:border-cream/35"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="editorial-spacing mt-2 w-full border border-cream/15 py-2.5 text-[9px] text-cream/55 transition-colors hover:border-cream/30 hover:text-cream"
            >
              Custom Size
            </button>
          </div>

          <div className="mt-8">
            <p className="editorial-spacing mb-3 text-[9px] text-cream/40">Quantity</p>
            <div className="inline-flex items-center border border-cream/15">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-cream/50 hover:text-cream"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="editorial-spacing min-w-[2.5rem] text-center text-[10px] text-cream">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2.5 text-cream/50 hover:text-cream"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <p className="mt-4 text-[10px] text-cream/35">Made to order · 6–8 weeks</p>

          <div className="mt-6 flex flex-col gap-3">
            <AddToCartButton
              slug={product.slug}
              quantity={quantity}
              size={selectedSize}
              className="flex-1"
              label="Add to Bag"
            />
            <Link
              href="/cart"
              className="editorial-spacing flex-1 border border-cream/30 py-4 text-center text-[9px] text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 border border-cream/10 py-3">
            <WishlistButton slug={product.slug} size="sm" />
            <span className="editorial-spacing text-[9px] text-cream/45">Add to Wishlist</span>
          </div>

          <div className="mt-10 border-t border-cream/10 pt-6">
            <button
              type="button"
              onClick={() => setDescOpen((o) => !o)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="editorial-spacing text-[9px] text-cream/50">Product Description</span>
              <span className="text-cream/40">{descOpen ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {descOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-sm leading-relaxed text-cream/55">{product.story}</p>
                  <p className="mt-4 text-xs leading-relaxed text-cream/40">{product.fabric}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
