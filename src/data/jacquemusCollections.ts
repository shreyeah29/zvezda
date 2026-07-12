import { getSet, setPhotoPath, setVideoPath, type SetGroup } from "./sets";

export type JacquemusCollectionMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  href?: string;
  poster?: string;
};

export type JacquemusCollection = {
  id: string;
  name: string;
  season: string;
  detail: string;
  group: SetGroup;
  setIds: number[];
  media: JacquemusCollectionMedia[];
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
  14: "Noir VI",
  15: "Rose Cascade",
  16: "Blush Coordination",
  17: "Petal Garden",
  18: "Rose Mirage",
};

type RowPhoto = { setId: number; photo: string };
type RowVideo = { src: string; poster?: string; href: string; alt: string };

function buildCollectionRow(
  video: RowVideo,
  photos: RowPhoto[],
  videoIndex: number,
): JacquemusCollectionMedia[] {
  const videoItem: JacquemusCollectionMedia = {
    type: "video",
    src: video.src,
    poster: video.poster,
    alt: video.alt,
    href: video.href,
  };

  const imageItems: JacquemusCollectionMedia[] = photos.slice(0, 5).flatMap(({ setId, photo }) => {
    const set = getSet(setId);
    if (!set) return [];
    return [
      {
        type: "image" as const,
        src: setPhotoPath(set, photo),
        alt: EDITORIAL_NAMES[setId] ?? set.slug,
        href: `/products/${set.slug}`,
      },
    ];
  });

  const index = Math.min(Math.max(videoIndex, 0), 2);
  const row = [...imageItems];
  row.splice(index, 0, videoItem);
  return row;
}

function photo(setId: number, filename: string): RowPhoto {
  return { setId, photo: filename };
}

/** Jacquemus-style rows — 1 video + 5 photos per collection, horizontal scroll */
export const jacquemusCollections: JacquemusCollection[] = [
  {
    id: "verdant-epoque",
    name: "Verdant Époque",
    season: "Spring-Summer 2026",
    detail: "Paris, France",
    group: "garden-green",
    setIds: [1, 2, 3, 4],
    media: buildCollectionRow(
      {
        src: "/assets/videos/film/GardenTrio.mp4",
        poster: "/assets/images/film/HSP_4096.jpg",
        href: "/products/set-1",
        alt: "Verdant Époque film",
      },
      [
        photo(1, "HSP_4327.jpg"),
        photo(1, "HSP_4590.jpg"),
        photo(2, "HSP_4819.jpg"),
        photo(3, "HSP_3971.jpg"),
        photo(4, "HSP_4864.jpg"),
      ],
      0,
    ),
  },
  {
    id: "noir-ivoire",
    name: "Noir & Ivoire",
    season: "Fall-Winter 2025",
    detail: "Paris, France",
    group: "black-combo",
    setIds: [8, 9],
    media: buildCollectionRow(
      {
        src: setVideoPath(getSet(8)!, "White&Black1.mp4")!,
        poster: setPhotoPath(getSet(8)!, "HSP_2981.jpg"),
        href: "/products/set-8",
        alt: "Noir & Ivoire film",
      },
      [
        photo(8, "HSP_2981.jpg"),
        photo(8, "HSP_3056.jpg"),
        photo(9, "HSP_3158.jpg"),
        photo(9, "HSP_3218.jpg"),
        photo(8, "HSP_3013.jpg"),
      ],
      1,
    ),
  },
  {
    id: "amber-solstice",
    name: "Amber Solstice",
    season: "Spring-Summer 2025",
    detail: "Provence, France",
    group: "orange",
    setIds: [6, 13],
    media: buildCollectionRow(
      {
        src: setVideoPath(getSet(13)!, "OrangeSolo1.mp4")!,
        poster: setPhotoPath(getSet(13)!, "BHA_2011.jpg"),
        href: "/products/set-13",
        alt: "Amber Solstice film",
      },
      [
        photo(13, "BHA_2011.jpg"),
        photo(13, "HSP_2932.jpg"),
        photo(6, "HSP_2866.jpg"),
        photo(6, "HSP_2887.jpg"),
        photo(13, "HSP_2612.jpg"),
      ],
      2,
    ),
  },
  {
    id: "crimson-reverie",
    name: "Crimson Reverie",
    season: "Fall-Winter 2025",
    detail: "Paris, France",
    group: "red",
    setIds: [12],
    media: buildCollectionRow(
      {
        src: "/assets/videos/RedDressSolo.mp4",
        poster: setPhotoPath(getSet(12)!, "HSP_5750.jpg"),
        href: "/products/set-12",
        alt: "Crimson Reverie film",
      },
      [
        photo(12, "HSP_5750.jpg"),
        photo(12, "HSP_5571.jpg"),
        photo(12, "HSP_5547.jpg"),
        photo(12, "HSP_5635.jpg"),
        photo(12, "HSP_5549.jpg"),
      ],
      0,
    ),
  },
  {
    id: "golden-lumiere",
    name: "Golden Lumière",
    season: "Spring-Summer 2026",
    detail: "Riviera, France",
    group: "yellow",
    setIds: [11],
    media: buildCollectionRow(
      {
        src: setVideoPath(getSet(11)!, "YellowSolo1.mp4")!,
        poster: setPhotoPath(getSet(11)!, "HSP_5875.jpg"),
        href: "/products/set-11",
        alt: "Golden Lumière film",
      },
      [
        photo(11, "HSP_5875.jpg"),
        photo(11, "HSP_5848.jpg"),
        photo(11, "HSP_5916.jpg"),
        photo(11, "HSP_5883.jpg"),
        photo(11, "HSP_5858.jpg"),
      ],
      1,
    ),
  },
  {
    id: "velvet-blush",
    name: "Velvet Blush",
    season: "Fall-Winter 2026",
    detail: "Paris, France",
    group: "black-combo",
    setIds: [7, 10, 14],
    media: buildCollectionRow(
      {
        src: "/assets/videos/film/White&BlackTrio.mp4",
        poster: setPhotoPath(getSet(7)!, "HSP_2254.jpg"),
        href: "/products/set-7",
        alt: "Velvet Blush film",
      },
      [
        photo(7, "HSP_2254.jpg"),
        photo(14, "HSP_2470.jpg"),
        photo(10, "BHA_5556.jpg"),
        photo(14, "BHA_2106.jpg"),
        photo(7, "HSP_2372.jpg"),
      ],
      2,
    ),
  },
  {
    id: "rose-epoque",
    name: "Rose Époque",
    season: "Spring-Summer 2026",
    detail: "Paris, France",
    group: "pink",
    setIds: [15, 16, 17, 18],
    media: buildCollectionRow(
      {
        src: setVideoPath(getSet(15)!, "PinkSolo1.mp4")!,
        poster: setPhotoPath(getSet(15)!, "HSP_4946.jpg"),
        href: "/products/set-15",
        alt: "Rose Époque film",
      },
      [
        photo(15, "HSP_4946.jpg"),
        photo(16, "HSP_5981.JPG"),
        photo(17, "HSP_5291.jpg"),
        photo(18, "HSP_5080.jpg"),
        photo(15, "VAM_6961.jpg"),
      ],
      1,
    ),
  },
];
