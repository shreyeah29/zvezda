"use client";

import { products } from "@/data/products";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export function ShopListing() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-ink pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <header className="mb-16 max-w-2xl md:mb-20">
            <p className="editorial-spacing text-[10px] text-gold/90">Atelier</p>
            <h1 className="font-display mt-4 text-5xl font-light text-cream md:text-7xl">
              Shop
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/50">
              Thirteen couture pieces — each made to order, each a study in light and form.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ShopProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
