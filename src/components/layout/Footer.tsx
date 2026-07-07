"use client";

import Link from "next/link";
import { brand } from "@/data/brand";
import { collections } from "@/data/collections";

export function Footer() {
  return (
    <footer className="relative min-h-screen overflow-hidden">
      {/* Background video loop */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-30"
        >
          <source src="/assets/videos/products/set-1/GardenSolo3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-24 md:px-12">
        <div className="max-w-4xl">
          <h2 className="font-display text-5xl leading-tight font-light text-cream md:text-7xl lg:text-8xl">
            {brand.statement}
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="editorial-spacing mb-4 text-[10px] text-muted">Collections</p>
            <ul className="space-y-2">
              {collections.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={`/collections/${col.slug}`}
                    className="text-sm text-cream/70 transition-colors hover:text-cream"
                    data-cursor="EXPLORE"
                  >
                    {col.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="editorial-spacing mb-4 text-[10px] text-muted">House</p>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-cream/70 hover:text-cream" data-cursor="VIEW">
                  About
                </Link>
              </li>
              <li>
                <Link href="/film" className="text-sm text-cream/70 hover:text-cream" data-cursor="VIEW">
                  Film
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-cream/70 hover:text-cream" data-cursor="VIEW">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="editorial-spacing mb-4 text-[10px] text-muted">Contact</p>
            <p className="text-sm text-cream/70">atelier@zvezda.com</p>
            <p className="mt-2 text-sm text-cream/70">Paris · Milan · New York</p>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-cream/10 pt-8">
          <span className="font-display text-2xl tracking-[0.4em] text-cream">{brand.name}</span>
          <span className="editorial-spacing text-[10px] text-muted">© 2026</span>
        </div>
      </div>
    </footer>
  );
}
