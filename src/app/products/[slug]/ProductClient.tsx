"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { getProduct, formatPrice } from "@/data/products";
import { getCollection } from "@/data/collections";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { EditorialImage } from "@/components/ui/EditorialImage";

export function ProductClient({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false);
  const product = getProduct(slug);

  if (!product) notFound();

  const collection = getCollection(product.collection);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          <main>
            <section className="relative h-screen w-full overflow-hidden">
              {product.video ? (
                <video autoPlay muted loop playsInline className="h-full w-full object-cover">
                  <source src={product.video} type="video/mp4" />
                </video>
              ) : (
                <EditorialImage
                  src={product.hero}
                  alt={product.name}
                  priority
                  className="h-full w-full"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/20" />
            </section>

            <section className="px-6 py-32 md:px-12">
              <div className="mx-auto max-w-4xl">
                <p className="editorial-spacing text-[10px] text-muted">
                  {collection?.title ?? product.collectionLabel}
                </p>
                <TextReveal
                  as="h1"
                  className="font-display mt-6 text-6xl font-light text-cream md:text-8xl"
                >
                  {product.name}
                </TextReveal>
                <TextReveal
                  as="p"
                  className="mt-12 text-xl leading-relaxed text-cream/70"
                  split="lines"
                  delay={0.2}
                >
                  {product.story}
                </TextReveal>
              </div>
            </section>

            <section className="px-6 py-16 md:px-12">
              <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
                <MaskReveal
                  src={product.detail}
                  alt={`${product.name} fabric detail`}
                  direction="up"
                  className="aspect-square w-full"
                />
                <div className="flex flex-col justify-center">
                  <p className="editorial-spacing mb-4 text-[10px] text-muted">Fabric</p>
                  <p className="text-lg leading-relaxed text-cream/70">{product.fabric}</p>
                </div>
              </div>
            </section>

            <section className="px-6 py-16 md:px-12">
              <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
                {product.gallery.map((img, i) => (
                  <MaskReveal
                    key={img}
                    src={img}
                    alt={`${product.name} — look ${i + 1}`}
                    direction={i % 2 === 0 ? "left" : "right"}
                    className="aspect-[3/4] w-full"
                  />
                ))}
              </div>
            </section>

            <section className="border-t border-cream/10 px-6 py-32 md:px-12">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <p className="editorial-spacing text-[10px] text-muted">Acquire</p>
                <p className="font-display mt-8 text-5xl text-cream md:text-6xl">
                  {formatPrice(product.price, product.currency)}
                </p>
                <p className="mt-6 max-w-md text-sm text-cream/50">
                  Made to order. Allow 6–8 weeks for atelier completion. Complimentary worldwide shipping.
                </p>
                <button
                  className="editorial-spacing mt-12 border border-cream/30 px-12 py-4 text-[10px] text-cream transition-all hover:border-cream hover:bg-cream hover:text-ink"
                  data-cursor="SHOP"
                >
                  Request Piece
                </button>
              </div>
            </section>
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
