"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatProductPrice } from "@/data/products";
import { findProduct } from "@/data/findProduct";
import {
  eveningHighlightCards,
  bloomHighlightCards,
  pinkHighlightCards,
  shopHighlightCards,
  type ShopHighlightCard,
} from "@/data/shopHighlightCards";
import { getSet, setPhotoPath } from "@/data/sets";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import "./HomeProductRow.css";

function getProductRowImages(slug: string, setId: number, primaryImage: string) {
  const set = getSet(setId);
  if (set) {
    const photos = set.photos.map((photo) => setPhotoPath(set, photo));
    const hover = photos.find((src) => src !== primaryImage) ?? photos[1] ?? primaryImage;
    return { primary: primaryImage, hover };
  }

  const product = findProduct(slug);
  const hover =
    [product?.detail, ...(product?.gallery ?? [])].find((src) => src && src !== primaryImage) ??
    primaryImage;
  return { primary: primaryImage, hover };
}

type HomeProductRowProps = {
  cards?: ShopHighlightCard[];
  ariaLabel?: string;
  showSectionRule?: boolean;
  showPrice?: boolean;
};

export function HomeProductRow({
  cards = shopHighlightCards,
  ariaLabel = "Featured products",
  showSectionRule = true,
  showPrice = true,
}: HomeProductRowProps) {
  const router = useRouter();

  const cardImages = useMemo(
    () =>
      cards.map((card) => ({
        slug: card.slug,
        ...getProductRowImages(card.slug, card.setId, card.image),
      })),
    [cards],
  );

  return (
    <section className="jm-product-row" aria-label={ariaLabel}>
      <div className="jm-product-row__grid">
        {cards.map((card) => {
          const product = findProduct(card.slug);
          if (!product) return null;

          const images = cardImages.find((entry) => entry.slug === card.slug);
          if (!images) return null;

          return (
            <article key={card.slug} className="jm-product-row__cell">
              <div
                role="link"
                tabIndex={0}
                className="jm-product-row__hit"
                onClick={() => router.push(`/products/${card.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/products/${card.slug}`);
                  }
                }}
                aria-label={`View ${product.name}`}
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
                    {showPrice ? (
                      <span className="jm-product-row__price">
                        {formatProductPrice(product)}
                      </span>
                    ) : null}
                    <WishlistButton slug={product.slug} size="sm" />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {showSectionRule && <hr className="jm-section-rule" aria-hidden="true" />}
    </section>
  );
}

export function HomeEveningProductRow() {
  return (
    <HomeProductRow
      cards={eveningHighlightCards}
      ariaLabel="The Occasion and The Statement"
      showPrice={false}
    />
  );
}

export function HomeBloomProductRow() {
  return (
    <HomeProductRow
      cards={bloomHighlightCards}
      ariaLabel="Romance and Bespoke"
      showPrice={false}
    />
  );
}

export function HomePinkProductRow() {
  return (
    <HomeProductRow
      cards={pinkHighlightCards}
      ariaLabel="Pink collection products"
    />
  );
}
