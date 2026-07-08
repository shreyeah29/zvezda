"use client";

import { useMemo } from "react";
import { getScrollerItemState } from "@/lib/imageScroller/AnimationController";

/** Derive integer active index and per-item visual states from scroll progress */
export function useActiveImage(exactIndex: number, itemCount: number, reducedMotion = false) {
  const activeIndex = useMemo(() => {
    if (itemCount <= 0) return 0;
    return Math.min(Math.max(Math.round(exactIndex), 0), itemCount - 1);
  }, [exactIndex, itemCount]);

  const getItemState = useMemo(
    () => (index: number) => {
      const distance = Math.abs(exactIndex - index);
      const easedDistance = Math.min(distance, 1);
      return getScrollerItemState(easedDistance, reducedMotion);
    },
    [exactIndex, reducedMotion]
  );

  return { activeIndex, exactIndex, getItemState };
}
