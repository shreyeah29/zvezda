"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice, type Product } from "@/data/products";

type JacquemusQuickViewProps = {
  product: Product;
  imageSrc: string;
  onClose: () => void;
};

export function JacquemusQuickView({ product, imageSrc, onClose }: JacquemusQuickViewProps) {
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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
    >
      <motion.div
        className="relative grid w-full max-w-4xl overflow-hidden bg-white md:grid-cols-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center text-xl text-black/60 hover:text-black"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex min-h-[280px] items-center justify-center bg-[#f0f0f0] p-6 md:min-h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={product.name} className="max-h-[min(55vh,520px)] w-full object-contain" />
        </div>

        <div className="flex flex-col justify-center px-8 py-10 md:px-10">
          <p className="text-[10px] uppercase tracking-wide text-black/50">{product.collectionLabel}</p>
          <h2
            className="mt-3 text-2xl font-normal text-black md:text-3xl"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {product.name}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-black/60">{product.story}</p>
          <p className="mt-6 text-sm text-black">{formatPrice(product.price, product.currency)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-8 inline-flex items-center justify-center border border-black bg-black px-6 py-3 text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            View product
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
