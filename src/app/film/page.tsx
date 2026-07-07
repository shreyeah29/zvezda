"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { filmAssets } from "@/data/film";
import { getProduct } from "@/data/products";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { TextReveal } from "@/components/ui/TextReveal";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

function FilmScene({
  asset,
  index,
}: {
  asset: (typeof filmAssets)[0];
  index: number;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = sceneRef.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      if (asset.type === "video") {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.5,
        });
      } else {
        gsap.fromTo(
          el.querySelector("[data-reveal]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [asset, reduced]);

  const featuredProducts = asset.setsFeatured
    .map((id) => getProduct(`set-${id}`))
    .filter(Boolean);

  return (
    <section
      ref={sceneRef}
      className={`relative w-full ${asset.type === "video" ? "h-screen" : "min-h-screen py-24"}`}
    >
      {asset.type === "video" ? (
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src={asset.src} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
          <div className="absolute right-6 bottom-20 left-6 md:right-12 md:left-12">
            <p className="editorial-spacing text-[10px] text-cream/60">
              Scene {String(index + 1).padStart(2, "0")}
            </p>
            {asset.caption && (
              <h2 className="font-display mt-3 text-4xl font-light text-cream md:text-6xl">
                {asset.caption}
              </h2>
            )}
            {featuredProducts.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {featuredProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p!.slug}
                    href={`/products/${p!.slug}`}
                    className="editorial-spacing border border-cream/20 px-4 py-2 text-[9px] text-cream/70 transition-colors hover:border-cream hover:text-cream"
                    data-cursor="SHOP"
                  >
                    {p!.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div data-reveal className="gpu overflow-hidden" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
            <EditorialImage
              src={asset.src}
              alt={asset.caption ?? "Editorial still"}
              className="aspect-[3/4] w-full md:aspect-[16/10]"
            />
          </div>
          <p className="editorial-spacing mt-6 text-[10px] text-muted">
            {asset.caption ?? "Editorial"}
          </p>
        </div>
      )}
    </section>
  );
}

export default function FilmPage() {
  const [loaded, setLoaded] = useState(false);
  const videos = filmAssets.filter((a) => a.type === "video");
  const stills = filmAssets.filter((a) => a.type === "image");

  // Interleave: open with video, alternate stills and videos
  const scenes: typeof filmAssets = [];
  let vi = 0;
  let si = 0;
  while (vi < videos.length || si < stills.length) {
    if (vi < videos.length) scenes.push(videos[vi++]);
    if (si < stills.length) scenes.push(stills[si++]);
    if (si < stills.length && vi >= videos.length) scenes.push(stills[si++]);
  }

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          <main>
            <section className="flex min-h-screen flex-col justify-end px-6 pb-24 md:px-12">
              <p className="editorial-spacing text-[10px] text-muted">Moving image</p>
              <TextReveal
                as="h1"
                className="font-display mt-6 text-7xl font-light text-cream md:text-9xl"
              >
                The Film
              </TextReveal>
              <p className="mt-8 max-w-lg text-cream/60">
                Duos, trios, and editorial moments — not a catalogue, a campaign.
              </p>
            </section>

            {scenes.map((asset, i) => (
              <FilmScene key={asset.slug} asset={asset} index={i} />
            ))}
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
