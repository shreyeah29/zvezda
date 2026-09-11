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
import { getShopProduct, shopProducts } from "./shopCatalog";

export type PriceOption = {
  label: string;
  amount: number;
};

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
  craft?: string[];
  care?: string;
  hero: string;
  detail: string;
  gallery: string[];
  video?: string;
  videoAlt?: string;
  videoObjectPosition?: string;
  priceOnRequest?: boolean;
  priceOptions?: PriceOption[];
  sizeOptions?: string[];
  sizeNote?: string;
  colours?: string[];
  garmentType?: string;
};

/** Homepage/collections set IDs mapped to the matching shop catalog piece. */
const SET_SHOP_SLUG: Record<number, string> = {
  1: "jardin-elegance-dress",
  2: "verdant-whisper-gown",
  3: "olive-tiered-zephyr-mini-dress",
  4: "conservatory-iv",
  5: "blush-mirage",
  6: "rosa-imperiale",
  7: "blush-noir-2-piece-set",
  8: "eclipse-royale",
  9: "ivory-eclipse",
  10: "velvet-blooms-dress",
  11: "molten-muse",
  12: "carmine-ascend",
  13: "the-scarlett-heiress-dress",
  14: "starlit-halter-gown",
  15: "crimson-petal-serenade",
  16: "daughters-of-spring-pink",
  17: "rosalind-jacket-blush-column-jumpsuit",
  18: "rosewood-heirloom",
};

const editorialNames: Record<number, string> = {
  4: "Conservatory IV",
  12: "Crimson",
};

const editorialDescriptions: Record<number, string> = {
  12: "A sculpted crimson gown cut for presence — open at the back, falling into a generous train that moves like a curtain rising. The silhouette is spare, the colour unapologetic: a couture evening piece designed to hold the room.",
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
  const shopSlug = SET_SHOP_SLUG[set.id];
  const shop = shopSlug ? getShopProduct(shopSlug) : undefined;

  return {
    slug: set.slug,
    setId: set.id,
    name: shop?.name ?? editorialNames[set.id] ?? `Piece ${set.id}`,
    collection: shop?.collection ?? set.collection,
    collectionLabel: shop?.collectionLabel ?? group.label,
    price: shop?.price ?? prices[set.id] ?? 5000,
    currency: shop ? "INR" : "USD",
    priceOnRequest: shop?.priceOnRequest,
    priceOptions: shop?.priceOptions,
    sizeOptions: shop?.sizeOptions,
    sizeNote: shop?.sizeNote,
    description:
      shop?.description ||
      editorialDescriptions[set.id] ||
      `${group.label} — couture piece from the Zvezda atelier.`,
    story: shop?.story || stories[set.group],
    fabric: shop?.fabric || fabrics[set.group],
    craft: shop?.craft,
    care: shop?.care ?? "Dry clean only",
    hero: setHeroPhoto(set),
    detail,
    gallery: gallery.length > 1 ? gallery.slice(1) : gallery,
    video: setVideoPath(set) ?? setAmbientVideoPath(set),
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

export function getSetDisplayName(setId: number) {
  return products.find((p) => p.setId === setId)?.name ?? `Piece ${setId}`;
}

export function getProductsByCollection(collectionSlug: string) {
  const fromShop = shopProducts.filter((product) => product.collection === collectionSlug);
  if (fromShop.length > 0) return fromShop;
  return products.filter((p) => p.collection === collectionSlug);
}

export function formatPrice(price: number, currency = "USD") {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatProductPrice(product: Pick<Product, "price" | "currency" | "priceOnRequest">) {
  if (product.priceOnRequest) return "Price on request";
  return formatPrice(product.price, product.currency);
}
