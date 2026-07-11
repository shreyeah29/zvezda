"use client";

import Link from "next/link";
import { useMemo } from "react";
import { products } from "@/data/products";
import { HomeEditorialProductCard } from "@/components/home/HomeEditorialProductCard";
import "./HomeAtelierShop.css";

const MANIFESTO_IMAGE =
  products.find((p) => p.slug === "set-12")?.detail ??
  products.find((p) => p.slug === "set-8")?.hero ??
  "/assets/images/film/HSP_4662.jpg";

export function HomeAtelierShop() {
  const featured = useMemo(() => products.slice(0, 4), []);

  return (
    <section className="atelier-shop snap-none" aria-label="Atelier shop">
      <div className="atelier-shop__layout">
        <div className="atelier-shop__visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MANIFESTO_IMAGE} alt="Couture atelier" draggable={false} loading="lazy" />

          <div className="atelier-shop__overlay">
            <p className="atelier-shop__quote font-editorial">
              Every garment is created to outlive a season — hand-finished, structurally considered,
              and intended to be worn across years.
            </p>
            <Link href="/shop" className="atelier-shop__cta editorial-spacing">
              Shop the Collection
            </Link>
          </div>
        </div>

        <div className="atelier-shop__grid">
          {featured.map((product, index) => (
            <div key={product.slug} className="atelier-shop__cell">
              <HomeEditorialProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
