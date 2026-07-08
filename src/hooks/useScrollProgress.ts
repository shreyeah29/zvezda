"use client";

import { useEffect, useState, type RefObject } from "react";

const SCROLLER_TRIGGER_ID = "video-scroller-pin";

type UseScrollProgressOptions = {
  itemCount: number;
  containerRef: RefObject<HTMLElement | null>;
  stickyRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/** GSAP ScrollTrigger progress mapped to a floating active index */
export function useScrollProgress({
  itemCount,
  containerRef,
  stickyRef,
  enabled = true,
}: UseScrollProgressOptions) {
  const [exactIndex, setExactIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;

    if (!enabled || itemCount <= 1 || !container || !sticky) {
      setExactIndex(0);
      return;
    }

    let mounted = true;
    let ctx: { revert: () => void } | undefined;
    let frameId = 0;
    let pendingIndex = 0;

    const flushIndex = () => {
      frameId = 0;
      if (!mounted) return;
      setExactIndex(pendingIndex);
    };

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          id: SCROLLER_TRIGGER_ID,
          trigger: container,
          start: "top top",
          end: () => `+=${(itemCount - 1) * window.innerHeight}`,
          pin: sticky,
          pinSpacing: false,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            pendingIndex = self.progress * (itemCount - 1);
            if (!frameId) {
              frameId = requestAnimationFrame(flushIndex);
            }
          },
        });
      }, container);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();

    return () => {
      mounted = false;
      if (frameId) cancelAnimationFrame(frameId);
      ctx?.revert();
    };
  }, [containerRef, stickyRef, enabled, itemCount]);

  return exactIndex;
}

export { SCROLLER_TRIGGER_ID };
