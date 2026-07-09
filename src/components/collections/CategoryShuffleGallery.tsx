"use client";

import type { CollectionCategory } from "@/data/collectionCategories";
import { ImageShuffleGrid } from "@/components/collections/ImageShuffleGrid";

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
    <ImageShuffleGrid
      images={images}
      rows={3}
      columns={3}
      gap={10}
      padding={20}
      aspectRatio="portrait"
      backgroundColor={category.backgroundColor}
      borderRadius={4}
      borderColor="rgba(255,255,255,0.82)"
      borderWidth={4}
      swapInterval={2400}
      animationDuration={0.85}
      easing="easeInOut"
      shuffleStyle="neighbors"
      hoverEffect
      hoverScale={1.03}
      enableImageCycle={images.length > 9}
      maxSwapsPerInterval={1}
      randomizationIntensity={100}
    />
  );
}
