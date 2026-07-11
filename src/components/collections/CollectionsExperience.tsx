"use client";

import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { CategoryVideoHero } from "@/components/collections/CategoryVideoHero";
import { CategoryShuffleGallery } from "@/components/collections/CategoryShuffleGallery";
import { collectionCategories } from "@/data/collectionCategories";

export function CollectionsExperience() {
  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content" className="bg-white">
          {collectionCategories.map((category) => (
            <div key={category.id} className="relative">
              <CategoryVideoHero category={category} />
              <CategoryShuffleGallery category={category} />
            </div>
          ))}
        </main>
        <Footer />
      </SmoothScroll>
    </SessionLoadGate>
  );
}
