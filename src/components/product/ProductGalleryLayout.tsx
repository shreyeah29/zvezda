"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import "./ProductGalleryLayout.css";

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
    <div className="jm-product-gallery mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[72px_1fr_340px] lg:gap-10 xl:grid-cols-[80px_1fr_380px]">
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                key={`${img}-${i}`}
                type="button"
                onClick={() => selectImage(i)}
                animate={{ scale: isActive ? 1.04 : 1 }}
                whileHover={{ scale: isActive ? 1.04 : 1.02 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`jm-product-gallery__thumb gpu relative shrink-0 overflow-hidden rounded-lg lg:w-full ${
                  isActive ? "jm-product-gallery__thumb--active" : ""
                }`}
                style={{ width: 56, aspectRatio: "3/4" }}
                aria-label={`View image ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover object-top" />
              </motion.button>
            );
          })}
        </div>

        <div className="order-1 overflow-hidden lg:order-2">
          <div className="jm-product-gallery__stage relative overflow-hidden rounded-[28px] md:rounded-[32px]">
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

            <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1">
              <p className="text-[10px] text-white/90">
                {activeIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>

        <div className="order-3 lg:sticky lg:top-24 lg:self-start">
          <p className="jm-product-gallery__label">{collectionTitle ?? product.collectionLabel}</p>
          <h1 className="jm-product-gallery__title mt-3">{product.name}</h1>
          <p className="jm-product-gallery__price mt-4">
            {formatPrice(product.price, product.currency)}
          </p>

          <div className="mt-8">
            <p className="jm-product-gallery__label mb-3">Color</p>
            <div className="flex gap-2">
              {colors.map((color, i) => (
                <button
                  key={color}
                  type="button"
                  className="h-7 w-7 rounded-full border border-black/25 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: i === 0 ? "2px solid rgba(0,0,0,0.45)" : "none",
                    outlineOffset: 2,
                  }}
                  aria-label={`Color ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="jm-product-gallery__label">Size</p>
              <button type="button" className="jm-product-gallery__link underline-offset-2 hover:underline">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`jm-product-gallery__size ${
                    selectedSize === size ? "jm-product-gallery__size--active" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button type="button" className="jm-product-gallery__outline-btn mt-2 w-full">
              Custom Size
            </button>
          </div>

          <div className="mt-8">
            <p className="jm-product-gallery__label mb-3">Quantity</p>
            <div className="jm-product-gallery__qty inline-flex items-center">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="jm-product-gallery__qty-btn"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center text-[12px] font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="jm-product-gallery__qty-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-black/60">Made to order · 6–8 weeks</p>

          <div className="mt-6 flex flex-col gap-3">
            <AddToCartButton
              slug={product.slug}
              quantity={quantity}
              size={selectedSize}
              className="flex-1"
              label="Add to Bag"
            />
            <Link href="/cart" className="jm-product-gallery__checkout flex-1">
              Checkout
            </Link>
          </div>
          <div className="jm-product-gallery__wishlist-row mt-3 flex items-center justify-center gap-2">
            <WishlistButton slug={product.slug} size="sm" />
            <span className="text-[11px] text-black/70">Add to Wishlist</span>
          </div>

          <div className="jm-product-gallery__accordion mt-10 pt-6">
            <button
              type="button"
              onClick={() => setDescOpen((o) => !o)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[11px] font-medium text-black/75">Product Description</span>
              <span className="text-black/55">{descOpen ? "−" : "+"}</span>
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
                  <p className="jm-product-gallery__body mt-4">{product.story}</p>
                  <p className="jm-product-gallery__body mt-4 text-[13px]">{product.fabric}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
