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
        gap={10}
        padding={0}
        aspectRatio="square"
        objectFit="cover"
        objectPosition="center top"
        backgroundColor="#ffffff"
        emptySlotColor="#ffffff"
        borderRadius={0}
        borderColor="#0a0a0a"
        borderWidth={1}
        swapInterval={2200}
        animationDuration={0.8}
        easing="easeInOut"
        shuffleStyle="neighbors"
        hoverEffect
        hoverScale={1.02}
        enableImageCycle={images.length > 9}
        maxSwapsPerInterval={1}
        randomizationIntensity={100}
      />
    </section>
  );
}
