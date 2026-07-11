"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { HomeHeroVideo } from "@/components/home/HomeHeroVideo";
import "@/components/home/editorial/editorial-theme.css";

const SmoothScroll = dynamic(
  () =>
    import("@/components/layout/SmoothScroll").then((mod) => ({
      default: mod.SmoothScroll,
    })),
  { ssr: false },
);

const HomeCollectionsSection = dynamic(
  () =>
    import("@/components/home/editorial/HomeCollectionsSection").then((mod) => ({
      default: mod.HomeCollectionsSection,
    })),
  { ssr: false },
);

const HomeEditorialStory = dynamic(
  () =>
    import("@/components/home/editorial/HomeEditorialStory").then((mod) => ({
      default: mod.HomeEditorialStory,
    })),
  { ssr: false },
);

const HomeFeaturedProducts = dynamic(
  () =>
    import("@/components/home/editorial/HomeFeaturedProducts").then((mod) => ({
      default: mod.HomeFeaturedProducts,
    })),
  { ssr: false },
);

const HomeInstagramSection = dynamic(
  () =>
    import("@/components/home/editorial/HomeInstagramSection").then((mod) => ({
      default: mod.HomeInstagramSection,
    })),
  { ssr: false },
);

const HomeNewsletter = dynamic(
  () =>
    import("@/components/home/editorial/HomeNewsletter").then((mod) => ({
      default: mod.HomeNewsletter,
    })),
  { ssr: false },
);

const EditorialFooter = dynamic(
  () =>
    import("@/components/home/editorial/EditorialFooter").then((mod) => ({
      default: mod.EditorialFooter,
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
        <main id="main-content" className="editorial-page">
          <HomeHeroVideo />
          <HomeCollectionsSection />
          <HomeEditorialStory />
          <HomeFeaturedProducts />
          <HomeInstagramSection />
          <HomeNewsletter />
          <EditorialFooter />
        </main>
      </SmoothScroll>
    </SessionLoadGate>
  );
}
