"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { HomeHeroVideo } from "@/components/home/HomeHeroVideo";

const SmoothScroll = dynamic(
  () =>
    import("@/components/layout/SmoothScroll").then((mod) => ({
      default: mod.SmoothScroll,
    })),
  { ssr: false }
);

const HomeDomeGallery = dynamic(
  () =>
    import("@/components/home/HomeDomeGallery").then((mod) => ({
      default: mod.HomeDomeGallery,
    })),
  { ssr: false }
);

const ImageScroller = dynamic(
  () => import("@/components/ImageScroller/ImageScroller"),
  { ssr: false }
);

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <HomeHeroVideo />
          <HomeDomeGallery />
          <ImageScroller />
        </SmoothScroll>
      )}
    </>
  );
}
