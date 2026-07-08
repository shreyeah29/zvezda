"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, type Product } from "@/data/products";

type GalleryProductModalProps = {
  product: Product;
  imageSrc: string;
  onClose: () => void;
};

export function GalleryProductModal({ product, imageSrc, onClose }: GalleryProductModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <motion.div
        className="relative grid max-h-[min(90vh,820px)] w-full max-w-6xl overflow-hidden border border-cream/10 bg-ink md:grid-cols-2"
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-cream/15 text-cream/70 transition-colors hover:border-cream/35 hover:text-cream"
          aria-label="Close modal"
        >
          <span className="text-lg leading-none">×</span>
        </button>

        <div className="relative overflow-hidden bg-black">
          <motion.div
            className="flex h-full min-h-[280px] items-center justify-center p-6 md:min-h-[420px]"
            whileHover="hover"
            initial="rest"
          >
            <motion.img
              src={imageSrc}
              alt={product.name}
              className="max-h-[min(58vh,560px)] w-full object-contain"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.06 },
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-14">
          <p className="editorial-spacing text-[10px] text-cream/45">{product.collectionLabel}</p>

          <h2 className="font-display mt-5 text-4xl leading-tight font-light text-cream md:text-5xl">
            {product.name}
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/58 md:text-[15px]">
            {product.story}
          </p>

          <p className="font-display mt-8 text-3xl text-cream/90">
            {formatPrice(product.price, product.currency)}
          </p>

          <p className="editorial-spacing mt-4 text-[9px] text-cream/40">Available — Made to Order</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/products/${product.slug}`}
              className="editorial-spacing inline-flex items-center justify-center border border-cream/80 bg-cream px-8 py-4 text-[10px] text-ink transition-colors hover:bg-cream/90"
            >
              View Product
            </Link>
            <button
              type="button"
              className="editorial-spacing inline-flex items-center justify-center border border-cream/25 px-8 py-4 text-[10px] text-cream/75 transition-colors hover:border-cream/45 hover:text-cream"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
