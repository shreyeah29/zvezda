"use client";

import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductsByCollection, type Product } from "@/data/products";
import { getCollection } from "@/data/collections";
import { brand } from "@/data/brand";
import { ProductGalleryLayout } from "@/components/product/ProductGalleryLayout";
import { CARD_RADIUS } from "@/lib/motion/MotionUtilities";

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block shrink-0">
      <div
        className="overflow-hidden border border-cream/12 bg-zinc-950 transition-colors group-hover:border-cream/25"
        style={{ width: 140, borderRadius: CARD_RADIUS * 0.6 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.hero}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover object-top"
        />
      </div>
      <p className="editorial-spacing mt-3 text-[8px] text-cream/40">{product.collectionLabel}</p>
      <p className="mt-1 font-display text-sm text-cream">{product.name}</p>
    </Link>
  );
}

function uniqueImages(images: string[]) {
  return [...new Set(images.filter(Boolean))];
}

export function ProductClient({ slug }: { slug: string }) {
  const product = getProduct(slug);
  if (!product) notFound();

  const collection = getCollection(product.collection);
  const hasVideo = Boolean(product.video);

  const allImages = useMemo(
    () => uniqueImages([product.hero, product.detail, ...product.gallery]),
    [product]
  );

  const related = getProductsByCollection(product.collection)
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-ink">
      {/* Nav */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-lg tracking-[0.35em] text-cream">
          {brand.name}
        </Link>
        <Link
          href="/shop"
          className="editorial-spacing text-[9px] text-cream/50 transition-colors hover:text-cream"
        >
          ← Collection
        </Link>
      </header>

      {/* Video hero — full screen, scroll down to shop layout */}
      {hasVideo && (
        <section className="relative h-screen w-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={product.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
          <p className="editorial-spacing absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] text-cream/50">
            Scroll to explore
          </p>
        </section>
      )}

      {/* Gallery + details — AROKA-style layout */}
      <section className={hasVideo ? "" : "pt-20"}>
        <ProductGalleryLayout
          product={product}
          images={allImages}
          collectionTitle={collection?.title}
        />
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-cream/10 px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="editorial-spacing mb-8 text-[9px] text-cream/40">From the Collection</p>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {related.map((p) => (
                <RelatedCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-cream/10 px-6 py-12 text-center md:px-10">
        <Link
          href="/shop"
          className="editorial-spacing text-[9px] text-cream/40 transition-colors hover:text-cream"
        >
          Back to Collection
        </Link>
      </footer>
    </div>
  );
}
