"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { getCollection } from "@/data/collections";
import { getHouseCollectionProducts } from "@/data/shopCatalog";
import { formatProductPrice } from "@/data/products";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./CollectionClient.css";

export function CollectionClient({ slug }: { slug: string }) {
  const collection = getCollection(slug);

  if (!collection) notFound();

  const products = getHouseCollectionProducts(collection.slug);

  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content" className="house-collection jacquemus-home">
          <header className="house-collection__hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={collection.hero} alt="" />
            <div className="house-collection__hero-copy">
              <p>{collection.season}</p>
              <h1>{collection.title}</h1>
              <span>{collection.description}</span>
            </div>
          </header>

          <section className="house-collection__grid" aria-label={`${collection.title} pieces`}>
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="house-collection__card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.hero} alt={product.name} />
                <div>
                  <h2>{product.name}</h2>
                  <p>{formatProductPrice(product)}</p>
                </div>
              </Link>
            ))}
          </section>
        </main>
        <JacquemusFooter />
      </SmoothScroll>
    </SessionLoadGate>
  );
}
