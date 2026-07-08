import type { ScrollerVisualState } from "@/components/ImageScroller/types";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Smooth visual state for each scroller item based on distance from active index */
export function getScrollerItemState(
  distance: number,
  reducedMotion = false
): ScrollerVisualState {
  const clamped = easeOutCubic(Math.min(Math.max(distance, 0), 1));

  if (reducedMotion) {
    const active = distance < 0.45;
    return {
      scale: active ? 1 : 0.94,
      opacity: active ? 1 : 0,
      blur: active ? 0 : 2,
      brightness: active ? 1 : 0.85,
      translateY: 0,
      zIndex: active ? 10 : 1,
      isActive: active,
    };
  }

  return {
    scale: lerp(1, 0.96, clamped),
    opacity: lerp(1, 0, clamped),
    blur: lerp(0, 3, clamped),
    brightness: lerp(1, 0.88, clamped),
    translateY: lerp(0, 16, clamped) * (distance > 0 ? 1 : -1),
    zIndex: Math.round(lerp(20, 1, clamped)),
    isActive: distance < 0.42,
  };
}

/** Vertical stack offset — creates the Framer-style column drift */
export function getStackOffset(index: number, exactIndex: number) {
  return (index - exactIndex) * 72;
}
