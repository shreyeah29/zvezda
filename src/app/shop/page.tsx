"use client";

import { useState } from "react";
import Link from "next/link";
import { products, formatPrice } from "@/data/products";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";

export default function ShopPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          <main className="px-6 pt-32 pb-16 md:px-12">
            <div className="mx-auto max-w-7xl">
              <p className="editorial-spacing mb-4 text-[10px] text-muted">All pieces</p>
              <TextReveal
                as="h1"
                className="font-display mb-24 text-6xl font-light text-cream md:text-8xl"
              >
                The Atelier
              </TextReveal>

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
                      direction={i % 2 === 0 ? "up" : "left"}
                      className={`aspect-[3/4] w-full ${i % 2 === 1 ? "lg:order-2" : ""}`}
                    />
                    <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                      <p className="editorial-spacing text-[10px] text-muted">
                        Set {product.setId} · {product.collectionLabel}
                      </p>
                      <h2 className="font-display mt-4 text-4xl font-light text-cream group-hover:text-gold md:text-5xl">
                        {product.name}
                      </h2>
                      <p className="mt-6 max-w-md text-sm text-cream/60">{product.description}</p>
                      <p className="mt-8 font-display text-2xl text-cream/80">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
