export const HOUSE_COLLECTION_SLUGS = [
  "statement",
  "occasion",
  "romance",
  "bespoke",
] as const;

export type HouseCollectionSlug = (typeof HOUSE_COLLECTION_SLUGS)[number];

export const HOUSE_COLLECTION_LABELS: Record<HouseCollectionSlug, string> = {
  statement: "The Statement",
  occasion: "The Occasion",
  romance: "Romance",
  bespoke: "Bespoke",
};

export type HouseCollection = {
  slug: HouseCollectionSlug;
  title: string;
  season: string;
  description: string;
  accent: string;
  cover: string;
  hero: string;
  photos: string[];
  productSlugs: string[];
};

export const houseCollections: HouseCollection[] = [
  {
    slug: "statement",
    title: "The Statement",
    season: "Atelier",
    description:
      "Pieces made to hold the room — sculptural, uncompromising, and built for presence.",
    accent: "#1a1a1a",
    cover: "/assets/images/shop/eclipse-royale/HSP_2982.jpg",
    hero: "/assets/images/shop/ivory-eclipse/HSP_3218.jpg",
    photos: [
      "/assets/images/shop/the-scarlett-heiress-dress/BHA_2027.jpg",
      "/assets/images/shop/set-26/IMG_7329.jpg",
      "/assets/images/shop/set-25/IMG_7332.jpg",
      "/assets/images/shop/ivory-eclipse/HSP_3218.jpg",
      "/assets/images/shop/butterfly-inspired/IMG_6783.jpg",
    ],
    productSlugs: [
      "the-scarlett-heiress-dress",
      "set-26",
      "set-25",
      "ivory-eclipse",
      "butterfly-inspired",
      "blush-elan",
      "starlit-halter-gown",
      "eclipse-royale",
      "velvet-blooms-dress",
      "fire-and-ice",
      "verdant-whisper-gown",
      "zeenat",
    ],
  },
  {
    slug: "occasion",
    title: "The Occasion",
    season: "Atelier",
    description: "Evening silhouettes for dinners, galas, and nights that ask for a little more.",
    accent: "#8b1a2b",
    cover: "/assets/images/shop/wine-velvet/01.jpg",
    hero: "/assets/images/shop/molten-muse/HSP_5916.jpg",
    photos: [
      "/assets/images/shop/molten-muse/HSP_5916.jpg",
      "/assets/images/shop/wine-velvet/01.jpg",
      "/assets/images/shop/obsidian-drape/01.jpg",
      "/assets/images/shop/terra-bloom/01.jpg",
      "/assets/images/shop/ivory-satin/01.jpg",
    ],
    productSlugs: [
      "obsidian-drape",
      "terra-bloom",
      "wine-velvet",
      "ivory-satin",
      "allure-slit",
      "blush-noir-2-piece-set",
      "carmine-ascend",
      "molten-muse",
      "pearl-tailored-set",
    ],
  },
  {
    slug: "romance",
    title: "Romance",
    season: "Atelier",
    description: "Soft colour, garden light, and pieces that feel like a held breath.",
    accent: "#e8a4b8",
    cover: "/assets/images/shop/jardin-elegance-dress/HSP_4309.jpg",
    hero: "/assets/images/shop/blush-mirage/HSP_4492.jpg",
    photos: [
      "/assets/images/shop/jardin-elegance-dress/HSP_4309.jpg",
      "/assets/images/shop/olive-tiered-zephyr-mini-dress/HSP_3876.jpg",
      "/assets/images/shop/rosalind-jacket-blush-column-jumpsuit/HSP_5292.jpg",
      "/assets/images/shop/blush-mirage/HSP_4492.jpg",
      "/assets/images/shop/denim-dress/IMG_7857.jpg",
    ],
    productSlugs: [
      "jardin-elegance-dress",
      "olive-tiered-zephyr-mini-dress",
      "rosalind-jacket-blush-column-jumpsuit",
      "denim-dress",
      "daughters-of-spring-green",
      "daughters-of-spring-pink",
      "blush-mirage",
      "conservatory-iv",
      "seraphina-dress",
    ],
  },
  {
    slug: "bespoke",
    title: "Bespoke",
    season: "Atelier",
    description: "One-of-one couture — hand-built florals, pearls, and pieces made to be spoken for.",
    accent: "#c4a574",
    cover: "/assets/images/shop/pearl-cascade/01.jpg",
    hero: "/assets/images/shop/blooming-rosalia-3d-gown/BHA_4839.jpg",
    photos: [
      "/assets/images/shop/pearl-cascade/01.jpg",
      "/assets/images/shop/blooming-rosalia-3d-gown/BHA_4839.jpg",
      "/assets/images/shop/rosa-imperiale/HSP_2850.jpg",
    ],
    productSlugs: ["pearl-cascade", "blooming-rosalia-3d-gown", "rosa-imperiale", "petal-dress"],
  },
];

export function getHouseCollection(slug: string) {
  return houseCollections.find((collection) => collection.slug === slug);
}
