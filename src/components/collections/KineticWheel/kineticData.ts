import type { Product } from "@/data/products";
import {
  HOUSE_COLLECTION_LABELS,
  HOUSE_COLLECTION_SLUGS,
  type HouseCollectionSlug,
} from "@/data/houseCollections";
import { getHouseCollectionProducts } from "@/data/shopCatalog";

export type KineticMood = {
  glow: string;
  accent: string;
};

function firstSentence(text: string) {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match?.[0]?.trim() ?? text;
}

export const kineticMoodByHouse: Record<HouseCollectionSlug, KineticMood> = {
  occasion: { glow: "rgba(140, 40, 50, 0.12)", accent: "rgba(120, 30, 40, 0.14)" },
  statement: { glow: "rgba(40, 38, 36, 0.12)", accent: "rgba(20, 18, 16, 0.14)" },
  romance: { glow: "rgba(232, 180, 190, 0.14)", accent: "rgba(200, 140, 155, 0.16)" },
  bespoke: { glow: "rgba(196, 165, 116, 0.14)", accent: "rgba(180, 150, 90, 0.16)" },
};

export const KINETIC_HOUSE_ORDER: HouseCollectionSlug[] = [
  "occasion",
  "statement",
  "romance",
  "bespoke",
];

export type KineticPiece = {
  product: Product;
  tagline: string;
  images: string[];
  video?: string;
  mood: KineticMood;
  house: HouseCollectionSlug;
};

export function getKineticHouses() {
  return KINETIC_HOUSE_ORDER.map((slug) => ({
    slug,
    label: HOUSE_COLLECTION_LABELS[slug],
    count: getHouseCollectionProducts(slug).length,
  })).filter((house) => house.count > 0);
}

export function getKineticPieces(house: HouseCollectionSlug = "occasion"): KineticPiece[] {
  const mood = kineticMoodByHouse[house];
  return getHouseCollectionProducts(house).map((product) => {
    const images = Array.from(
      new Set([product.hero, product.detail, ...product.gallery].filter(Boolean)),
    );
    return {
      product,
      tagline: firstSentence(product.description) || "Couture silhouette from the Zvezda atelier.",
      images,
      video: product.video,
      mood,
      house,
    };
  });
}

export { HOUSE_COLLECTION_SLUGS };
