"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { products, formatPrice, type Product } from "@/data/products";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { GalleryProductModal } from "@/components/home/GalleryProductModal";
import "./HomeFeaturedProducts.css";

const FEATURED_SLUGS = ["set-12", "set-8", "set-1", "set-5"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

function getFeaturedProducts() {
  return FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is Product => Boolean(p),
  );
}

type FeaturedCardProps = {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
};

function FeaturedCard({ product, index, onQuickView }: FeaturedCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const secondary = product.gallery[0] ?? product.detail ?? product.hero;

  return (
    <motion.article
      className="featured-card"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="featured-card__media">
        <button
          type="button"
          className="featured-card__image-btn"
          onClick={() => router.push(`/products/${product.slug}`)}
          aria-label={`View ${product.name}`}
        >
          <motion.div
            className="featured-card__image-layer"
            animate={{ scale: hovered ? 1.05 : 1, opacity: hovered && secondary !== product.hero ? 0 : 1 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.hero} alt={product.name} className="featured-card__image" loading="lazy" />
          </motion.div>
          {secondary !== product.hero && (
            <motion.div
              className="featured-card__image-layer"
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.03 : 1.06 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={secondary} alt="" aria-hidden className="featured-card__image" />
            </motion.div>
          )}
        </button>

        <div className="featured-card__wishlist" data-wishlist-control>
          <WishlistButton slug={product.slug} size="sm" />
        </div>

        <motion.div
          className="featured-card__actions"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <button
            type="button"
            className="featured-card__action-btn"
            onClick={() => onQuickView(product)}
          >
            Quick View
          </button>
          <AddToCartButton slug={product.slug} className="featured-card__cart-btn" label="Add to Cart" />
        </motion.div>
      </div>

      <div className="featured-card__meta">
        <p className="featured-card__collection">{product.collectionLabel}</p>
        <h3 className="featured-card__name">{product.name}</h3>
        <p className="featured-card__price">{formatPrice(product.price, product.currency)}</p>
      </div>
    </motion.article>
  );
}

export function HomeFeaturedProducts() {
  const [quickView, setQuickView] = useState<Product | null>(null);

  const handleQuickView = useCallback((product: Product) => {
    setQuickView(product);
  }, []);

  const featured = getFeaturedProducts();

  return (
    <section className="featured-products editorial-section" aria-labelledby="featured-products-heading">
      <div className="editorial-container">
        <header className="featured-products__header">
          <p className="editorial-eyebrow">Curated</p>
          <h2 id="featured-products-heading" className="editorial-heading featured-products__title">
            Featured Pieces
          </h2>
        </header>

        <div className="featured-products__grid">
          {featured.map((product, index) => (
            <FeaturedCard
              key={product.slug}
              product={product}
              index={index}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {quickView && (
          <GalleryProductModal
            product={quickView}
            imageSrc={quickView.hero}
            onClose={() => setQuickView(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
