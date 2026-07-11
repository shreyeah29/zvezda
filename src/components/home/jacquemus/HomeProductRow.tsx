"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getProduct } from "@/data/products";
import { shopHighlightCards } from "@/data/shopHighlightCards";
import { getSet, setPhotoPath } from "@/data/sets";
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

function getProductRowImages(setId: number, primaryImage: string) {
  const set = getSet(setId);
  if (!set) return { primary: primaryImage, hover: primaryImage };

  const photos = set.photos.map((photo) => setPhotoPath(set, photo));
  const hover = photos.find((src) => src !== primaryImage) ?? photos[1] ?? primaryImage;

  return { primary: primaryImage, hover };
}

export function HomeProductRow() {
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const quickViewProduct = quickViewSlug ? getProduct(quickViewSlug) : null;
  const quickViewCard = shopHighlightCards.find((c) => c.slug === quickViewSlug);

  const cardImages = useMemo(
    () =>
      shopHighlightCards.map((card) => ({
        slug: card.slug,
        ...getProductRowImages(card.setId, card.image),
      })),
    [],
  );

  const openQuickView = useCallback((slug: string) => {
    setQuickViewSlug(slug);
  }, []);

  return (
    <section className="jm-product-row" aria-label="Featured products">
      <div className="jm-product-row__grid">
        {shopHighlightCards.map((card) => {
          const product = getProduct(card.slug);
          if (!product) return null;

          const images = cardImages.find((entry) => entry.slug === card.slug);
          if (!images) return null;

          return (
            <article key={card.slug} className="jm-product-row__cell">
              <button
                type="button"
                className="jm-product-row__hit"
                onClick={() => openQuickView(card.slug)}
                aria-label={`Quick view ${product.name}`}
              >
                <div className="jm-product-row__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images.primary}
                    alt={product.name}
                    className="jm-product-row__image jm-product-row__image--primary"
                    draggable={false}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images.hover}
                    alt=""
                    aria-hidden="true"
                    className="jm-product-row__image jm-product-row__image--hover"
                    draggable={false}
                  />
                </div>

                <span className="jm-product-row__badge">New</span>

                <div className="jm-product-row__hover-meta">
                  <span className="jm-product-row__name">{product.name}</span>
                  <div
                    className="jm-product-row__price-row"
                    data-wishlist-control
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <span className="jm-product-row__price">
                      {formatJacquemusPrice(product.price, product.currency)}
                    </span>
                    <WishlistButton slug={product.slug} size="sm" />
                  </div>
                </div>
              </button>
            </article>
          );
        })}
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />

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
