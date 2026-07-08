"use client";

import Link from "next/link";
import { videos } from "@/data/brand";

export function HomeHeroVideo() {
  return (
    <div className="viewport-fill relative h-screen w-full overflow-hidden bg-ink">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={videos.hero} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/15 via-transparent to-ink/25" />

      <header className="absolute top-0 right-0 left-0 z-20 flex items-start justify-end px-6 py-8 md:px-12">
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
