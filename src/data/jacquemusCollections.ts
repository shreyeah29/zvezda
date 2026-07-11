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
  8: "Eclipse Royale",
  9: "Ivory Eclipse",
  7: "Noir II",
  10: "Noir V",
  12: "Crimson",
  11: "Solar",
  13: "Ember",
};

function mediaFromSets(setIds: number[]): JacquemusCollectionMedia[] {
  return setIds.flatMap((setId) => {
    const set = getSet(setId);
    if (!set) return [];
    const name = EDITORIAL_NAMES[setId] ?? set.slug;
    const href = `/products/${set.slug}`;

    const photos = set.photos.map((photo) => ({
      type: "image" as const,
      src: setPhotoPath(set, photo),
      alt: name,
      href,
    }));

    if (set.video) {
      return [
        {
          type: "video" as const,
          src: setVideoPath(set)!,
          poster: setPhotoPath(set, set.photos[0]),
          alt: `${name} film`,
          href,
        },
        ...photos.slice(0, 4),
      ];
    }

    return photos;
  });
}

/** Jacquemus-style collection chapters — curated set groupings only */
export const jacquemusCollections: JacquemusCollection[] = [
  {
    id: "verdant-epoque",
    name: "Verdant Époque",
    season: "Garden Green",
    detail: "Sets 1–4 · Garden Campaign",
    group: "garden-green",
    setIds: [1, 2, 3, 4],
    media: mediaFromSets([1, 2, 3, 4]),
  },
  {
    id: "noir-ivoire",
    name: "Noir & Ivoire",
    season: "Monochrome",
    detail: "Sets 8–9 · Black & White",
    group: "black-combo",
    setIds: [8, 9],
    media: mediaFromSets([8, 9]),
  },
  {
    id: "amber-solstice",
    name: "Amber Solstice",
    season: "Orange",
    detail: "Set 13 · Warm Light",
    group: "orange",
    setIds: [13],
    media: mediaFromSets([13]),
  },
  {
    id: "crimson-reverie",
    name: "Crimson Reverie",
    season: "Red",
    detail: "Set 12 · Evening Light",
    group: "red",
    setIds: [12],
    media: mediaFromSets([12]),
  },
  {
    id: "golden-lumiere",
    name: "Golden Lumière",
    season: "Yellow",
    detail: "Set 11 · Solar Campaign",
    group: "yellow",
    setIds: [11],
    media: mediaFromSets([11]),
  },
  {
    id: "velvet-blush",
    name: "Velvet Blush",
    season: "Nocturne",
    detail: "Sets 7 & 10 · Black & Pink",
    group: "black-combo",
    setIds: [7, 10],
    media: mediaFromSets([7, 10]),
  },
];
