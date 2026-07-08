"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { getDomeGalleryImages } from "@/components/DomeGallery/domeGalleryImages";

const DomeGallery = dynamic(() => import("@/components/DomeGallery/DomeGallery"), {
  ssr: false,
  loading: () => (
    <div className="viewport-fill flex h-screen w-full items-center justify-center bg-black">
      <p className="editorial-spacing text-[9px] text-cream/35">Loading gallery…</p>
    </div>
  ),
});

export function HomeDomeGallery() {
  const images = useMemo(() => getDomeGalleryImages(), []);

  return (
    <section
      className="viewport-fill relative h-screen w-full overflow-hidden bg-black"
      aria-label="Collection dome gallery"
    >
      <DomeGallery
        images={images}
        fit={0.8}
        minRadius={300}
        maxVerticalRotationDeg={20}
        segments={26}
        dragDampening={2.6}
        grayscale={false}
        overlayBlurColor="#120F17"
        openedImageWidth="400px"
        openedImageHeight="400px"
        imageBorderRadius="30px"
        openedImageBorderRadius="30px"
      />
    </section>
  );
}
