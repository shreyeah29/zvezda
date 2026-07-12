"use client";

import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductsByCollection, type Product } from "@/data/products";
import { getCollection } from "@/data/collections";
import { ProductGalleryLayout } from "@/components/product/ProductGalleryLayout";
import "@/components/product/ProductRelated.css";

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-related__card group">
      <div className="product-related__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.hero} alt={product.name} className="product-related__image" />
      </div>
      <p className="product-related__label">{product.collectionLabel}</p>
      <p className="product-related__name">{product.name}</p>
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
    [product],
  );

  const related = getProductsByCollection(product.collection)
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  return (
    <main id="main-content" className="min-h-screen bg-[#fafaf9]">
      {hasVideo && (
        <section className="hero-screen relative isolate w-full overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ objectPosition: product.videoObjectPosition ?? "center" }}
          >
            <source src={product.video} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
          <p className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.2em] text-white/85 uppercase">
            Scroll to explore
          </p>
        </section>
      )}

      <section className={hasVideo ? "" : "pt-24 md:pt-28"}>
        <ProductGalleryLayout
          product={product}
          images={allImages}
          collectionTitle={collection?.title}
        />
      </section>

      {related.length > 0 && (
        <section className="product-related">
          <div className="product-related__inner">
            <p className="product-related__heading">From the Collection</p>
            <div className="product-related__grid">
              {related.map((p) => (
                <RelatedCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-black/10 px-6 py-12 text-center md:px-10">
        <Link href="/shop" className="text-[11px] text-black/55 transition-colors hover:text-black">
          Back to Collection
        </Link>
      </footer>
    </main>
  );
}
