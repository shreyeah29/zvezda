import {
  sets,
  setGroups,
  setHeroPhoto,
  setGalleryPhotos,
  setVideoPath,
  setAmbientVideoPath,
  type SetManifest,
  type SetGroup,
} from "./sets";

export type Product = {
  slug: string;
  setId: number;
  name: string;
  collection: string;
  collectionLabel: string;
  price: number;
  currency: string;
  description: string;
  story: string;
  fabric: string;
  hero: string;
  detail: string;
  gallery: string[];
  video?: string;
  videoAlt?: string;
  videoObjectPosition?: string;
};

const editorialNames: Record<number, string> = {
  1: "Fardin Elegance",
  2: "Verdant Whisper Gown",
  3: "Olive Tiered Zephyr Mini Dress",
  4: "Conservatory IV",
  5: "Blush Mirage",
  6: "Noir I",
  7: "Noir II",
  8: "Eclipse Royale",
  9: "Ivory Eclipse",
  10: "Noir V",
  11: "Solar",
  12: "Crimson",
  13: "Ember",
  14: "Noir VI",
  15: "Rose Cascade",
  16: "Blush Coordination",
  17: "Petal Garden",
  18: "Rose Mirage",
};

const prices: Record<number, number> = {
  1: 52000,
  2: 48000,
  3: 56000,
  4: 62000,
  5: 44000,
  6: 58000,
  7: 49000,
  8: 72000,
  9: 68000,
  10: 54000,
  11: 61000,
  12: 124000,
  13: 89000,
  14: 57000,
  15: 48000,
  16: 52000,
  17: 50000,
  18: 46000,
};

const stories: Record<SetGroup, string> = {
  "garden-green":
    "Silk caught between petals and shadow. Designed among wild anthuriums and tall grasses — each tier falls like a leaf caught mid-descent.",
  peach:
    "Soft warmth against pale stone. A single gesture in blush and gold — intimate, luminous, impossibly tender.",
  pink:
    "Romance in full bloom. Blush satin, hand-placed florals, and the soft hush of a garden at golden hour.",
  "black-combo":
    "Black is not the absence of colour — it is the deepest form of presence. Sculptural, intentional, stripped to essence.",
  yellow:
    "Sunlight made garment. Bold, architectural, unapologetically bright — the moment the room holds its breath.",
  red: "Crimson as declaration. Deep, saturated, cinematic — the colour of the curtain rising.",
  orange:
    "Burnt satin in candlelight. Warmth, movement, and the dying embers of a golden afternoon.",
};

const fabrics: Record<SetGroup, string> = {
  "garden-green": "Double-faced silk satin, hand-finished seams, internal structure in French lace.",
  peach: "Silk georgette and organza, hand-dyed blush, bias-cut panels.",
  pink: "Silk satin and organza, hand-embroidered florals, delicate boning.",
  "black-combo": "Japanese wool crepe and silk dupioni, architectural boning, matte finish.",
  yellow: "Italian duchess satin, horsehair crinoline, hand-stitched hem.",
  red: "Silk organza with hand-sculpted appliqué, internal corsetry in French lace.",
  orange: "Duchess satin and silk velvet, fluid drape with structured bodice.",
};

function setToProduct(set: SetManifest): Product {
  const group = setGroups[set.group];
  const gallery = setGalleryPhotos(set);
  const detail = gallery[0] ?? setHeroPhoto(set);

  return {
    slug: set.slug,
    setId: set.id,
    name: editorialNames[set.id] ?? `Piece ${set.id}`,
    collection: set.collection,
    collectionLabel: group.label,
    price: prices[set.id] ?? 5000,
    currency: "USD",
    description: `${group.label} — couture piece from the Zvezda atelier.`,
    story: stories[set.group],
    fabric: fabrics[set.group],
    hero: setHeroPhoto(set),
    detail,
    gallery: gallery.length > 1 ? gallery.slice(1) : gallery,
    // Prefer lightweight web encodes for PDP playback; masters stay on disk for future use.
    video: setAmbientVideoPath(set) ?? setVideoPath(set),
    videoAlt: set.videoAlt
      ? setAmbientVideoPath(set, set.videoAlt) ?? setVideoPath(set, set.videoAlt)
      : undefined,
    videoObjectPosition: set.videoObjectPosition,
  };
}

export const products: Product[] = sets.map(setToProduct);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string) {
  return products.filter((p) => p.collection === collectionSlug);
}

export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}
