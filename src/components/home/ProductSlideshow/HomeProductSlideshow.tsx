"use client";

import { useMemo, useRef } from "react";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import { ProductSlideshow } from "./ProductSlideshow";
import { useShowcaseEntrance } from "./useShowcaseEntrance";

export function HomeProductSlideshow() {
  const products = useMemo(() => getHomeProductSlideshowItems(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const { entranceStarted, lettersStarted, entranceComplete } =
    useShowcaseEntrance(sectionRef);

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
        entranceComplete={entranceComplete}
      />
    </section>
  );
}
