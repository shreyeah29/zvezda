import type { Collection } from "@/data/collections";
import { getProduct } from "@/data/products";
import { sets } from "@/data/sets";

export type CollectionTheme = {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  overlay: string;
  texture?: string;
  spotlight?: boolean;
  movingLight?: boolean;
};

export const collectionThemes: Record<string, CollectionTheme> = {
  noir: {
    bg: "#030303",
    text: "#f5f0e8",
    muted: "rgba(245,240,232,0.55)",
    accent: "#c4a574",
    overlay:
      "radial-gradient(ellipse 55% 45% at 50% 35%, rgba(255,255,255,0.07) 0%, transparent 65%)",
    spotlight: true,
  },
  garden: {
    bg: "#0a1510",
    text: "#e8f0ea",
    muted: "rgba(232,240,234,0.58)",
    accent: "#6b8f71",
    overlay:
      "radial-gradient(ellipse 60% 50% at 70% 30%, rgba(107,143,113,0.18) 0%, transparent 70%)",
    movingLight: true,
  },
  peach: {
    bg: "#f3ece2",
    text: "#1a1612",
    muted: "rgba(26,22,18,0.58)",
    accent: "#c48870",
    overlay:
      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)",
    texture: "paper",
  },
  yellow: {
    bg: "#12100a",
    text: "#f5f0e8",
    muted: "rgba(245,240,232,0.55)",
    accent: "#e8c547",
    overlay:
      "radial-gradient(circle at 20% 80%, rgba(232,197,71,0.12) 0%, transparent 50%)",
  },
  red: {
    bg: "#0f0608",
    text: "#f5ecee",
    muted: "rgba(245,236,238,0.55)",
    accent: "#8b1a2b",
    overlay:
      "radial-gradient(ellipse 50% 40% at 40% 60%, rgba(139,26,43,0.22) 0%, transparent 70%)",
    spotlight: true,
  },
  orange: {
    bg: "#120c08",
    text: "#f5ece4",
    muted: "rgba(245,236,228,0.55)",
    accent: "#c47a3a",
    overlay:
      "radial-gradient(circle at 80% 20%, rgba(196,122,58,0.15) 0%, transparent 55%)",
    movingLight: true,
  },
  pink: {
    bg: "#1a0f12",
    text: "#fce8ee",
    muted: "rgba(252,232,238,0.58)",
    accent: "#e8a4b8",
    overlay:
      "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(232,164,184,0.2) 0%, transparent 70%)",
    movingLight: true,
  },
};

export function getCollectionProducts(collection: Collection) {
  return collection.setIds
    .map((id) => sets.find((s) => s.id === id))
    .filter(Boolean)
    .map((set) => getProduct(set!.slug))
    .filter(Boolean);
}

/** Scattered masonry positions — responsive via CSS grid spans */
export function getMasonryLayout(count: number) {
  const patterns = [
    { col: "span 7", row: "span 2", offset: 0 },
    { col: "span 5", row: "span 1", offset: 1 },
    { col: "span 4", row: "span 2", offset: 0 },
    { col: "span 5", row: "span 1", offset: 2 },
    { col: "span 6", row: "span 2", offset: 1 },
    { col: "span 6", row: "span 1", offset: 0 },
  ];
  return Array.from({ length: count }, (_, i) => patterns[i % patterns.length]);
}
