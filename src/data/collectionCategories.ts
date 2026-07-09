import { getSet, setPhotoPath, type SetGroup } from "./sets";

export type CollectionLayout =
  | "green-simple"
  | "inertia"
  | "drag-carousel"
  | "depth-blur"
  | "editorial-tones";

export type GalleryImage = {
  src: string;
  alt: string;
  href?: string;
  borderRadius?: string;
};

export type CollectionCategory = {
  id: string;
  title: string;
  displayTitle: string;
  subtitle: string;
  story: string;
  storyLines: string[];
  heroVideo?: string;
  heroPoster?: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  group: SetGroup;
  layout: CollectionLayout;
  galleryImages: GalleryImage[];
  showStory?: boolean;
};

const EDITORIAL_NAMES: Record<number, string> = {
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
};

const BLACK_WHITE_FILM = [
  "HSP_3296.jpg",
  "HSP_3310.jpg",
  "HSP_3336.jpg",
  "HSP_3409.jpg",
  "HSP_3517.jpg",
  "HSP_3590.jpg",
  "HSP_3615.jpg",
  "HSP_3626.jpg",
  "HSP_3641.jpg",
].map((file) => `/assets/images/film/${file}`);

function photosFromSets(
  setIds: number[],
  withLinks = true,
  maxPerSet?: number,
): GalleryImage[] {
  return setIds.flatMap((setId) => {
    const set = getSet(setId);
    if (!set) return [];
    const name = EDITORIAL_NAMES[setId] ?? set.slug;
    const photos = maxPerSet ? set.photos.slice(0, maxPerSet) : set.photos;
    return photos.map((photo) => ({
      src: setPhotoPath(set, photo),
      alt: name,
      href: withLinks ? `/products/${set.slug}` : undefined,
      borderRadius: "4%",
    }));
  });
}

function filmPhotos(paths: string[], prefix: string): GalleryImage[] {
  return paths.map((src, index) => ({
    src,
    alt: `${prefix} editorial ${index + 1}`,
    borderRadius: "4%",
  }));
}

