export type FilmAsset = {
  slug: string;
  type: "image" | "video";
  src: string;
  group: string;
  /** Sets featured — inferred from group name when not specified per-file */
  setsFeatured: number[];
  caption?: string;
};

const gardenSets = [1, 2, 3, 4];
const blackSets = [6, 7, 8, 9, 10];

export const filmAssets: FilmAsset[] = [
  {
    slug: "garden-duo-1",
    type: "video",
    src: "/assets/videos/film/GardenDuo1.mp4",
    group: "garden-green",
    setsFeatured: gardenSets,
    caption: "Garden — a dialogue in green",
  },
  {
    slug: "garden-trio",
    type: "video",
    src: "/assets/videos/film/GardenTrio.mp4",
    group: "garden-green",
    setsFeatured: gardenSets,
    caption: "Garden — three silhouettes",
  },
  {
    slug: "garden-trio-single",
    type: "video",
    src: "/assets/videos/film/GardenTrioSingleShot.mp4",
    group: "garden-green",
    setsFeatured: gardenSets,
    caption: "Garden — single frame",
  },
  {
    slug: "white-black-trio",
    type: "video",
    src: "/assets/videos/film/White&BlackTrio.mp4",
    group: "black-combo",
    setsFeatured: blackSets,
    caption: "Noir — black and white in motion",
  },
  // Editorial stills — grouped by shoot; refine per-image mapping later if needed
  ...[
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
  ].map((file, i) => ({
    slug: `film-still-${i + 1}`,
    type: "image" as const,
    src: `/assets/images/film/${file}`,
    group: "editorial",
    setsFeatured: [] as number[],
    caption: "Editorial",
  })),
];
