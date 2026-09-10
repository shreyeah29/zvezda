import type { Product } from "@/data/products";
import { houseCollections } from "@/data/houseCollections";

export type KineticMood = {
  glow: string;
  accent: string;
};

export const kineticMoodByCollection: Record<string, KineticMood> = {
  statement: { glow: "rgba(40, 38, 36, 0.1)", accent: "rgba(20, 18, 16, 0.12)" },
  occasion: { glow: "rgba(140, 40, 50, 0.09)", accent: "rgba(120, 30, 40, 0.11)" },
  romance: { glow: "rgba(232, 180, 190, 0.12)", accent: "rgba(200, 140, 155, 0.14)" },
  bespoke: { glow: "rgba(196, 150, 120, 0.1)", accent: "rgba(180, 120, 90, 0.12)" },
  garden: { glow: "rgba(74, 110, 78, 0.09)", accent: "rgba(74, 110, 78, 0.14)" },
  peach: { glow: "rgba(196, 150, 120, 0.1)", accent: "rgba(180, 120, 90, 0.12)" },
  pink: { glow: "rgba(232, 180, 190, 0.12)", accent: "rgba(200, 140, 155, 0.14)" },
  noir: { glow: "rgba(40, 38, 36, 0.1)", accent: "rgba(20, 18, 16, 0.12)" },
  yellow: { glow: "rgba(200, 170, 90, 0.1)", accent: "rgba(180, 150, 70, 0.12)" },
  red: { glow: "rgba(140, 40, 50, 0.09)", accent: "rgba(120, 30, 40, 0.11)" },
  orange: { glow: "rgba(180, 110, 60, 0.1)", accent: "rgba(160, 90, 45, 0.12)" },
};

export type KineticPiece = {
  product: Product;
  tagline: string;
  images: string[];
  video?: string;
  mood: KineticMood;
  href: string;
};

export function getKineticPieces(): KineticPiece[] {
  return houseCollections.map((collection) => {
    const images = collection.photos.length ? collection.photos : [collection.cover];
    return {
      product: {
        slug: collection.slug,
        setId: 0,
        name: collection.title,
        collection: collection.slug,
        collectionLabel: collection.title,
        price: 0,
        currency: "INR",
        description: collection.description,
        story: collection.description,
        fabric: "",
        hero: collection.hero,
        detail: collection.cover,
        gallery: images.slice(1),
      },
      tagline: collection.description,
      images,
      mood: kineticMoodByCollection[collection.slug] ?? kineticMoodByCollection.noir,
      href: `/collections/${collection.slug}`,
    };
  });
}
