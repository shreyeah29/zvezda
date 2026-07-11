"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { HomeHeroVideo } from "@/components/home/HomeHeroVideo";
import "@/components/home/jacquemus/jacquemus-theme.css";

const SmoothScroll = dynamic(
  () =>
    import("@/components/layout/SmoothScroll").then((mod) => ({
      default: mod.SmoothScroll,
    })),
  { ssr: false },
);

const HomeScrollGallery = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeScrollGallery").then((mod) => ({
      default: mod.HomeScrollGallery,
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
          <HomeHeroVideo />
          <hr className="jm-section-rule" aria-hidden="true" />
          <HomeScrollGallery />
          <HomeCollectionSplit />
          <HomeProductRow />
          <HomeCollectionFeature />
          <JacquemusFooter />
        </main>
      </SmoothScroll>
    </SessionLoadGate>
  );
}
