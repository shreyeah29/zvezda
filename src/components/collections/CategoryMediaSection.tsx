"use client";

import type { CollectionCategory } from "@/data/collectionCategories";
import { SimplePhotoGrid } from "@/components/collections/SimplePhotoGrid";
import { InertiaGrid } from "@/components/collections/InertiaGrid";
import { DragableCarousel } from "@/components/collections/DragableCarousel";
import { BlackPinkSection } from "@/components/collections/DepthBlurCarousel";
import { ToneEditorialSection } from "@/components/collections/ToneEditorialSection";

type CategoryMediaSectionProps = {
  category: CollectionCategory;
};

export function CategoryMediaSection({ category }: CategoryMediaSectionProps) {
  switch (category.layout) {
    case "green-simple":
      return (
        <SimplePhotoGrid
          images={category.galleryImages}
          backgroundColor={category.backgroundColor}
        />
      );

    case "inertia":
      return (
        <InertiaGrid
          items={category.galleryImages}
          backgroundColor={category.backgroundColor}
          columns={3}
          itemSize={190}
          gap={16}
          preset="repel"
          amount={50}
        />
      );

    case "drag-carousel":
      return (
        <DragableCarousel
          images={category.galleryImages.map((img) => img.src)}
          backgroundColor={category.backgroundColor}
          slideWidth={320}
          slideHeight={400}
          gap={20}
          borderRadius={12}
        />
      );

    case "depth-blur":
      return (
        <BlackPinkSection
          title={category.displayTitle}
          subtitle={category.subtitle}
          story={category.story}
          storyLines={category.storyLines}
          images={category.galleryImages.map((img) => img.src)}
          accentColor={category.accentColor}
          textColor={category.textColor}
          mutedColor={category.mutedColor}
          backgroundColor={category.backgroundColor}
        />
      );

    case "editorial-tones":
      return (
        <ToneEditorialSection
          backgroundColor={category.backgroundColor}
          textColor={category.textColor}
        />
      );

    default:
      return null;
  }
}
