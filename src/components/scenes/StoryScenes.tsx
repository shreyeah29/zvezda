"use client";

import Link from "next/link";
import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { products, formatPrice } from "@/data/products";

export function ShopTeaser() {
  const featured = [products[0], products[4], products[11], products[12]].filter(Boolean);

  return (
    <section className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="editorial-spacing mb-4 text-[10px] text-muted">Selected Pieces</p>
        <TextReveal
          as="h2"
          className="font-display mb-24 text-5xl font-light text-cream md:text-6xl"
        >
          The Collection
        </TextReveal>

        <div className="space-y-32">
          {featured.map((product, i) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group grid items-center gap-12 lg:grid-cols-2 lg:gap-24"
              data-cursor="SHOP"
            >
              <MaskReveal
                src={product.hero}
                alt={product.name}
                direction={i % 2 === 0 ? "up" : "left"}
                className={`aspect-[3/4] w-full ${i % 2 === 1 ? "lg:order-2" : ""}`}
              />
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="editorial-spacing text-[10px] text-muted">{product.collectionLabel}</p>
                <h3 className="font-display mt-4 text-4xl font-light text-cream transition-colors group-hover:text-gold md:text-5xl">
                  {product.name}
                </h3>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60">
                  {product.story}
                </p>
                <p className="mt-8 font-display text-2xl text-cream/80">
                  {formatPrice(product.price, product.currency)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            href="/collections/garden"
            className="editorial-spacing text-[10px] text-gold hover:text-cream"
            data-cursor="EXPLORE"
          >
            View all collections →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function DesignerStory() {
  return (
    <section className="relative min-h-screen px-6 py-32 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col justify-center">
          <p className="editorial-spacing mb-6 text-[10px] text-muted">The Atelier</p>
          <TextReveal
            as="h2"
            className="font-display text-5xl leading-tight font-light text-cream md:text-7xl"
          >
            Sculpted by hand, worn like memory
          </TextReveal>
          <TextReveal
            as="p"
            className="mt-8 text-base leading-relaxed text-cream/60"
            split="lines"
            delay={0.2}
          >
            In a quiet atelier between Paris and Milan, a small team of artisans transforms fabric into emotion. Each collection begins with a single photograph, a moment of light — and ends when the garment can stand alone as art.
          </TextReveal>
          <div className="mt-12 flex gap-8">
            <Link
              href="/about"
              className="editorial-spacing text-[10px] text-gold hover:text-cream"
              data-cursor="WATCH"
            >
              The story →
            </Link>
            <Link
              href="/film"
              className="editorial-spacing text-[10px] text-gold hover:text-cream"
              data-cursor="WATCH"
            >
              The film →
            </Link>
          </div>
        </div>
        <MaskReveal
          src="/assets/images/products/set-12/HSP_5750.jpg"
          alt="Crimson couture — Zvezda atelier"
          direction="right"
          accent="#8b1a2b"
          className="aspect-[4/5] w-full"
        />
      </div>
    </section>
  );
}

export function FilmTeaser() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-50">
        <source src="/assets/videos/film/GardenTrio.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-ink/50" />
      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="editorial-spacing text-[10px] text-muted">Moving image</p>
        <h2 className="font-display mt-6 text-5xl font-light text-cream md:text-7xl">The Film</h2>
        <p className="mt-6 max-w-md text-sm text-cream/60">
          Duos, trios, and editorial moments from the campaign.
        </p>
        <Link
          href="/film"
          className="editorial-spacing mt-10 border border-cream/30 px-10 py-4 text-[10px] text-cream transition-all hover:bg-cream hover:text-ink"
          data-cursor="WATCH"
        >
          Enter the film
        </Link>
      </div>
    </section>
  );
}
