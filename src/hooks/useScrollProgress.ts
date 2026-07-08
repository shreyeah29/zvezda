"use client";

import { useEffect, useState, type RefObject } from "react";

type UseScrollProgressOptions = {
  itemCount: number;
  containerRef: RefObject<HTMLElement | null>;
  stickyRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/** Native sticky-section progress mapped to a floating active index. */
export function useScrollProgress({
  itemCount,
  containerRef,
  enabled = true,
}: UseScrollProgressOptions) {
  const [exactIndex, setExactIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!enabled || itemCount <= 1 || !container) {
      setExactIndex(0);
      return;
    }

    let mounted = true;
    let frameId = 0;

    const update = () => {
      if (!mounted) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = Math.max(container.offsetHeight - window.innerHeight, 1);
      const rawProgress = -rect.top / scrollableDistance;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      setExactIndex(progress * (itemCount - 1));
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    return () => {
      mounted = false;
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [containerRef, enabled, itemCount]);

  return exactIndex;
}
