export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  hero: string;
  accent: string;
  season: string;
  setIds: number[];
};

export const collections: Collection[] = [
  {
    slug: "garden",
    title: "Garden Green",
    subtitle: "Sets 1–4",
    description:
      "Silk caught between petals and shadow. Olive, moss, and conservatory light — four distinct silhouettes born in overgrown glasshouses.",
    cover: "/assets/images/products/set-1/HSP_4327.jpg",
    hero: "/assets/images/products/set-3/HSP_3971.jpg",
    accent: "#4a5240",
    season: "Spring / Summer 2026",
    setIds: [1, 2, 3, 4],
  },
  {
    slug: "peach",
    title: "Peach",
    subtitle: "Set 5",
    description:
      "Soft warmth against pale stone. A single gesture in blush and gold — intimate, luminous, impossibly tender.",
    cover: "/assets/images/products/set-5/HSP_4393.jpg",
    hero: "/assets/images/products/set-5/VAM_6670.jpg",
    accent: "#d4a088",
    season: "Resort 2026",
    setIds: [5],
  },
  {
    slug: "noir",
    title: "Black Combo",
    subtitle: "Sets 6–10",
    description:
      "Monochrome as emotion. Five sculptural pieces in black and white — stripped to essence, presence in shadow.",
    cover: "/assets/images/products/set-8/HSP_2981.jpg",
    hero: "/assets/images/products/set-9/HSP_3158.jpg",
    accent: "#1a1a1a",
    season: "Permanent Collection",
    setIds: [6, 7, 8, 9, 10],
  },
  {
    slug: "yellow",
    title: "Yellow",
    subtitle: "Set 11",
    description:
      "Sunlight made garment. Bold, architectural, unapologetically bright — the moment the room holds its breath.",
    cover: "/assets/images/products/set-11/HSP_5848.jpg",
    hero: "/assets/images/products/set-11/HSP_5916.jpg",
    accent: "#c9a227",
    season: "Spring 2026",
    setIds: [11],
  },
  {
    slug: "red",
    title: "Red",
    subtitle: "Set 12",
    description:
      "Crimson as declaration. Deep, saturated, cinematic — the colour of the curtain rising.",
    cover: "/assets/images/products/set-12/HSP_5547.jpg",
    hero: "/assets/images/products/set-12/HSP_5750.jpg",
    accent: "#8b1a2b",
    season: "Autumn / Winter 2026",
    setIds: [12],
  },
  {
    slug: "orange",
    title: "Orange",
    subtitle: "Set 13",
    description:
      "Burnt orange satin in candlelight. Warmth, movement, and the dying embers of afternoon.",
    cover: "/assets/images/products/set-13/BHA_2011.jpg",
    hero: "/assets/images/products/set-13/HSP_2932.jpg",
    accent: "#c47a3a",
    season: "Resort 2026",
    setIds: [13],
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
