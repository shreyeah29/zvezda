import {
  getSet,
  setPhotoPath,
  setVideoPath,
  type SetGroup,
} from "./sets";

export type CollectionCategoryId =
  | "green"
  | "black-white"
  | "orange"
  | "yellow"
  | "red";

export type GalleryMediaItem = {
  image?: string;
  videoFile?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  type?: "auto" | "foto" | "video";
  href?: string;
};

export type CollectionCategory = {
  id: CollectionCategoryId;
  title: string;
  displayTitle: string;
  subtitle: string;
  story: string;
  storyLines: string[];
  heroVideo: string;
  heroPoster?: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  group: SetGroup;
  setIds: number[];
  editorialVideos: { src: string; title: string; poster?: string }[];
  editorialPhotos?: string[];
};

const EDITORIAL_NAMES: Record<number, string> = {
  1: "Fardin Elegance",
  2: "Verdant Whisper Gown",
  3: "Olive Tiered Zephyr Mini Dress",
  4: "Conservatory IV",
  6: "Noir I",
  7: "Noir II",
  8: "Eclipse Royale",
  9: "Ivory Eclipse",
  10: "Noir V",
  11: "Solar",
  12: "Crimson",
  13: "Ember",
};

const FILM_PHOTOS = [
  "HSP_3296.jpg",
  "HSP_3310.jpg",
  "HSP_3336.jpg",
  "HSP_3409.jpg",
  "HSP_3517.jpg",
  "HSP_3590.jpg",
  "HSP_3615.jpg",
  "HSP_3626.jpg",
  "HSP_3641.jpg",
  "HSP_4096.jpg",
  "HSP_4145.jpg",
  "HSP_4233.jpg",
  "HSP_4408.jpg",
  "HSP_4662.jpg",
  "HSP_4669.jpg",
  "HSP_4702.jpg",
  "HSP_4743.jpg",
  "HSP_4751.jpg",
  "HSP_4755.jpg",
  "HSP_4779.jpg",
  "HSP_4787.jpg",
].map((file) => `/assets/images/film/${file}`);

