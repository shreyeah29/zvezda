"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { HomeHeroVideo } from "@/components/home/HomeHeroVideo";
import { HomePillCarousel } from "@/components/home/HomePillCarousel";

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

const HomeShopCards = dynamic(
  () =>
    import("@/components/home/HomeShopCards").then((mod) => ({
      default: mod.HomeShopCards,
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

const HomeInstagramChapter = dynamic(
  () =>
    import("@/components/home/HomeInstagramChapter").then((mod) => ({
      default: mod.HomeInstagramChapter,
    })),
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
  const pillRef = useRef<HTMLElement>(null);

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
            <HomeEditorialMarquee />
            <HomeShopCards />
            <HomePillCarousel ref={pillRef} />
            <HomeInstagramChapter pillSectionRef={pillRef} />
            <Footer />
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
