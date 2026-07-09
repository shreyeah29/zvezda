"use client";

import type { CollectionCategory } from "@/data/collectionCategories";
import { ImageShuffleGrid } from "@/components/collections/ImageShuffleGrid";
import "./CategoryShuffleGallery.css";

type CategoryShuffleGalleryProps = {
  category: CollectionCategory;
};

export function CategoryShuffleGallery({ category }: CategoryShuffleGalleryProps) {
  const images = category.galleryImages.map((image) => ({
    src: image.src,
    alt: image.alt,
    href: image.href,
  }));

  return (
    <section className="category-shuffle-gallery" aria-label={`${category.displayTitle} gallery`}>
      <ImageShuffleGrid
        images={images}
        rows={3}
        columns={3}
        gap={6}
        padding={12}
        aspectRatio="portrait"
        backgroundColor={category.backgroundColor}
        borderRadius={3}
        borderColor="rgba(255,255,255,0.78)"
        borderWidth={2}
        swapInterval={2200}
        animationDuration={0.8}
        easing="easeInOut"
        shuffleStyle="neighbors"
        hoverEffect
        hoverScale={1.025}
        enableImageCycle={images.length > 9}
        maxSwapsPerInterval={1}
        randomizationIntensity={100}
        fitViewport
        maxHeight="min(88vh, 720px)"
      />
    </section>
  );
}
