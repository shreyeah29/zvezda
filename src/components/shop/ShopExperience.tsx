"use client";

import { Suspense } from "react";
import { products } from "@/data/products";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./ShopExperience.css";

function ShopExperienceContent() {
  return (
    <>
      <main id="main-content" className="shop-experience">
        <section className="shop-experience__catalog section-padding relative" aria-label="Shop catalog">
          <div className="relative z-10 mx-auto max-w-[1320px]">
            <header className="mb-10 max-w-xl md:mb-12">
              <h1 className="shop-experience__title">All Pieces</h1>
              <p className="shop-experience__subtitle">
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
      </main>

      <JacquemusFooter />
    </>
  );
}

export function ShopExperience() {
  return (
    <SmoothScroll>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-white">
            <p className="text-[11px] text-black/55">Loading collection…</p>
          </div>
        }
      >
        <ShopExperienceContent />
      </Suspense>
    </SmoothScroll>
  );
}