export const collectionCategories: CollectionCategory[] = [
  {
    id: "green",
    title: "Green",
    displayTitle: "Green",
    subtitle: "Sets 1–4 · Garden Campaign",
    story:
      "Silk caught between petals and shadow. Four silhouettes born among wild anthuriums, conservatory glass, and tall grasses.",
    storyLines: [
      "Olive, moss, and glasshouse light.",
      "Four distinct silhouettes from the garden.",
    ],
    heroVideo: "/assets/videos/film/GardenTrio.mp4",
    heroPoster: "/assets/images/film/HSP_4096.jpg",
    backgroundColor: "#08120d",
    accentColor: "#6b8f71",
    textColor: "#e8f0ea",
    mutedColor: "rgba(232,240,234,0.58)",
    group: "garden-green",
    layout: "green-simple",
    galleryImages: photosFromSets([1, 2, 3, 4], true, 2),
    showStory: false,
  },
  {
    id: "black-white",
    title: "Black & White",
    displayTitle: "Black & White",
    subtitle: "Sets 8–9 · Monochrome Campaign",
    story:
      "Black is not the absence of colour — it is the deepest form of presence. Sculptural, intentional, stripped to essence.",
    storyLines: [
      "Monochrome as emotion.",
      "Presence in shadow, radiance in white.",
    ],
    heroVideo: "/assets/videos/products/set-8/White&Black1.mp4",
    heroPoster: "/assets/images/products/set-8/HSP_2981.jpg",
    backgroundColor: "#050505",
    accentColor: "#c4a574",
    textColor: "#f5f0e8",
    mutedColor: "rgba(245,240,232,0.55)",
    group: "black-combo",
    layout: "inertia",
    galleryImages: [
      ...photosFromSets([8, 9], false),
      ...filmPhotos(BLACK_WHITE_FILM, "Black & White"),
    ],
    showStory: true,
  },
  {
    id: "orange",
    title: "Orange",
    displayTitle: "Orange",
    subtitle: "Sets 6 & 13 · Warm Campaign",
    story:
      "Burnt satin in candlelight. Warmth, movement, and the dying embers of a golden afternoon.",
    storyLines: ["Burnt satin in candlelight.", "Warmth that moves with the body."],
    heroVideo: "/assets/videos/products/set-13/OrangeSolo1.mp4",
    heroPoster: "/assets/images/products/set-13/HSP_2932.jpg",
    backgroundColor: "#120c08",
    accentColor: "#c47a3a",
    textColor: "#f5ece4",
    mutedColor: "rgba(245,236,228,0.55)",
    group: "orange",
    layout: "drag-carousel",
    galleryImages: photosFromSets([6, 13], false),
    showStory: false,
  },
  {
    id: "black-pink",
    title: "Black Pink",
    displayTitle: "Black Pink",
    subtitle: "Sets 7 & 10 · Nocturne Campaign",
    story:
      "Between shadow and blush — a study in contrast. Sculptural black forms meet the faintest trace of rose, intimate and deliberate.",
    storyLines: [
      "Shadow held close.",
      "A whisper of rose in the dark.",
      "Intimate. Deliberate. Unforgettable.",
    ],
    heroPoster: "/assets/images/products/set-7/HSP_2254.jpg",
    backgroundColor: "#0a0608",
    accentColor: "#b86b7a",
    textColor: "#f5ece8",
    mutedColor: "rgba(245,236,232,0.58)",
    group: "black-combo",
    layout: "depth-blur",
    galleryImages: photosFromSets([7, 10], false),
    showStory: false,
  },
  {
    id: "red-yellow-peach",
    title: "Crimson · Solar · Peach",
    displayTitle: "Crimson · Solar · Peach",
    subtitle: "Sets 12, 11 & 5 · Colour Stories",
    story:
      "Three declarations of colour — crimson as arrival, yellow as sunlight made garment, peach as the softest gesture of warmth.",
    storyLines: [
      "Crimson as declaration.",
      "Sunlight made garment.",
      "Blush against pale stone.",
    ],
    heroVideo: "/assets/videos/RedDressSolo.mp4",
    heroPoster: "/assets/images/products/set-12/HSP_5750.jpg",
    backgroundColor: "#0a0808",
    accentColor: "#c4a574",
    textColor: "#f5f0e8",
    mutedColor: "rgba(245,240,232,0.55)",
    group: "red",
    layout: "editorial-tones",
    galleryImages: [
      ...photosFromSets([12], false),
      ...photosFromSets([11], false),
      ...photosFromSets([5], false),
    ],
    showStory: true,
  },
];

export const toneSubsections = [
  {
    id: "red",
    title: "Red",
    subtitle: "Set 12",
    story: "Crimson as declaration. Deep, saturated, cinematic.",
    heroVideo: "/assets/videos/RedDressSolo.mp4",
    heroPoster: "/assets/images/products/set-12/HSP_5750.jpg",
    accentColor: "#8b1a2b",
    setIds: [12] as number[],
  },
  {
    id: "yellow",
    title: "Yellow",
    subtitle: "Set 11",
    story: "Sunlight made garment. Bold, architectural, unapologetically bright.",
    heroVideo: "/assets/videos/products/set-11/YellowSolo1.mp4",
    heroPoster: "/assets/images/products/set-11/HSP_5916.jpg",
    accentColor: "#e8c547",
    setIds: [11] as number[],
  },
  {
    id: "peach",
    title: "Peach",
    subtitle: "Set 5",
    story: "Soft warmth against pale stone. Intimate, luminous, impossibly tender.",
    heroVideo: "/assets/videos/products/set-5/PeachSolo1.mp4",
    heroPoster: "/assets/images/products/set-5/HSP_4393.jpg",
    accentColor: "#d4a088",
    setIds: [5] as number[],
  },
];
