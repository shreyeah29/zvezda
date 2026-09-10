import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { getSet, setAmbientVideoPath } from "@/data/sets";

export type KineticMood = {
  glow: string;
  accent: string;
};

function firstSentence(text: string) {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match?.[0]?.trim() ?? text;
}

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
  video?: string;
  mood: KineticMood;
};

export function getKineticPieces(): KineticPiece[] {
  return products.map((product) => {
    const images = Array.from(
      new Set([product.hero, product.detail, ...product.gallery].filter(Boolean)),
    );
    const set = getSet(product.setId);
    const ambient = set ? setAmbientVideoPath(set) : undefined;
    return {
      product,
      tagline: firstSentence(product.description) || "Couture silhouette from the Zvezda atelier.",
      images,
      // Prefer ambient web encodes for the kinetic background; fall back to master.
      video: ambient ?? product.video,
      mood: kineticMoodByCollection[set?.collection ?? product.collection] ?? kineticMoodByCollection.noir,
    };
  });
}
