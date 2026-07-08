/** Final settled positions for the five hero cards */
export type CardLayout = {
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  zIndex: number;
};

export const CARD_LAYOUTS: CardLayout[] = [
  { translateX: 0, translateY: 0, rotate: 0, scale: 1, zIndex: 5 },
  { translateX: -320, translateY: -40, rotate: -8, scale: 0.88, zIndex: 3 },
  { translateX: -520, translateY: 60, rotate: -14, scale: 0.78, zIndex: 2 },
  { translateX: 320, translateY: -30, rotate: 10, scale: 0.86, zIndex: 4 },
  { translateX: 540, translateY: 50, rotate: 16, scale: 0.76, zIndex: 1 },
];

export const CARD_ENTRY: Pick<CardLayout, "translateX" | "translateY" | "rotate" | "scale">[] = [
  { translateX: 0, translateY: 0, rotate: 0, scale: 1 },
  { translateX: -900, translateY: 80, rotate: -22, scale: 0.7 },
  { translateX: -1100, translateY: 120, rotate: -30, scale: 0.65 },
  { translateX: 900, translateY: 60, rotate: 22, scale: 0.68 },
  { translateX: 1100, translateY: 100, rotate: 28, scale: 0.62 },
];

export function getResponsiveLayouts() {
  if (typeof window === "undefined") return CARD_LAYOUTS;
  const w = window.innerWidth;
  const scale = w < 640 ? 0.45 : w < 1024 ? 0.7 : 1;
  return CARD_LAYOUTS.map((l) => ({
    ...l,
    translateX: l.translateX * scale,
    translateY: l.translateY * scale,
  }));
}

export function getResponsiveEntry() {
  if (typeof window === "undefined") return CARD_ENTRY;
  const w = window.innerWidth;
  const scale = w < 640 ? 0.55 : w < 1024 ? 0.75 : 1;
  return CARD_ENTRY.map((e) => ({
    ...e,
    translateX: e.translateX * scale,
    translateY: e.translateY * scale,
  }));
}
