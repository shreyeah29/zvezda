"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { HeroScene } from "@/components/scenes/HeroScene";
import { TypographyScene, FabricScene } from "@/components/scenes/EditorialScenes";
import { HorizontalRunway } from "@/components/scenes/HorizontalRunway";
import { DesignerStory, ShopTeaser, FilmTeaser } from "@/components/scenes/StoryScenes";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          <main>
            <HeroScene />
            <TypographyScene />
            <FabricScene />
            <HorizontalRunway />
            <FilmTeaser />
            <DesignerStory />
            <ShopTeaser />
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
