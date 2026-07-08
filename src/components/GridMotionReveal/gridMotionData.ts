import { products } from "@/data/products";

export type GridMotionItem = {
  src: string;
  alt: string;
  slug: string;
};

export type GridMotionSlots = {
  layer1: GridMotionItem[];
  layer2: GridMotionItem[];
  layer3: GridMotionItem[];
  scaler: GridMotionItem;
};

/** Fullscreen center image — film editorial, not used in surrounding grid */
const SCALER_IMAGE = "/assets/images/film/HSP_4145.jpg";

const SCALER: GridMotionItem = {
  src: SCALER_IMAGE,
  alt: "Zvezda Collection 2026",
  slug: "set-1",
};

function buildImagePool(): GridMotionItem[] {
  const seen = new Set<string>([SCALER_IMAGE]);
  const pool: GridMotionItem[] = [];

  const add = (src: string, alt: string, slug: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    pool.push({ src, alt, slug });
  };

  for (const product of products) {
    add(product.hero, product.name, product.slug);
    for (const src of product.gallery) {
      add(src, product.name, product.slug);
    }
  }

  return pool;
}

export function getGridMotionSlots(): GridMotionSlots {
  const pool = buildImagePool();

  if (pool.length === 0) {
    const fallback: GridMotionItem = { src: "", alt: "", slug: "" };
    return {
      layer1: Array.from({ length: 6 }, () => fallback),
      layer2: Array.from({ length: 6 }, () => fallback),
      layer3: Array.from({ length: 2 }, () => fallback),
      scaler: SCALER,
    };
  }

  const items: GridMotionItem[] = [];
  for (let index = 0; index < 14; index += 1) {
    items.push(pool[index % pool.length]);
  }

  return {
    layer1: items.slice(0, 6),
    layer2: items.slice(6, 12),
    layer3: items.slice(12, 14),
    scaler: SCALER,
  };
}
