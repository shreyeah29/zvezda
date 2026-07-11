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

  const index = Math.min(Math.max(videoIndex, 0), imageItems.length);
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
    season: "Garden Green",
    detail: "Sets 1–4 · Garden Campaign",
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
      1,
    ),
  },
  {
    id: "noir-ivoire",
    name: "Noir & Ivoire",
    season: "Monochrome",
    detail: "Sets 8–9 · Black & White",
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
      3,
    ),
  },
  {
    id: "amber-solstice",
    name: "Amber Solstice",
    season: "Orange",
    detail: "Sets 6 & 13 · Warm Light",
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
      0,
    ),
  },
  {
    id: "crimson-reverie",
    name: "Crimson Reverie",
    season: "Red",
    detail: "Set 12 · Evening Light",
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
      4,
    ),
  },
  {
    id: "golden-lumiere",
    name: "Golden Lumière",
    season: "Yellow",
    detail: "Set 11 · Solar Campaign",
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
      2,
    ),
  },
  {
    id: "velvet-blush",
    name: "Velvet Blush",
    season: "Nocturne",
    detail: "Sets 7 & 10 · Black & Pink",
    group: "black-combo",
    setIds: [7, 10],
    media: buildCollectionRow(
      {
        src: "/assets/videos/film/White&BlackTrio.mp4",
        poster: setPhotoPath(getSet(7)!, "HSP_2254.jpg"),
        href: "/products/set-7",
        alt: "Velvet Blush film",
      },
      [
        photo(7, "HSP_2254.jpg"),
        photo(10, "BHA_5556.jpg"),
        photo(7, "HSP_2294.jpg"),
        photo(10, "HSP_2216.jpg"),
        photo(7, "HSP_2372.jpg"),
      ],
      5,
    ),
  },
];
