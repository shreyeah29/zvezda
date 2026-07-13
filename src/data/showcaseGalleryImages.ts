export type GalleryCrop = "portrait" | "square" | "landscape";

export type ShowcaseGalleryCell = {
  id: string;
  src: string;
  crop: GalleryCrop;
};

/** Verified editorial stills present in /public — mixed sets, film, duo/trio gallery. */
const VERIFIED_EDITORIALS = [
  "/assets/images/products/set-1/HSP_4510.jpg",
  "/assets/images/products/set-1/HSP_4590.jpg",
  "/assets/images/products/set-6/HSP_2889.jpg",
  "/assets/images/products/set-8/HSP_3006.jpg",
  "/assets/images/products/set-8/HSP_3013.jpg",
  "/assets/images/products/set-8/HSP_3076.jpg",
  "/assets/images/products/set-9/HSP_3158.jpg",
  "/assets/images/products/set-9/HSP_3194.jpg",
  "/assets/images/products/set-9/HSP_3218.jpg",
  "/assets/images/products/set-9/HSP_3255.jpg",
  "/assets/images/products/set-10/HSP_2216.jpg",
  "/assets/images/products/set-10/HSP_2231.jpg",
  "/assets/images/products/set-10/HSP_3554.jpg",
  "/assets/images/products/set-11/HSP_5848.jpg",
  "/assets/images/products/set-11/HSP_5916.jpg",
  "/assets/images/products/set-12/HSP_5635.jpg",
  "/assets/images/products/set-13/BHA_2011.jpg",
  "/assets/images/products/set-13/BHA_2027.jpg",
  "/assets/images/products/set-13/HSP_2603.jpg",
  "/assets/images/products/set-14/BHA_1933.jpg",
  "/assets/images/products/set-14/BHA_1983.jpg",
  "/assets/images/products/set-14/BHA_2106.jpg",
  "/assets/images/products/set-14/HSP_2470.jpg",
  "/assets/images/products/set-14/HSP_2498.jpg",
  "/assets/images/products/set-14/HSP_2528.jpg",
  "/assets/images/products/set-15/HSP_4946.jpg",
  "/assets/images/products/set-15/HSP_5015.jpg",
  "/assets/images/products/set-15/HSP_5054.jpg",
  "/assets/images/products/set-15/HSP_5068.jpg",
  "/assets/images/products/set-15/VAM_6961.jpg",
  "/assets/images/products/set-16/HSP_5981.JPG",
  "/assets/images/products/set-16/HSP_5988.JPG",
  "/assets/images/products/set-16/HSP_6019.JPG",
  "/assets/images/products/set-17/HSP_5291.jpg",
  "/assets/images/products/set-17/HSP_5292.jpg",
  "/assets/images/products/set-17/HSP_5309.jpg",
  "/assets/images/products/set-17/HSP_5368.jpg",
  "/assets/images/products/set-17/HSP_5395.jpg",
  "/assets/images/products/set-17/HSP_5404.jpg",
  "/assets/images/products/set-18/HSP_5080.jpg",
  "/assets/images/products/set-18/HSP_5151.jpg",
  "/assets/images/products/set-18/HSP_5165.jpg",
  "/assets/images/products/set-18/HSP_5186.jpg",
  "/assets/images/home-gallery/HSP_1857.jpg",
  "/assets/images/home-gallery/HSP_1864.jpg",
  "/assets/images/home-gallery/HSP_1935.jpg",
  "/assets/images/home-gallery/HSP_1988.jpg",
  "/assets/images/home-gallery/HSP_1990.jpg",
  "/assets/images/home-gallery/HSP_2011.jpg",
  "/assets/images/home-gallery/HSP_2074.jpg",
  "/assets/images/home-gallery/HSP_2085.jpg",
  "/assets/images/film/HSP_1857.jpg",
  "/assets/images/film/HSP_1864.jpg",
  "/assets/images/film/HSP_1935.jpg",
  "/assets/images/film/HSP_1988.jpg",
  "/assets/images/film/HSP_1990.jpg",
  "/assets/images/film/HSP_2011.JPG",
  "/assets/images/film/HSP_2074.JPG",
  "/assets/images/film/HSP_2085.JPG",
  "/assets/images/film/HSP_3336.jpg",
  "/assets/images/film/HSP_3670.jpg",
  "/assets/images/film/HSP_3671.jpg",
  "/assets/images/film/HSP_3677.jpg",
  "/assets/images/film/HSP_3688.jpg",
  "/assets/images/film/HSP_3698.jpg",
  "/assets/images/film/HSP_3700.jpg",
  "/assets/images/film/HSP_4145.jpg",
  "/assets/images/film/HSP_6032.JPG",
  "/assets/images/film/HSP_6089.JPG",
  "/assets/images/film/HSP_6101.JPG",
  "/assets/images/film/HSP_6126.JPG",
  "/assets/images/home-feature/HSP_6032.jpg",
  "/assets/images/home/collection-split/HSP_3336.jpg",
] as const;

const CROP_PATTERN: GalleryCrop[] = [
  "portrait",
  "portrait",
  "square",
  "portrait",
  "landscape",
  "portrait",
  "square",
  "portrait",
  "portrait",
  "landscape",
  "portrait",
  "square",
];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(array: readonly T[], seed = 20260713): T[] {
  const copy = [...array];
  const random = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function withCrops(sources: string[]): ShowcaseGalleryCell[] {
  return sources.map((src, index) => ({
    id: `gallery-${index}-${src}`,
    src,
    crop: CROP_PATTERN[index % CROP_PATTERN.length],
  }));
}

function pickStripCells(
  pool: ShowcaseGalleryCell[],
  start: number,
  count: number,
): ShowcaseGalleryCell[] {
  const cells: ShowcaseGalleryCell[] = [];
  for (let i = 0; i < count; i += 1) {
    const source = pool[(start + i) % pool.length];
    cells.push({
      ...source,
      id: `${source.id}-strip-${start + i}`,
    });
  }
  return cells;
}

export type ShowcaseGalleryStrips = {
  top: ShowcaseGalleryCell[];
  left: ShowcaseGalleryCell[];
  right: ShowcaseGalleryCell[];
  bottom: ShowcaseGalleryCell[];
};

const STRIP_COUNTS = {
  top: 28,
  left: 12,
  right: 12,
  bottom: 28,
} as const;

let cachedStrips: ShowcaseGalleryStrips | null = null;

export function getShowcaseGalleryStrips(): ShowcaseGalleryStrips {
  if (cachedStrips) return cachedStrips;

  const shuffled = withCrops(shuffle(VERIFIED_EDITORIALS));
  let offset = 0;

  const top = pickStripCells(shuffled, offset, STRIP_COUNTS.top);
  offset += STRIP_COUNTS.top;

  const left = pickStripCells(shuffled, offset, STRIP_COUNTS.left);
  offset += STRIP_COUNTS.left;

  const right = pickStripCells(shuffled, offset, STRIP_COUNTS.right);
  offset += STRIP_COUNTS.right;

  const bottom = pickStripCells(shuffled, offset, STRIP_COUNTS.bottom);

  cachedStrips = { top, left, right, bottom };
  return cachedStrips;
}
