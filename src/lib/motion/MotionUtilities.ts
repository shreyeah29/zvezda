/** Spacing between product card centers in the horizontal stage */
export const PRODUCT_SPACING = 300;

/** Thumbnail strip spacing */
export const THUMB_SPACING = 80;

/** Premium product card dimensions */
export const CARD_WIDTH = 260;
export const CARD_HEIGHT = 420;

/** Card frame styling — border always visible */
export const CARD_RADIUS = 24;

/** Momentum physics — heavy, luxurious glide */
export const FRICTION = 0.91;
export const MIN_VELOCITY = 0.4;

/** Custom cubic bezier — luxury ease */
export const EASE_LUXURY = "cubic-bezier(0.16, 1, 0.3, 1)";

export type DepthStyle = {
  scale: number;
  opacity: number;
  blur: number;
  rotate: number;
  zIndex: number;
};

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Visual depth from pixel distance to stage center.
 * Blur applies to image only — card border stays sharp.
 */
export function getDepthStyle(distancePx: number): DepthStyle {
  const sign = distancePx === 0 ? 1 : Math.sign(distancePx);
  const units = Math.abs(distancePx) / PRODUCT_SPACING;

  const tiers = [
    { u: 0, scale: 1, opacity: 1, blur: 0, rotate: 0 },
    { u: 1, scale: 0.92, opacity: 0.85, blur: 2, rotate: 4 },
    { u: 2, scale: 0.82, opacity: 0.65, blur: 5, rotate: 7 },
    { u: 3, scale: 0.72, opacity: 0.35, blur: 8, rotate: 10 },
  ];

  const clamped = Math.min(units, 3);
  const lower = Math.floor(clamped);
  const upper = Math.min(lower + 1, 3);
  const t = smoothstep(clamped - lower);

  const a = tiers[lower];
  const b = tiers[upper];

  return {
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
    blur: lerp(a.blur, b.blur, t),
    rotate: sign * lerp(a.rotate, b.rotate, t),
    zIndex: Math.round(100 - clamped * 10),
  };
}

export function offsetForIndex(index: number, stageCenterX: number): number {
  return stageCenterX - index * PRODUCT_SPACING - CARD_WIDTH / 2;
}

export function nearestIndex(worldOffset: number, stageCenterX: number, count: number): number {
  const raw = (stageCenterX - worldOffset - CARD_WIDTH / 2) / PRODUCT_SPACING;
  return Math.max(0, Math.min(count - 1, Math.round(raw)));
}

export function thumbOffsetForStage(
  worldOffset: number,
  stageCenterX: number,
  stripCenterX: number,
  thumbCount: number
): number {
  const activeIndex = nearestIndex(worldOffset, stageCenterX, thumbCount);
  return stripCenterX - activeIndex * THUMB_SPACING - THUMB_SPACING / 2;
}
