export type SetGroup =
  | "garden-green"
  | "peach"
  | "pink"
  | "black-combo"
  | "yellow"
  | "red"
  | "orange";

export type SetManifest = {
  id: number;
  slug: string;
  group: SetGroup;
  collection: string;
  photos: string[];
  video?: string;
  videoAlt?: string;
  videoObjectPosition?: string;
};

/** Colour / theme groupings — set number = same product across photos + videos folders */
export const setGroups: Record<SetGroup, { label: string; sets: number[]; collection: string }> = {
  "garden-green": {
    label: "Garden Green",
    sets: [1, 2, 3, 4],
    collection: "garden",
  },
  peach: {
    label: "Peach",
    sets: [5],
    collection: "peach",
  },
  pink: {
    label: "Pink",
    sets: [15, 16, 17, 18],
    collection: "pink",
  },
  "black-combo": {
    label: "Black Combo",
    sets: [6, 7, 8, 9, 10, 14],
    collection: "noir",
  },
  yellow: {
    label: "Yellow",
    sets: [11],
    collection: "yellow",
  },
  red: {
    label: "Red",
    sets: [12],
    collection: "red",
  },
  orange: {
    label: "Orange",
    sets: [13],
    collection: "orange",
  },
};

export const sets: SetManifest[] = [
  {
    id: 1,
    slug: "set-1",
    group: "garden-green",
    collection: "garden",
    photos: ["HSP_4327.jpg", "HSP_4510.jpg", "HSP_4554.jpg", "HSP_4590.jpg", "HSP_4607.jpg"],
    video: "GardenSolo3.mp4",
  },
  {
    id: 2,
    slug: "set-2",
    group: "garden-green",
    collection: "garden",
    photos: ["HSP_4791.jpg", "HSP_4797.jpg", "HSP_4810.jpg", "HSP_4819.jpg", "HSP_4828.jpg"],
    video: "GardenSolo2.mp4",
  },
  {
    id: 3,
    slug: "set-3",
    group: "garden-green",
    collection: "garden",
    photos: ["HSP_3857.jpg", "HSP_3929.jpg", "HSP_3960.jpg", "HSP_3971.jpg", "HSP_3984.jpg"],
    video: "GardenSolo1.mp4",
  },
  {
    id: 4,
    slug: "set-4",
    group: "garden-green",
    collection: "garden",
    photos: ["HSP_4843.jpg", "HSP_4864.jpg", "HSP_4903.jpg", "HSP_4908.jpg"],
  },
  {
    id: 5,
    slug: "set-5",
    group: "peach",
    collection: "peach",
    photos: ["HSP_4393.jpg", "HSP_4452.jpg", "HSP_4492.jpg", "HSP_4495.jpg", "VAM_6670.jpg"],
    video: "PeachSolo1.mp4",
    videoAlt: "PeachSolo1Opt2.mp4",
  },
  {
    id: 6,
    slug: "set-6",
    group: "black-combo",
    collection: "noir",
    photos: ["HSP_2741.jpg", "HSP_2751.jpg", "HSP_2866.jpg", "HSP_2887.jpg", "HSP_2889.jpg"],
    video: "OrangeSolo2.mp4", // filename is misleading — belongs to black-combo set 6
  },
  {
    id: 7,
    slug: "set-7",
    group: "black-combo",
    collection: "noir",
    photos: ["HSP_2254.jpg", "HSP_2283.jpg", "HSP_2294.jpg", "HSP_2372.jpg"],
  },
  {
    id: 8,
    slug: "set-8",
    group: "black-combo",
    collection: "noir",
    photos: ["HSP_2981.jpg", "HSP_3006.jpg", "HSP_3013.jpg", "HSP_3056.jpg", "HSP_3076.jpg"],
    video: "White&Black1.mp4",
  },
  {
    id: 9,
    slug: "set-9",
    group: "black-combo",
    collection: "noir",
    photos: ["HSP_3158.jpg", "HSP_3194.jpg", "HSP_3218.jpg", "HSP_3255.jpg"],
    video: "White&Black2.mp4",
  },
  {
    id: 10,
    slug: "set-10",
    group: "black-combo",
    collection: "noir",
    photos: ["BHA_5556.jpg", "HSP_2172.jpg", "HSP_2216.jpg", "HSP_2231.jpg"],
  },
  {
    id: 11,
    slug: "set-11",
    group: "yellow",
    collection: "yellow",
    photos: ["HSP_5848.jpg", "HSP_5858.jpg", "HSP_5875.jpg", "HSP_5883.jpg", "HSP_5916.jpg"],
    video: "YellowSolo1.mp4",
  },
  {
    id: 12,
    slug: "set-12",
    group: "red",
    collection: "red",
    photos: ["HSP_5547.jpg", "HSP_5549.jpg", "HSP_5571.jpg", "HSP_5635.jpg", "HSP_5750.jpg"],
  },
  {
    id: 13,
    slug: "set-13",
    group: "orange",
    collection: "orange",
    photos: ["BHA_2011.jpg", "BHA_2027.jpg", "HSP_2603.jpg", "HSP_2612.jpg", "HSP_2932.jpg"],
    video: "OrangeSolo1.mp4",
  },
  {
    id: 14,
    slug: "set-14",
    group: "black-combo",
    collection: "noir",
    photos: ["BHA_1933.jpg", "BHA_1983.jpg", "BHA_2106.jpg", "HSP_2470.jpg", "HSP_2498.jpg", "HSP_2528.jpg"],
  },
  {
    id: 15,
    slug: "set-15",
    group: "pink",
    collection: "pink",
    photos: ["HSP_4946.jpg", "HSP_5015.jpg", "HSP_5054.jpg", "HSP_5068.jpg", "VAM_6961.jpg"],
    video: "PinkSolo1.mp4",
  },
  {
    id: 16,
    slug: "set-16",
    group: "pink",
    collection: "pink",
    photos: ["HSP_5981.JPG", "HSP_5988.JPG", "HSP_6019.JPG"],
    video: "PinkCoord1.mp4",
    videoObjectPosition: "center 22%",
  },
  {
    id: 17,
    slug: "set-17",
    group: "pink",
    collection: "pink",
    photos: ["HSP_5291.jpg", "HSP_5292.jpg", "HSP_5309.jpg", "HSP_5368.jpg", "HSP_5395.jpg", "HSP_5404.jpg"],
    video: "PinkSOlo3.mp4",
  },
  {
    id: 18,
    slug: "set-18",
    group: "pink",
    collection: "pink",
    photos: ["HSP_5080.jpg", "HSP_5151.jpg", "HSP_5165.jpg", "HSP_5186.jpg"],
    video: "PinkSolo2.mp4",
  },
];

export function getSet(idOrSlug: number | string) {
  if (typeof idOrSlug === "number") return sets.find((s) => s.id === idOrSlug);
  return sets.find((s) => s.slug === idOrSlug);
}

export function getSetsByGroup(group: SetGroup) {
  return sets.filter((s) => s.group === group);
}

export function getSetsByCollection(collection: string) {
  return sets.filter((s) => s.collection === collection);
}

export function setPhotoPath(set: SetManifest, filename: string) {
  return `/assets/images/products/${set.slug}/${filename}`;
}

export function setVideoPath(set: SetManifest, filename?: string) {
  const file = filename ?? set.video;
  if (!file) return undefined;
  return `/assets/videos/products/${set.slug}/${file}`;
}

/** Lightweight H.264 loops for ambient kinetic backgrounds (web-optimized). */
export function setAmbientVideoPath(set: SetManifest, filename?: string) {
  const file = filename ?? set.video;
  if (!file) return undefined;
  return `/assets/videos/products/ambient/${set.slug}/${file}`;
}

export function setHeroPhoto(set: SetManifest) {
  return setPhotoPath(set, set.photos[0]);
}

export function setGalleryPhotos(set: SetManifest) {
  return set.photos.slice(1).map((p) => setPhotoPath(set, p));
}
