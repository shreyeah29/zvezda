"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  getDomeGalleryImages,
  getProductByImageSrc,
} from "@/components/DomeGallery/domeGalleryImages";
import { GalleryProductModal } from "@/components/home/GalleryProductModal";
import type { Product } from "@/data/products";

const DomeGallery = dynamic(() => import("@/components/DomeGallery/DomeGallery"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <p className="editorial-spacing text-[9px] text-cream/35">Loading gallery…</p>
    </div>
  ),
});

const GALLERY_SCROLL_VH = 240;

export function HomeDomeGallery() {
  const images = useMemo(() => getDomeGalleryImages(), []);
  const [selected, setSelected] = useState<{ product: Product; imageSrc: string } | null>(null);

  const handleImageClick = useCallback(({ src }: { src: string; alt: string }) => {
    const product = getProductByImageSrc(src);
    if (!product) return;
    setSelected({ product, imageSrc: src });
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <section
        className="relative bg-black"
        style={{ height: `${GALLERY_SCROLL_VH}vh` }}
        aria-label="Collection dome gallery"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
          <header className="shrink-0 px-6 pt-14 pb-8 text-center md:px-12 md:pt-16 md:pb-10">
            <p className="editorial-spacing text-[10px] text-cream/45">Collection</p>
            <h2 className="font-display mt-6 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] font-light text-cream">
              Explore the Collection
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/55 md:text-[15px]">
              Discover handcrafted couture pieces designed for timeless elegance.
            </p>
          </header>

          <div className="relative min-h-0 flex-1">
            <DomeGallery
              images={images}
              fit={0.8}
              minRadius={300}
              maxVerticalRotationDeg={20}
              segments={26}
              dragDampening={2.6}
              grayscale={false}
              allowPageScroll
              onImageClick={handleImageClick}
              overlayBlurColor="#120F17"
              openedImageWidth="400px"
              openedImageHeight="400px"
              imageBorderRadius="30px"
              openedImageBorderRadius="30px"
            />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <GalleryProductModal
            product={selected.product}
            imageSrc={selected.imageSrc}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}
