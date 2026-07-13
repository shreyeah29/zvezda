"use client";

import { useMemo } from "react";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import { ProductSlideshow } from "./ProductSlideshow";

export function HomeProductSlideshow() {
  const products = useMemo(() => getHomeProductSlideshowItems(), []);

  return (
    <section className="home-product-slideshow" aria-label="Product slideshow">
      <ProductSlideshow products={products} />
    </section>
  );
}
