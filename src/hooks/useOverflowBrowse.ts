"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getDepthStyle } from "@/lib/motion/MotionUtilities";

const OVERFLOW_CARD_W = 240;
const OVERFLOW_SPACING = 258;

function overflowNearestIndex(offset: number, center: number, count: number) {
  const raw = (center - offset - OVERFLOW_CARD_W / 2) / OVERFLOW_SPACING;
  return Math.max(0, Math.min(count - 1, Math.round(raw)));
}

function applyOverflowTransform(
  el: HTMLElement,
  x: number,
  depth: ReturnType<typeof getDepthStyle>
) {
  el.style.zIndex = String(depth.zIndex);
  el.style.opacity = String(depth.opacity);
  el.style.transform = `translate3d(${x}px, 0, 0) scale(${depth.scale}) rotate(${depth.rotate}deg)`;
  const img = el.querySelector<HTMLElement>("[data-overflow-image]");
  if (img) img.style.filter = depth.blur > 0 ? `blur(${depth.blur}px)` : "none";
}

type UseOverflowBrowseOptions = {
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  productCount: number;
  visible: boolean;
};

/** Horizontal glide for products beyond the first five */
export function useOverflowBrowse({
  cardRefs,
  stageRef,
  productCount,
  visible,
}: UseOverflowBrowseOptions) {
  const worldOffset = useRef(0);
  const stageCenterX = useRef(0);
  const animTween = useRef<gsap.core.Tween | null>(null);

  const updateStage = useCallback(() => {
    const center = stageCenterX.current;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const x = i * OVERFLOW_SPACING + worldOffset.current;
      const cardCenter = x + OVERFLOW_CARD_W / 2;
      applyOverflowTransform(el, x, getDepthStyle(cardCenter - center));
    });
  }, [cardRefs]);

  const glideToIndex = useCallback(
    (localIndex: number) => {
      if (!visible) return;
      animTween.current?.kill();
      const target = stageCenterX.current - localIndex * OVERFLOW_SPACING - OVERFLOW_CARD_W / 2;
      animTween.current = gsap.to(
        { value: worldOffset.current },
        {
          value: target,
          duration: 1.1,
          ease: "power4.out",
          onUpdate: function () {
            worldOffset.current = this.targets()[0].value;
            updateStage();
          },
        }
      );
    },
    [updateStage, visible]
  );

  const nudge = useCallback(
    (direction: -1 | 1) => {
      const idx = overflowNearestIndex(worldOffset.current, stageCenterX.current, productCount);
      const next = Math.max(0, Math.min(productCount - 1, idx + direction));
      if (next !== idx) glideToIndex(next);
      return next;
    },
    [glideToIndex, productCount]
  );

  useEffect(() => {
    if (!visible || !stageRef.current) return;
    const measure = () => {
      if (!stageRef.current) return;
      stageCenterX.current = stageRef.current.getBoundingClientRect().width / 2;
      worldOffset.current = stageCenterX.current - OVERFLOW_CARD_W / 2;
      updateStage();
      cardRefs.current.forEach((el) => {
        if (el) gsap.to(el, { opacity: 1, duration: 0.5 });
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visible, stageRef, updateStage, cardRefs]);

  return { glideToIndex, nudge };
}
