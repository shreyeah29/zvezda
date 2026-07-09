"use client";

import type { CollectionCategory } from "@/data/collectionCategories";
import { GalleryGradientSection } from "@/components/collections/GalleryGradientSection";
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
        <GalleryGradientSection gradientId={category.id}>
          <SimplePhotoGrid images={category.galleryImages} />
        </GalleryGradientSection>
      );

    case "inertia":
      return (
        <GalleryGradientSection gradientId={category.id}>
          <InertiaGrid
            items={category.galleryImages}
            columns={3}
            itemSize={190}
            gap={16}
            preset="repel"
            amount={50}
          />
        </GalleryGradientSection>
      );

    case "drag-carousel":
      return (
        <GalleryGradientSection gradientId={category.id}>
          <DragableCarousel
            images={category.galleryImages.map((img) => img.src)}
            slideWidth={320}
            slideHeight={400}
            gap={20}
            borderRadius={12}
          />
        </GalleryGradientSection>
      );

    case "depth-blur":
      return (
        <GalleryGradientSection gradientId={category.id}>
          <BlackPinkSection
            title={category.displayTitle}
            subtitle={category.subtitle}
            story={category.story}
            storyLines={category.storyLines}
            images={category.galleryImages.map((img) => img.src)}
            accentColor={category.accentColor}
            textColor={category.textColor}
            mutedColor={category.mutedColor}
          />
        </GalleryGradientSection>
      );

    case "editorial-tones":
      return <ToneEditorialSection textColor={category.textColor} />;

    default:
      return null;
  }
}
