"use client";

import { useEffect, type RefObject } from "react";

/**
 * Scroll progress for a tall pinned section:
 * 0 when the section top meets the viewport top,
 * 1 when the section bottom meets the viewport bottom.
 * Matches `animation-range: entry 100% exit 0%` (never `contain`).
 */
export function pinnedProgress(el: HTMLElement, viewportHeight = window.innerHeight) {
  const range = el.offsetHeight - viewportHeight;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range));
}

export function useAboutPinProgress(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pins = Array.from(root.querySelectorAll<HTMLElement>("[data-about-pin]"));

    const update = () => {
      const vh = window.innerHeight;
      for (const el of pins) {
        el.style.setProperty("--p", pinnedProgress(el, vh).toFixed(5));
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [rootRef]);
}
