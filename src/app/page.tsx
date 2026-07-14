"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { HomeHeroVideo } from "@/components/home/HomeHeroVideo";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "@/components/home/jacquemus/home-mobile.css";

const SmoothScroll = dynamic(
  () =>
    import("@/components/layout/SmoothScroll").then((mod) => ({
      default: mod.SmoothScroll,
    })),
  { ssr: false },
);

const HomeMobileShop = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileShop").then((mod) => ({
      default: mod.HomeMobileShop,
    })),
  { ssr: false },
);

const HomeMobilePinkShop = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileShop").then((mod) => ({
      default: mod.HomeMobilePinkShop,
    })),
  { ssr: false },
);

const HomeMobilePinkVideo = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobilePinkVideo").then((mod) => ({
      default: mod.HomeMobilePinkVideo,
    })),
  { ssr: false },
);

const HomeCollectionSplit = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeCollectionSplit").then((mod) => ({
      default: mod.HomeCollectionSplit,
    })),
  { ssr: false },
);

const HomeProductRow = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeProductRow").then((mod) => ({
      default: mod.HomeProductRow,
    })),
  { ssr: false },
);

const HomeCollectionFeature = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeCollectionFeature").then((mod) => ({
      default: mod.HomeCollectionFeature,
    })),
  { ssr: false },
);

const HomePinkProductRow = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeProductRow").then((mod) => ({
      default: mod.HomePinkProductRow,
    })),
  { ssr: false },
);

const HomePinkCollectionFeature = dynamic(
  () =>
    import("@/components/home/jacquemus/HomePinkCollectionFeature").then((mod) => ({
      default: mod.HomePinkCollectionFeature,
    })),
  { ssr: false },
);

const HomeMobileInstagram = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileInstagram").then((mod) => ({
      default: mod.HomeMobileInstagram,
    })),
  { ssr: false },
);

const JacquemusFooter = dynamic(
  () =>
    import("@/components/home/jacquemus/JacquemusFooter").then((mod) => ({
      default: mod.JacquemusFooter,
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
        <main id="main-content" className="jacquemus-home">
          <div className="home-section home-section--hero">
            <HomeHeroVideo />
          </div>
          <div className="home-section home-section--showcase">
            <HomeProductSlideshow />
          </div>
          <div className="home-section home-section--split">
            <HomeCollectionSplit />
          </div>
          <div className="home-section home-section--mobile-bw-shop">
            <HomeMobileShop />
          </div>
          <div className="home-section home-section--pink-row">
            <HomePinkProductRow />
          </div>
          <div className="home-section home-section--pink-feature">
            <HomePinkCollectionFeature />
          </div>
          <div className="home-section home-section--bw-row">
            <HomeProductRow />
          </div>
          <div className="home-section home-section--bw-feature">
            <HomeCollectionFeature />
          </div>
          <div className="home-section home-section--mobile-pink-shop">
            <HomeMobilePinkShop />
          </div>
          <div className="home-section home-section--mobile-pink-video">
            <HomeMobilePinkVideo />
          </div>
          <div className="home-section home-section--instagram">
            <HomeMobileInstagram />
          </div>
          <div className="home-section home-section--footer">
            <JacquemusFooter />
          </div>
        </main>
      </SmoothScroll>
    </SessionLoadGate>
  );
}
