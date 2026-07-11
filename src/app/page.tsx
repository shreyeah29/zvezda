"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { HomeHeroVideo } from "@/components/home/HomeHeroVideo";
import { HomePillCarousel } from "@/components/home/HomePillCarousel";

const SmoothScroll = dynamic(
  () =>
    import("@/components/layout/SmoothScroll").then((mod) => ({
      default: mod.SmoothScroll,
    })),
  { ssr: false },
);

const HomeAtelierShop = dynamic(
  () =>
    import("@/components/home/HomeAtelierShop").then((mod) => ({
      default: mod.HomeAtelierShop,
    })),
  { ssr: false },
);

const HomeInstagramChapter = dynamic(
  () =>
    import("@/components/home/HomeInstagramChapter").then((mod) => ({
      default: mod.HomeInstagramChapter,
    })),
  { ssr: false },
);

const Footer = dynamic(
  () =>
    import("@/components/layout/Footer").then((mod) => ({
      default: mod.Footer,
    })),
  { ssr: false },
);

export default function HomePage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content">
          <HomeHeroVideo />
          <HomeAtelierShop />
          <HomePillCarousel />
          <HomeInstagramChapter />
          <Footer />
        </main>
      </SmoothScroll>
    </SessionLoadGate>
  );
}
