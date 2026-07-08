"use client";

import { useEffect, useState, type RefObject } from "react";

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

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${(itemCount - 1) * window.innerHeight}`,
          pin: sticky,
          pinSpacing: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setExactIndex(self.progress * (itemCount - 1));
          },
        });
      }, container);

      ScrollTrigger.refresh();
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [containerRef, stickyRef, enabled, itemCount]);

  return exactIndex;
}
