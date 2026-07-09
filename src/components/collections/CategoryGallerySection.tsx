"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CollectionCategory } from "@/data/collectionCategories";
import { buildCategoryGallery } from "@/data/collectionCategories";
import { AsymmetricGrid } from "@/components/collections/AsymmetricGrid";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type CategoryGallerySectionProps = {
  category: CollectionCategory;
};

export function CategoryGallerySection({ category }: CategoryGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const items = buildCategoryGallery(category);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector("[data-gallery-label]"), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24"
      style={{ backgroundColor: category.backgroundColor }}
    >
      <div className="mx-auto mb-10 max-w-7xl px-6 md:px-10">
        <p
          data-gallery-label
          className="editorial-spacing text-[10px]"
          style={{ color: category.accentColor }}
        >
          Gallery
        </p>
        <h3
          className="font-display mt-4 text-3xl font-light md:text-5xl"
          style={{ color: category.textColor }}
        >
          The complete edit
        </h3>
      </div>

      <div className="mx-auto max-w-[1500px] px-3 md:px-6">
        <AsymmetricGrid
          images={items}
          columns={4}
          gap={20}
          borderRadius={6}
          chaos={90}
          parallaxStrength={10}
          backgroundColor={category.backgroundColor}
        />
      </div>
    </section>
  );
}