export const collectionCategories: CollectionCategory[] = [
  {
    id: "green",
    title: "Green",
    displayTitle: "Green",
    subtitle: "Sets 1–4 · Garden Campaign",
    story:
      "Silk caught between petals and shadow. Four silhouettes born among wild anthuriums, conservatory glass, and tall grasses — each tier falls like a leaf caught mid-descent.",
    storyLines: [
      "Olive, moss, and glasshouse light.",
      "Four distinct silhouettes from the garden.",
      "Where silk meets the wild.",
    ],
    heroVideo: "/assets/videos/film/GardenTrio.mp4",
    heroPoster: "/assets/images/film/HSP_4096.jpg",
    backgroundColor: "#08120d",
    accentColor: "#6b8f71",
    textColor: "#e8f0ea",
    mutedColor: "rgba(232,240,234,0.58)",
    group: "garden-green",
    setIds: [1, 2, 3, 4],
    editorialVideos: [
      { src: "/assets/videos/film/GardenDuo1.mp4", title: "Garden Duo I" },
      { src: "/assets/videos/film/GardenTrio.mp4", title: "Garden Trio" },
      { src: "/assets/videos/film/GardenTrioSingleShot.mp4", title: "Garden Trio — Single Shot" },
    ],
    editorialPhotos: FILM_PHOTOS,
  },
  {
    id: "black-white",
    title: "Black & White",
    displayTitle: "Black & White",
    subtitle: "Sets 6–10 · Monochrome Campaign",
    story:
      "Black is not the absence of colour — it is the deepest form of presence. Five sculptural pieces stripped to essence, moving between shadow and ivory light.",
    storyLines: [
      "Monochrome as emotion.",
      "Sculptural. Intentional. Stripped to essence.",
      "Presence in shadow, radiance in white.",
    ],
    heroVideo: "/assets/videos/products/set-8/White&Black1.mp4",
    heroPoster: "/assets/images/products/set-8/HSP_2981.jpg",
    backgroundColor: "#050505",
    accentColor: "#c4a574",
    textColor: "#f5f0e8",
    mutedColor: "rgba(245,240,232,0.55)",
    group: "black-combo",
    setIds: [6, 7, 8, 9, 10],
    editorialVideos: [
      { src: "/assets/videos/products/set-8/White&Black1.mp4", title: "Black & White I" },
      { src: "/assets/videos/products/set-9/White&Black2.mp4", title: "Black & White II" },
      { src: "/assets/videos/film/White&BlackTrio.mp4", title: "Black & White Trio" },
    ],
  },
  {
    id: "orange",
    title: "Orange",
    displayTitle: "Orange",
    subtitle: "Set 13 · Resort Campaign",
    story:
      "Burnt orange satin in candlelight. Warmth, movement, and the dying embers of a golden afternoon — fabric that catches fire without burning.",
    storyLines: [
      "Burnt satin in candlelight.",
      "Warmth that moves with the body.",
      "The embers of a golden afternoon.",
    ],
    heroVideo: "/assets/videos/products/set-13/OrangeSolo1.mp4",
    heroPoster: "/assets/images/products/set-13/HSP_2932.jpg",
    backgroundColor: "#120c08",
    accentColor: "#c47a3a",
    textColor: "#f5ece4",
    mutedColor: "rgba(245,236,228,0.55)",
    group: "orange",
    setIds: [13],
    editorialVideos: [
      { src: "/assets/videos/products/set-13/OrangeSolo1.mp4", title: "Orange Solo" },
    ],
  },
  {
    id: "yellow",
    title: "Yellow",
    displayTitle: "Yellow",
    subtitle: "Set 11 · Spring Campaign",
    story:
      "Sunlight made garment. Bold, architectural, unapologetically bright — the moment the room holds its breath before the curtain rises.",
    storyLines: [
      "Sunlight made garment.",
      "Architectural. Unapologetic. Bright.",
      "The moment the room holds its breath.",
    ],
    heroVideo: "/assets/videos/products/set-11/YellowSolo1.mp4",
    heroPoster: "/assets/images/products/set-11/HSP_5916.jpg",
    backgroundColor: "#12100a",
    accentColor: "#e8c547",
    textColor: "#f5f0e8",
    mutedColor: "rgba(245,240,232,0.55)",
    group: "yellow",
    setIds: [11],
    editorialVideos: [
      { src: "/assets/videos/products/set-11/YellowSolo1.mp4", title: "Yellow Solo" },
    ],
  },
  {
    id: "red",
    title: "Red",
    displayTitle: "Red",
    subtitle: "Set 12 · Autumn Campaign",
    story:
      "Crimson as declaration. Deep, saturated, cinematic — the colour of the curtain rising, of arrival, of the room remembering your name.",
    storyLines: [
      "Crimson as declaration.",
      "Deep. Saturated. Cinematic.",
      "The colour of the curtain rising.",
    ],
    heroVideo: "/assets/videos/RedDressSolo.mp4",
    heroPoster: "/assets/images/products/set-12/HSP_5750.jpg",
    backgroundColor: "#0f0608",
    accentColor: "#8b1a2b",
    textColor: "#f5ecee",
    mutedColor: "rgba(245,236,238,0.55)",
    group: "red",
    setIds: [12],
    editorialVideos: [
      { src: "/assets/videos/RedDressSolo.mp4", title: "Crimson Solo" },
    ],
  },
];

export function buildCategoryGallery(category: CollectionCategory): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];

  for (const setId of category.setIds) {
    const set = getSet(setId);
    if (!set) continue;

    const productName = EDITORIAL_NAMES[setId] ?? `Set ${setId}`;

    for (const photo of set.photos) {
      items.push({
        image: setPhotoPath(set, photo),
        title: productName,
        type: "foto",
        href: `/products/${set.slug}`,
      });
    }

    if (set.video) {
      const videoSrc = setVideoPath(set);
      if (videoSrc) {
        items.push({
          image: setPhotoPath(set, set.photos[0]),
          videoFile: videoSrc,
          title: `${productName} — Film`,
          type: "video",
        });
      }
    }

    if (set.videoAlt) {
      const altSrc = setVideoPath(set, set.videoAlt);
      if (altSrc) {
        items.push({
          image: setPhotoPath(set, set.photos[0]),
          videoFile: altSrc,
          title: `${productName} — Alt Film`,
          type: "video",
        });
      }
    }
  }

  for (const video of category.editorialVideos) {
    const exists = items.some((item) => item.videoFile === video.src);
    if (!exists) {
      items.push({
        image: video.poster,
        videoFile: video.src,
        title: video.title,
        type: "video",
      });
    }
  }

  if (category.editorialPhotos) {
    category.editorialPhotos.forEach((src, index) => {
      items.push({
        image: src,
        title: `Editorial ${index + 1}`,
        type: "foto",
      });
    });
  }

  return items;
}
