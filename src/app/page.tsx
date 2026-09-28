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

const HomeMobileBespoke = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileShop").then((mod) => ({
      default: mod.HomeMobileBespoke,
    })),
  { ssr: false },
);

const HomeMobileRomanceShop = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileShop").then((mod) => ({
      default: mod.HomeMobileRomanceShop,
    })),
  { ssr: false },
);

const HomeMobileStatementShop = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileShop").then((mod) => ({
      default: mod.HomeMobileStatementShop,
    })),
  { ssr: false },
);

const HomeMobileOccasionShop = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeMobileShop").then((mod) => ({
      default: mod.HomeMobileOccasionShop,
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

const HomeEveningProductRow = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeProductRow").then((mod) => ({
      default: mod.HomeEveningProductRow,
    })),
  { ssr: false },
);

const HomeRomanceBespokeSplit = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeRomanceBespokeSplit").then((mod) => ({
      default: mod.HomeRomanceBespokeSplit,
    })),
  { ssr: false },
);

const HomeBloomProductRow = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeProductRow").then((mod) => ({
      default: mod.HomeBloomProductRow,
    })),
  { ssr: false },
);

const HomeRomanceFilm = dynamic(
  () =>
    import("@/components/home/jacquemus/HomeRomanceFilm").then((mod) => ({
      default: mod.HomeRomanceFilm,
    })),
  { ssr: false },
);

const HomeAsSeenOn = dynamic(
  () =>
    import("@/components/home/HomeAsSeenOn").then((mod) => ({
      default: mod.HomeAsSeenOn,
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
          <div className="home-section home-section--split">
            <HomeCollectionSplit />
          </div>
          <div className="home-section home-section--mobile-bespoke">
            <HomeMobileBespoke />
          </div>
          <div className="home-section home-section--evening-row">
            <HomeEveningProductRow />
          </div>
          <div className="home-section home-section--romance-bespoke">
            <HomeRomanceBespokeSplit />
          </div>
          <div className="home-section home-section--bloom-row">
            <HomeBloomProductRow />
          </div>
          <div className="home-section home-section--romance-film">
            <HomeRomanceFilm />
          </div>
          <div className="home-section home-section--mobile-romance">
            <HomeMobileRomanceShop />
          </div>
          <div className="home-section home-section--mobile-statement">
            <HomeMobileStatementShop />
          </div>
          <div className="home-section home-section--mobile-occasion">
            <HomeMobileOccasionShop />
          </div>
          <div className="home-section home-section--as-seen">
            <HomeAsSeenOn />
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
