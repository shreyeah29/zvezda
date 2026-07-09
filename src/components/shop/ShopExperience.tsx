"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { StageArrows } from "@/components/shop/StageArrows";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import type { CircularGalleryHandle, CircularGalleryItem } from "@/components/shop/CircularGallery";

const CircularGallery = dynamic(() => import("@/components/shop/CircularGallery"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="editorial-spacing text-[9px] text-cream/40">Loading collection…</p>
    </div>
  ),
});

function ShopExperienceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const galleryApi = useRef<CircularGalleryHandle | null>(null);
  const focusedSlug = searchParams.get("set");

  const focusIndex = useMemo(() => {
    if (!focusedSlug) return 0;
    const index = products.findIndex((product) => product.slug === focusedSlug);
    return index >= 0 ? index : 0;
  }, [focusedSlug]);

  const handleGalleryReady = useCallback(
    (api: CircularGalleryHandle) => {
      galleryApi.current = api;
      if (focusedSlug) {
        requestAnimationFrame(() => api.goToIndex(focusIndex));
      }
    },
    [focusIndex, focusedSlug],
  );

  const galleryItems: CircularGalleryItem[] = useMemo(
    () =>
      products.map((product) => ({
        image: product.hero,
        text: product.name,
      })),
    [],
  );

  const handleItemClick = useCallback(
    (index: number) => {
      const product = products[index];
      if (product) router.push(`/products/${product.slug}`);
    },
    [router],
  );

  return (
    <>
      <div className="hero-screen relative w-full overflow-hidden bg-ink">
        <div className="pointer-events-none absolute top-24 left-6 z-20 md:top-28 md:left-10">
          <p className="editorial-spacing text-[9px] tracking-[0.45em] text-cream/40">Collection</p>
          <p className="mt-3 font-[family-name:var(--font-shop-display)] text-2xl font-medium tracking-wide text-cream md:text-3xl">
            Atelier
          </p>
          <p className="mt-3 max-w-[220px] text-[11px] leading-relaxed tracking-wide text-cream/45 md:max-w-xs">
            Drag, scroll, tap the arrows, or use arrow keys to explore all {products.length} pieces.
          </p>
        </div>

        <div className="absolute inset-0 pt-16 pb-10">
          <CircularGallery
            onReady={handleGalleryReady}
            items={galleryItems}
            bend={3}
            textColor="#f5f0e8"
            borderRadius={0.05}
            scrollEase={0.012}
            scrollSpeed={0.9}
            fontUrl="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&display=swap"
            font="500 26px Bodoni Moda"
            onItemClick={handleItemClick}
          />
          <StageArrows
            onPrev={() => galleryApi.current?.goPrev()}
            onNext={() => galleryApi.current?.goNext()}
            canPrev
            canNext
          />
        </div>

        <p className="editorial-spacing pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[9px] tracking-[0.4em] text-cream/35">
          Click a piece to view · Drag or use arrows to browse
        </p>
      </div>

      <section className="relative bg-ink px-5 py-14 md:px-8 md:py-20" aria-label="Shop catalog">
        <div className="mx-auto max-w-[1320px]">
          <header className="mb-10 max-w-xl md:mb-12">
            <p className="editorial-spacing text-[10px] text-gold/90">Complete Edit</p>
            <h2 className="font-[family-name:var(--font-shop-display)] mt-4 text-4xl font-medium text-cream md:text-5xl">
              All Pieces
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/50">
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
          <div className="hero-screen flex items-center justify-center bg-ink">
            <p className="editorial-spacing text-[9px] text-cream/40">Loading collection…</p>
          </div>
        }
      >
        <ShopExperienceContent />
      </Suspense>
    </SmoothScroll>
  );
}
