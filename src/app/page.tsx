"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [loaded]);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <main className="snap-y snap-proximity md:snap-mandatory">
            <HomeHeroVideo />
            <HomeDomeGallery />
            <ImageScroller className="snap-start snap-always" />
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
