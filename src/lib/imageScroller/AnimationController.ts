import type { ScrollerVisualState } from "@/components/ImageScroller/types";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smooth visual state for each scroller item based on distance from active index */
export function getScrollerItemState(
  distance: number,
  reducedMotion = false
): ScrollerVisualState {
  const clamped = Math.min(Math.max(distance, 0), 1);

  if (reducedMotion) {
    const active = distance < 0.45;
    return {
      scale: active ? 1 : 0.92,
      opacity: active ? 1 : 0.4,
      blur: active ? 0 : 4,
      brightness: active ? 1 : 0.8,
      translateY: 0,
      zIndex: active ? 10 : 1,
      isActive: active,
    };
  }

  return {
    scale: lerp(1, 0.92, clamped),
    opacity: lerp(1, 0.4, clamped),
    blur: lerp(0, 4, clamped),
    brightness: lerp(1, 0.8, clamped),
    translateY: lerp(0, 28, clamped) * Math.sign(distance || 1),
    zIndex: Math.round(lerp(10, 1, clamped)),
    isActive: distance < 0.35,
  };
}

/** Vertical stack offset — creates the Framer-style column drift */
export function getStackOffset(index: number, exactIndex: number) {
  return (index - exactIndex) * 72;
}
