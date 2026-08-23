"use client";

import { Suspense, useMemo, useState } from "react";
import { matchesShopPriceBand, shopProducts } from "@/data/shopCatalog";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./ShopExperience.css";

function toggleValue(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function ShopExperienceContent() {
  const [colours, setColours] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const next = shopProducts.filter((product) => {
      const colourMatch =
        colours.length === 0 || colours.some((colour) => product.colours?.includes(colour));
      const typeMatch = types.length === 0 || (product.garmentType != null && types.includes(product.garmentType));
      const priceMatch =
        prices.length === 0 ||
        prices.some((band) => matchesShopPriceBand(product.price, product.priceOnRequest, band));
      const sizeMatch =
        sizes.length === 0 || sizes.some((size) => (product.sizeOptions ?? []).includes(size));
      const availabilityMatch =
        availability.length === 0 ||
        (availability.includes("priced") && !product.priceOnRequest) ||
        (availability.includes("request") && Boolean(product.priceOnRequest));
      return colourMatch && typeMatch && priceMatch && sizeMatch && availabilityMatch;
    });

    if (sort === "price-asc") {
      return [...next].sort((a, b) => {
        if (a.priceOnRequest !== b.priceOnRequest) return a.priceOnRequest ? 1 : -1;
        return a.price - b.price;
      });
    }
    if (sort === "price-desc") {
      return [...next].sort((a, b) => {
        if (a.priceOnRequest !== b.priceOnRequest) return a.priceOnRequest ? 1 : -1;
        return b.price - a.price;
      });
    }
    if (sort === "name") {
      return [...next].sort((a, b) => a.name.localeCompare(b.name));
    }
    return next;
  }, [availability, colours, prices, sizes, sort, types]);

  return (
    <>
      <main id="main-content" className="shop-experience">
        <section className="shop-experience__catalog section-padding relative" aria-label="Shop catalog">
          <div className="relative z-10 mx-auto max-w-[1320px]">
            <header>
              <p className="shop-experience__eyebrow">The Atelier</p>
              <h1 className="shop-experience__title">All Pieces</h1>
              <p className="shop-experience__subtitle">
                Browse every couture piece — tap to view details, save to your wishlist, or add to cart.
              </p>
            </header>

            <ShopFilters
              colours={colours}
              types={types}
              prices={prices}
              sizes={sizes}
              availability={availability}
              sort={sort}
              resultCount={filtered.length}
              onToggleColour={(id) => setColours((current) => toggleValue(current, id))}
              onToggleType={(id) => setTypes((current) => toggleValue(current, id))}
              onTogglePrice={(id) => setPrices((current) => toggleValue(current, id))}
              onToggleSize={(id) => setSizes((current) => toggleValue(current, id))}
              onToggleAvailability={(id) => setAvailability((current) => toggleValue(current, id))}
              onSort={setSort}
              onClear={() => {
                setColours([]);
                setTypes([]);
                setPrices([]);
                setSizes([]);
                setAvailability([]);
                setSort("featured");
              }}
            />

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
                {filtered.map((product, index) => (
                  <ShopProductCard key={product.slug} product={product} index={index} compact />
                ))}
              </div>
            ) : (
              <p className="shop-experience__empty">No pieces match these filters.</p>
            )}
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
