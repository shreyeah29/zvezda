"use client";

import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct, formatPrice } from "@/data/products";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";

export function WishlistPage() {
  const { wishlist, toggleWishlist } = useCommerce();
  const products = wishlist.map(getProduct).filter(Boolean);

  return (
    <SmoothScroll>
      <main id="main-content" className="min-h-screen bg-ink pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <header className="mb-16 md:mb-20">
            <p className="editorial-spacing text-[10px] text-gold/90">Curated</p>
            <h1 className="font-display mt-4 text-5xl font-light text-cream md:text-7xl">
              Saved Pieces
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/50">
              Your private edit — garments held in reserve until the moment is right.
            </p>
          </header>

          {products.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <p className="font-display text-3xl font-light text-cream/30 md:text-5xl">
                Your curated wardrobe is waiting.
              </p>
              <Link
                href="/shop"
                className="editorial-spacing mt-10 border border-cream/20 px-8 py-4 text-[9px] text-cream/70 transition-colors hover:border-gold hover:text-cream"
              >
                Explore the Atelier
              </Link>
            </div>
          ) : (
            <LayoutGroup>
              <motion.div layout className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => {
                    if (!product) return null;
                    return (
                      <motion.article
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.88, filter: "blur(4px)" }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}
                        className="group overflow-hidden rounded-2xl border border-cream/10 bg-zinc-950/50"
                      >
                        <Link href={`/products/${product.slug}`} className="block">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.hero}
                              alt={product.name}
                              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3">
                              <WishlistButton slug={product.slug} size="sm" />
                            </div>
                          </div>
                          <div className="p-5">
                            <p className="font-display text-xl text-cream">{product.name}</p>
                            <p className="editorial-spacing mt-2 text-[9px] text-gold">
                              {formatPrice(product.price, product.currency)}
                            </p>
                          </div>
                        </Link>
                        <div className="flex gap-2 px-5 pb-5 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                          <AddToCartButton slug={product.slug} className="flex-1" />
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.slug)}
                            className="editorial-spacing border border-cream/15 px-4 py-4 text-[9px] text-cream/50 hover:text-cream"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
