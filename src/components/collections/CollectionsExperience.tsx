"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { CategoryVideoHero } from "@/components/collections/CategoryVideoHero";
import { CategoryGallerySection } from "@/components/collections/CategoryGallerySection";
import { CategoryStorySection } from "@/components/collections/CategoryStorySection";
import { collectionCategories } from "@/data/collectionCategories";

export function CollectionsExperience() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <main className="bg-ink">
            {collectionCategories.map((category) => (
              <div key={category.id} className="relative">
                <CategoryVideoHero category={category} />
                <CategoryGallerySection category={category} />
                <CategoryStorySection category={category} />
              </div>
            ))}
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
