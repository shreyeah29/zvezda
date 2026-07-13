"use client";

import { useMemo, useRef } from "react";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import { ProductSlideshow } from "./ProductSlideshow";
import { useShowcaseEntrance } from "./useShowcaseEntrance";

export function HomeProductSlideshow() {
  const isMobile = useMaxWidth(768);
  const products = useMemo(() => getHomeProductSlideshowItems(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const { entranceStarted, lettersStarted, dressesStarted, entranceComplete } =
    useShowcaseEntrance(sectionRef);

  if (isMobile) return null;

  return (
    <section
      ref={sectionRef}
      className="home-product-slideshow"
      aria-label="ZVEZDA showcase"
    >
      <ProductSlideshow
        products={products}
        entranceStarted={entranceStarted}
        lettersStarted={lettersStarted}
        dressesStarted={dressesStarted}
        entranceComplete={entranceComplete}
      />
    </section>
  );
}
