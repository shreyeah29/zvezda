import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { DomeGalleryImage } from "@/components/DomeGallery/DomeGallery";

export function getDomeGalleryImages(): DomeGalleryImage[] {
  const seen = new Set<string>();
  const images: DomeGalleryImage[] = [];

  const addImage = (src: string, alt: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    images.push({ src, alt });
  };

  for (const product of products) {
    addImage(product.hero, product.name);
    for (const src of product.gallery) {
      addImage(src, product.name);
    }
  }

  for (const collection of collections) {
    addImage(collection.hero, collection.title);
    addImage(collection.cover, collection.title);
  }

  return images;
}
