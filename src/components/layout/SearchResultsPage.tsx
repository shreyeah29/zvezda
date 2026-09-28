"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/data/searchProducts";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "@/components/shop/ShopExperience.css";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <>
      <main id="main-content" className="shop-experience">
        <section className="shop-experience__catalog section-padding relative" aria-label="Search results">
          <div className="relative z-10 mx-auto max-w-[1320px]">
            <header className="mb-10">
              <h1 className="shop-experience__eyebrow">Search</h1>
            </header>

            {!query ? null : results.length === 0 ? (
              <p className="shop-experience__empty">No pieces match “{query}”.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
                {results.map((product, index) => (
                  <ShopProductCard key={product.slug} product={product} index={index} compact />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <JacquemusFooter />
    </>
  );
}

export function SearchResultsPage() {
  return (
    <SmoothScroll>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-white">
            <p className="text-[11px] text-black/55">Loading search…</p>
          </div>
        }
      >
        <SearchResultsContent />
      </Suspense>
    </SmoothScroll>
  );
}
