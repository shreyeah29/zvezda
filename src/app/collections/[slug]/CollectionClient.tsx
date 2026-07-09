"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { getCollection } from "@/data/collections";
import { getProductsByCollection, formatPrice } from "@/data/products";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { EditorialImage } from "@/components/ui/EditorialImage";

export function CollectionClient({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false);
  const collection = getCollection(slug);

  if (!collection) notFound();

  const products = getProductsByCollection(collection.slug);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <CustomCursor />
          <main>
            <section className="relative h-screen w-full overflow-hidden">
              <EditorialImage
                src={collection.hero}
                alt={`${collection.title} collection cover`}
                accent={collection.accent}
                priority
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute right-6 bottom-24 left-6 md:right-12 md:left-12">
                <p className="editorial-spacing text-[10px] text-cream/60">{collection.season}</p>
                <h1 className="font-display mt-4 text-7xl font-light text-cream md:text-9xl">
                  {collection.title}
                </h1>
                <p className="mt-2 font-display text-2xl text-cream/60">{collection.subtitle}</p>
              </div>
            </section>

            <section className="px-6 py-32 md:px-12">
              <div className="mx-auto max-w-3xl text-center">
                <TextReveal
                  as="p"
                  className="font-display text-3xl leading-relaxed font-light text-cream md:text-4xl"
                  split="lines"
                >
                  {collection.description}
                </TextReveal>
              </div>
            </section>

            <section className="px-6 pb-32 md:px-12">
              <MaskReveal
                src={collection.cover}
                alt={`${collection.title} editorial`}
                direction="up"
                accent={collection.accent}
                className="mx-auto aspect-[16/9] max-w-7xl w-full"
              />
            </section>

            {products.length > 0 && (
              <section className="px-6 py-32 md:px-12">
                <div className="mx-auto max-w-7xl">
                  <p className="editorial-spacing mb-16 text-[10px] text-muted">Pieces</p>
                  <div className="space-y-32">
                    {products.map((product, i) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="group grid items-center gap-12 lg:grid-cols-2"
                        data-cursor="SHOP"
                      >
                        <MaskReveal
                          src={product.hero}
                          alt={product.name}
                          direction={i % 2 === 0 ? "left" : "right"}
                          className={`aspect-[3/4] ${i % 2 === 1 ? "lg:order-2" : ""}`}
                        />
                        <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                          <h2 className="font-display text-5xl font-light text-cream group-hover:text-gold">
                            {product.name}
                          </h2>
                          <p className="editorial-spacing mt-2 text-[10px] text-muted">{product.collectionLabel}</p>
                          <p className="mt-6 text-cream/60">{product.description}</p>
                          <p className="mt-8 font-display text-2xl">
                            {formatPrice(product.price, product.currency)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
