import type { Product } from "@/data/products";

export type ScrollerItem = {
  id: string;
  slug: string;
  video: string;
  thumbnail: string;
  name: string;
  collection: string;
  collectionLabel: string;
  description: string;
  story: string;
  price: number;
  currency: string;
  number: string;
};

export type ScrollerVisualState = {
  scale: number;
  opacity: number;
  blur: number;
  brightness: number;
  translateY: number;
  zIndex: number;
  isActive: boolean;
};

export function productToScrollerItem(product: Product, index: number): ScrollerItem | null {
  if (!product.video) return null;

  return {
    id: product.slug,
    slug: product.slug,
    video: product.video,
    thumbnail: product.hero,
    name: product.name,
    collection: product.collection,
    collectionLabel: product.collectionLabel,
    description: product.description,
    story: product.story,
    price: product.price,
    currency: product.currency,
    number: String(index + 1).padStart(2, "0"),
  };
}
