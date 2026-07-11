"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getProduct, formatPrice } from "@/data/products";
import { shopHighlightCards } from "@/data/shopHighlightCards";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import { JacquemusQuickView } from "./JacquemusQuickView";
import "./HomeProductRow.css";

export function HomeProductRow() {
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const quickViewProduct = quickViewSlug ? getProduct(quickViewSlug) : null;
  const quickViewCard = shopHighlightCards.find((c) => c.slug === quickViewSlug);

  const openQuickView = useCallback((slug: string) => {
    setQuickViewSlug(slug);
  }, []);

  return (
    <section className="jm-product-row" aria-label="Featured products">
      <div className="jm-product-row__grid">
        {shopHighlightCards.map((card) => {
          const product = getProduct(card.slug);
          if (!product) return null;
          return (
            <article key={card.slug} className="jm-product-row__cell">
              <button
                type="button"
                className="jm-product-row__image-btn"
                onClick={() => openQuickView(card.slug)}
                aria-label={`Quick view ${product.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={product.name} className="jm-product-row__image" />
              </button>
              <div className="jm-product-row__meta">
                <div className="jm-product-row__meta-top">
                  <span className="jm-product-row__badge">New</span>
                  <div className="jm-product-row__wishlist">
                    <WishlistButton slug={product.slug} size="sm" />
                  </div>
                </div>
                <div className="jm-product-row__meta-bottom">
                  <button
                    type="button"
                    className="jm-product-row__name-btn"
                    onClick={() => openQuickView(card.slug)}
                  >
                    {product.name}
                  </button>
                  <span className="jm-product-row__price">
                    {formatPrice(product.price, product.currency).replace("$", "")} USD
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <hr className="jm-divider" />

      <AnimatePresence>
        {quickViewProduct && quickViewCard && (
          <JacquemusQuickView
            product={quickViewProduct}
            imageSrc={quickViewCard.image}
            onClose={() => setQuickViewSlug(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
