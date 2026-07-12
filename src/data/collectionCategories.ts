import { getSet, setPhotoPath, type SetGroup } from "./sets";

export type GalleryImage = {
  src: string;
  alt: string;
  href?: string;
  borderRadius?: string;
};

export type GalleryMediaItem = {
  image?: string;
  videoFile?: string;
  videoUrl?: string;
  title?: string;
  href?: string;
  type?: "auto" | "foto" | "video";
};

export type CollectionCategory = {
  id: string;
  title: string;
  displayTitle: string;
  subtitle: string;
  heroVideo?: string;
  heroPoster?: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  group: SetGroup;
  setIds: number[];
  galleryImages: GalleryImage[];
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
  14: "Noir VI",
  15: "Rose Cascade",
  16: "Blush Coordination",
  17: "Petal Garden",
  18: "Rose Mirage",
};

function photosFromSets(setIds: number[]): GalleryImage[] {
  return setIds.flatMap((setId) => {
    const set = getSet(setId);
    if (!set) return [];
    const name = EDITORIAL_NAMES[setId] ?? set.slug;
    return set.photos.map((photo) => ({
      src: setPhotoPath(set, photo),
      alt: name,
      href: `/products/${set.slug}`,
    }));
  });
}

export function toGalleryMediaItems(images: GalleryImage[]): GalleryMediaItem[] {
  return images.map((image) => ({
    image: image.src,
    title: image.alt,
    href: image.href,
    type: "foto" as const,
  }));
}

export const collectionCategories: CollectionCategory[] = [
  {
    id: "green",
    title: "Green",
    displayTitle: "Green",
    subtitle: "Sets 1–4 · Garden Campaign",
    heroVideo: "/assets/videos/film/GardenTrio.mp4",
    heroPoster: "/assets/images/film/HSP_4096.jpg",
    backgroundColor: "#08120d",
    accentColor: "#6b8f71",
    textColor: "#e8f0ea",
    mutedColor: "rgba(232,240,234,0.58)",
    group: "garden-green",
    setIds: [1, 2, 3, 4],
    galleryImages: photosFromSets([1, 2, 3, 4]),
  },
  {
    id: "black-white",
    title: "Black & White",
    displayTitle: "Black & White",
    subtitle: "Sets 8–9 · Monochrome Campaign",
    heroVideo: "/assets/videos/products/set-8/White&Black1.mp4",
    heroPoster: "/assets/images/products/set-8/HSP_2981.jpg",
    backgroundColor: "#050505",
    accentColor: "#c4a574",
    textColor: "#f5f0e8",
    mutedColor: "rgba(245,240,232,0.55)",
    group: "black-combo",
    setIds: [8, 9],
    galleryImages: photosFromSets([8, 9]),
  },
  {
    id: "orange",
    title: "Orange",
    displayTitle: "Orange",
    subtitle: "Sets 6 & 13 · Warm Campaign",
    heroVideo: "/assets/videos/products/set-13/OrangeSolo1.mp4",
    heroPoster: "/assets/images/products/set-13/HSP_2932.jpg",
    backgroundColor: "#120c08",
    accentColor: "#c47a3a",
    textColor: "#f5ece4",
    mutedColor: "rgba(245,236,228,0.55)",
    group: "orange",
    setIds: [6, 13],
    galleryImages: photosFromSets([6, 13]),
  },
  {
    id: "black-pink",
    title: "Black Pink",
    displayTitle: "Black Pink",
    subtitle: "Sets 7, 10 & 14 · Nocturne Campaign",
    heroVideo: "/assets/videos/film/White&BlackTrio.mp4",
    heroPoster: "/assets/images/products/set-7/HSP_2254.jpg",
    backgroundColor: "#0a0608",
    accentColor: "#b86b7a",
    textColor: "#f5ece8",
    mutedColor: "rgba(245,236,232,0.58)",
    group: "black-combo",
    setIds: [7, 10, 14],
    galleryImages: photosFromSets([7, 10, 14]),
  },
  {
    id: "pink",
    title: "Pink",
    displayTitle: "Pink",
    subtitle: "Sets 15–18 · Rose Campaign",
    heroVideo: "/assets/videos/products/set-15/PinkSolo1.mp4",
    heroPoster: "/assets/images/products/set-15/HSP_4946.jpg",
    backgroundColor: "#1a0f12",
    accentColor: "#e8a4b8",
    textColor: "#fce8ee",
    mutedColor: "rgba(252,232,238,0.58)",
    group: "pink",
    setIds: [15, 16, 17, 18],
    galleryImages: photosFromSets([15, 16, 17, 18]),
  },
  {
    id: "red-yellow-peach",
    title: "Crimson · Solar · Peach",
    displayTitle: "Crimson · Solar · Peach",
    subtitle: "Sets 12, 11 & 5 · Colour Stories",
    heroVideo: "/assets/videos/RedDressSolo.mp4",
    heroPoster: "/assets/images/products/set-12/HSP_5750.jpg",
    backgroundColor: "#0a0808",
    accentColor: "#c4a574",
    textColor: "#f5f0e8",
    mutedColor: "rgba(245,240,232,0.55)",
    group: "red",
    setIds: [12, 11, 5],
    galleryImages: photosFromSets([12, 11, 5]),
  },
];
