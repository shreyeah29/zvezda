"use client";

import { useMemo, useRef } from "react";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import { ProductSlideshow } from "./ProductSlideshow";
import { useShowcaseScrollReveal } from "./useShowcaseScrollReveal";

export function HomeProductSlideshow() {
  const products = useMemo(() => getHomeProductSlideshowItems(), []);
  const wrapRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const wordRowRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { revealComplete } = useShowcaseScrollReveal({
    wrapRef,
    pinRef,
    washRef,
    wordRowRef,
    rootRef,
  });

  return (
    <section ref={wrapRef} className="home-product-slideshow-wrap">
      <div ref={pinRef} className="home-product-slideshow">
        <div ref={washRef} className="home-product-slideshow__wash" aria-hidden="true" />
        <ProductSlideshow
          products={products}
          revealComplete={revealComplete}
          wordRowRef={wordRowRef}
          rootRef={rootRef}
        />
      </div>
    </section>
  );
}
