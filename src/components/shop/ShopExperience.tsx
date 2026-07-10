"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { StageArrows } from "@/components/shop/StageArrows";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LightRays } from "@/components/ui/LightRays";
import { ScrollBendSection } from "@/components/shop/ScrollBendSection";
import type { OrganicCarouselHandle, OrganicCarouselItem } from "@/components/shop/OrganicCarousel";
import "./ShopExperience.css";

const OrganicCarousel = dynamic(() => import("@/components/shop/OrganicCarousel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="editorial-spacing text-[9px] text-cream/40">Loading collection…</p>
    </div>
  ),
});

const SHOP_LIGHT_RAYS = {
  raysOrigin: "top-center" as const,
  raysColor: "#ffffff",
  raysSpeed: 0.9,
  lightSpread: 2,
  rayLength: 3,
  followMouse: true,
  mouseInfluence: 0.1,
  noiseAmount: 0,
  distortion: 0,
  fadeDistance: 2,
  saturation: 1,
};

function ShopExperienceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const galleryApi = useRef<OrganicCarouselHandle | null>(null);
  const focusedSlug = searchParams.get("set");

  const focusIndex = useMemo(() => {
    if (!focusedSlug) return 0;
    const index = products.findIndex((product) => product.slug === focusedSlug);
    return index >= 0 ? index : 0;
  }, [focusedSlug]);

  const handleGalleryReady = useCallback(
    (api: OrganicCarouselHandle) => {
      galleryApi.current = api;
      if (focusedSlug) {
        requestAnimationFrame(() => api.goToIndex(focusIndex));
      }
    },
    [focusIndex, focusedSlug],
  );

  const galleryItems: OrganicCarouselItem[] = useMemo(
    () =>
      products.map((product) => ({
        image: product.hero,
        title: product.name,
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
      <ScrollBendSection
        backgroundColor="#0a0908"
        topRadius={36}
        hero={
          <div className="relative h-full w-full overflow-hidden bg-ink">
            <div className="shop-experience__rays" aria-hidden="true">
              <LightRays {...SHOP_LIGHT_RAYS} className="shop-experience__rays-canvas" />
            </div>

            <div className="pointer-events-none absolute top-24 left-1/2 z-20 -translate-x-1/2 text-center md:top-28">
              <p className="shop-heading text-5xl text-cream md:text-6xl">Atelier</p>
            </div>

            <div className="absolute inset-0 z-[1] pt-16 pb-10">
              <OrganicCarousel
                onReady={handleGalleryReady}
                items={galleryItems}
                textColor="#f5f0e8"
                borderRadius={46}
                cardWidth={252}
                cardHeight={430}
                cardGap={52}
                activeScale={1.05}
                inactiveOpacity={0.55}
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
        }
      >
        <section className="shop-experience__catalog relative px-5 py-14 md:px-10 md:py-20" aria-label="Shop catalog">
          <div className="relative z-10 mx-auto max-w-[1320px]">
            <header className="mb-10 max-w-xl md:mb-12">
              <h2 className="shop-heading text-5xl text-cream md:text-6xl">All Pieces</h2>
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
      </ScrollBendSection>

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
