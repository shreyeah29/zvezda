"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { CollectionSection } from "@/components/collections/CollectionSection";
import { collections } from "@/data/collections";

export function CollectionsExperience() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <main>
            <header className="flex min-h-[55vh] flex-col justify-end bg-ink px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
              <p className="editorial-spacing text-[10px] text-gold">Editorial</p>
              <h1 className="font-display mt-5 max-w-4xl text-5xl font-light text-cream md:text-7xl lg:text-8xl">
                Collections
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/50 md:text-base">
                Six campaigns — each a distinct atmosphere, each a world unto itself. Enter through
                the gallery, leave through the garment.
              </p>
            </header>

            {collections.map((collection, index) => (
              <CollectionSection key={collection.slug} collection={collection} index={index} />
            ))}
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
