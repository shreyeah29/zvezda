import type { Product } from "@/data/products";
import { products } from "@/data/products";

export type KineticMood = {
  glow: string;
  accent: string;
};

/** One-line atelier copy keyed by product set id */
export const kineticTaglines: Record<number, string> = {
  1: "Silk caught between petals and shadow.",
  2: "Soft romantic silhouettes with couture detailing.",
  3: "Tiered volumes in olive light.",
  4: "Architectural green for a quiet room.",
  5: "A single gesture in blush and gold.",
  6: "Black as the deepest form of presence.",
  7: "Sculptural intent, stripped to essence.",
  8: "Royal eclipse — structure over spectacle.",
  9: "Ivory shadowed by night air.",
  10: "Matte darkness, precise cut.",
  11: "Sunlight made garment.",
  12: "Crimson as declaration.",
  13: "Burnt satin in candlelight.",
  14: "Noir revisited — denser, quieter.",
  15: "Romance in full bloom.",
  16: "Blush coordination for evening.",
  17: "Petals arranged like a garden hush.",
  18: "Rose mirage — soft, luminous, fleeting.",
};

export const kineticMoodByCollection: Record<string, KineticMood> = {
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
  mood: KineticMood;
};

export function getKineticPieces(): KineticPiece[] {
  return products.map((product) => {
    const images = Array.from(
      new Set([product.hero, product.detail, ...product.gallery].filter(Boolean)),
    );
    return {
      product,
      tagline:
        kineticTaglines[product.setId] ??
        "Couture silhouette from the Zvezda atelier.",
      images,
      mood: kineticMoodByCollection[product.collection] ?? kineticMoodByCollection.noir,
    };
  });
}
