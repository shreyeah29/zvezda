import { sets, setPhotoPath } from "./sets";
import { homeScrollGallerySlides } from "./homeScrollGallery";

export type GalleryCrop = "portrait" | "square" | "landscape";

export type ShowcaseGalleryCell = {
  id: string;
  src: string;
  crop: GalleryCrop;
};

/** Extra editorial stills deployed with the app (not in products/sets). */
const DEPLOYED_EXTRAS = [
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

/** Editorial stills that ship with production — products, duo/trio gallery, features. */
function collectDeployedEditorials(): string[] {
  const paths = new Set<string>();

  for (const set of sets) {
    for (const photo of set.photos) {
      paths.add(setPhotoPath(set, photo));
    }
  }

  for (const slide of homeScrollGallerySlides) {
    paths.add(slide.src);
  }

  for (const extra of DEPLOYED_EXTRAS) {
    paths.add(extra);
  }

  return [...paths];
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

  const shuffled = withCrops(shuffle(collectDeployedEditorials()));
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
