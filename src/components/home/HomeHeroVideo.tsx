"use client";

import Link from "next/link";
import { setVideoPath, getSet } from "@/data/sets";
import { brand } from "@/data/brand";

const heroSet = getSet(3)!;

export function HomeHeroVideo() {
  const heroVideo = setVideoPath(heroSet)!;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-ink">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/50" />

      <header className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-6 py-8 md:px-12">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.4em] text-cream md:text-2xl"
        >
          {brand.name}
        </Link>
        <Link
          href="/shop"
          className="editorial-spacing text-[10px] text-cream/70 transition-colors hover:text-cream"
        >
          Shop
        </Link>
      </header>
    </div>
  );
}
