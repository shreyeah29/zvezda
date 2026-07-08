import { gsap } from "gsap";
import { offsetForIndex } from "./MotionUtilities";

type AnimateToIndexOptions = {
  index: number;
  stageCenterX: number;
  currentOffset: number;
  onUpdate: (offset: number) => void;
  onComplete?: () => void;
  duration?: number;
};

/** Glide stage until product index reaches center */
export function animateStageToIndex({
  index,
  stageCenterX,
  currentOffset,
  onUpdate,
  onComplete,
  duration = 1.15,
}: AnimateToIndexOptions) {
  const target = offsetForIndex(index, stageCenterX);

  return gsap.to(
    { value: currentOffset },
    {
      value: target,
      duration,
      ease: "power4.out",
      onUpdate: function () {
        onUpdate(this.targets()[0].value);
      },
      onComplete,
    }
  );
}

type Depth = {
  scale: number;
  opacity: number;
  blur: number;
  rotate: number;
  zIndex: number;
};

/**
 * Apply GPU transforms to card wrapper.
 * Blur is applied to the inner image only so the card border stays crisp.
 */
export function applyCardTransform(el: HTMLElement, x: number, depth: Depth) {
  el.style.zIndex = String(depth.zIndex);
  el.style.opacity = String(depth.opacity);
  el.style.transform = `translate3d(${x}px, 0, 0) scale(${depth.scale}) rotate(${depth.rotate}deg)`;

  const img = el.querySelector<HTMLElement>("[data-card-image]");
  if (img) {
    img.style.filter = depth.blur > 0 ? `blur(${depth.blur}px)` : "none";
  }
}
