"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { CategoryVideoHero } from "@/components/collections/CategoryVideoHero";
import { CategoryAsymmetricGallery } from "@/components/collections/CategoryAsymmetricGallery";
import { collectionCategories } from "@/data/collectionCategories";

const ImageScroller = dynamic(() => import("@/components/ImageScroller/ImageScroller"), {
  ssr: false,
});

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
                <CategoryAsymmetricGallery category={category} />
              </div>
            ))}
            <ImageScroller />
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
