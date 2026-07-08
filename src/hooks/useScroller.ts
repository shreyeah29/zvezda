"use client";

import { useMemo, useRef } from "react";
import { products } from "@/data/products";
import { productToScrollerItem, type ScrollerItem } from "@/components/ImageScroller/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useActiveImage } from "@/hooks/useActiveImage";

type UseScrollerOptions = {
  items?: ScrollerItem[];
};

/** Main scroller hook — refs, product data, scroll progress, active index */
export function useScroller(options: UseScrollerOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const items = useMemo(() => {
    if (options.items?.length) return options.items;
    return products
      .map((product, index) => productToScrollerItem(product, index))
      .filter((item): item is ScrollerItem => item !== null);
  }, [options.items]);

  const exactIndex = useScrollProgress({
    itemCount: items.length,
    containerRef,
    stickyRef,
    enabled: items.length > 1,
  });

  const { activeIndex, getItemState } = useActiveImage(
    exactIndex,
    items.length,
    reducedMotion
  );

  const scrollHeightVh = Math.max((items.length - 1) * 100 + 100, 100);
  const progress = items.length <= 1 ? 0 : exactIndex / (items.length - 1);

  return {
    containerRef,
    stickyRef,
    items,
    exactIndex,
    activeIndex,
    progress,
    scrollHeightVh,
    getItemState,
    reducedMotion,
  };
}
