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

const HomeGridMotion = dynamic(
  () =>
    import("@/components/home/HomeGridMotion").then((mod) => ({
      default: mod.HomeGridMotion,
    })),
  { ssr: false }
);

const HomeAtelierManifesto = dynamic(
  () =>
    import("@/components/home/HomeAtelierManifesto").then((mod) => ({
      default: mod.HomeAtelierManifesto,
    })),
  { ssr: false }
);

const HomeMoodBoard = dynamic(
  () =>
    import("@/components/home/HomeMoodBoard").then((mod) => ({
      default: mod.HomeMoodBoard,
    })),
  { ssr: false }
);

const HomeEditorialMarquee = dynamic(
  () =>
    import("@/components/home/HomeEditorialMarquee").then((mod) => ({
      default: mod.HomeEditorialMarquee,
    })),
  { ssr: false }
);

const HomeCollectionCanvas = dynamic(
  () =>
    import("@/components/home/HomeCollectionCanvas").then((mod) => ({
      default: mod.HomeCollectionCanvas,
    })),
  { ssr: false }
);

const ImageScroller = dynamic(
  () => import("@/components/ImageScroller/ImageScroller"),
  { ssr: false }
);

const Footer = dynamic(
  () =>
    import("@/components/layout/Footer").then((mod) => ({
      default: mod.Footer,
    })),
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
          <main className="snap-y snap-proximity">
            <HomeHeroVideo />
            <HomeGridMotion />
            <HomeAtelierManifesto />
            <HomeMoodBoard />
            <HomeEditorialMarquee />
            <HomeCollectionCanvas />
            <ImageScroller />
            <Footer />
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
