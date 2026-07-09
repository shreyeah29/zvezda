"use client";

import type { CollectionCategory } from "@/data/collectionCategories";
import { toGalleryMediaItems } from "@/data/collectionCategories";
import { AsymmetricGrid } from "@/components/collections/AsymmetricGrid";

type CategoryAsymmetricGalleryProps = {
  category: CollectionCategory;
};

export function CategoryAsymmetricGallery({ category }: CategoryAsymmetricGalleryProps) {
  return (
    <AsymmetricGrid
      images={toGalleryMediaItems(category.galleryImages)}
      backgroundColor={category.backgroundColor}
      columns={4}
      gap={20}
      borderRadius={4}
      chaos={80}
      parallaxStrength={8}
      showFilters={false}
    />
  );
}
