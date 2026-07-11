"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getProduct, formatPrice } from "@/data/products";
import { shopHighlightCards } from "@/data/shopHighlightCards";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import { JacquemusQuickView } from "./JacquemusQuickView";
import "./HomeProductRow.css";

function formatJacquemusPrice(price: number, currency: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
  return `${formatted.replace("$", "").trim()} USD`;
}

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
                className="jm-product-row__hit"
                onClick={() => openQuickView(card.slug)}
                aria-label={`Quick view ${product.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={product.name} className="jm-product-row__image" draggable={false} />

                <span className="jm-product-row__badge">New</span>

                <div className="jm-product-row__hover-meta">
                  <span className="jm-product-row__name">{product.name}</span>
                  <span className="jm-product-row__price">
                    {formatJacquemusPrice(product.price, product.currency)}
                  </span>
                </div>

                <div
                  className="jm-product-row__wishlist"
                  data-wishlist-control
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <WishlistButton slug={product.slug} size="sm" />
                </div>
              </button>
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
