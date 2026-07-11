"use client";

import { Suspense } from "react";
import { products } from "@/data/products";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./ShopExperience.css";

function ShopExperienceContent() {
  return (
    <>
      <section className="shop-experience__catalog relative px-5 py-24 md:px-10 md:py-28" aria-label="Shop catalog">
        <div className="relative z-10 mx-auto max-w-[1320px]">
          <header className="mb-10 max-w-xl md:mb-12">
            <h1 className="shop-heading text-5xl text-cream md:text-6xl">All Pieces</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70">
              Browse every couture piece — tap to view details, save to your wishlist, or add to cart.
            </p>
          </header>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
            {products.map((product, index) => (
              <ShopProductCard key={product.slug} product={product} index={index} compact />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export function ShopExperience() {
  return (
    <SmoothScroll>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-ink">
            <p className="editorial-spacing text-[9px] text-cream/60">Loading collection…</p>
          </div>
        }
      >
        <ShopExperienceContent />
      </Suspense>
    </SmoothScroll>
  );
}
