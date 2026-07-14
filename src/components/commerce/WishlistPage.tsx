"use client";

import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct, formatPrice } from "@/data/products";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import "./WishlistPage.css";

export function WishlistPage() {
  const { wishlist, toggleWishlist } = useCommerce();
  const products = wishlist.map(getProduct).filter(Boolean);

  return (
    <SmoothScroll>
      <main id="main-content" className="wishlist-page">
        <div className="wishlist-page__inner">
          <header className="wishlist-page__header">
            <h1 className="wishlist-page__title">Saved Pieces</h1>
            <p className="wishlist-page__subtitle">
              Your private edit — garments held in reserve until the moment is right.
            </p>
          </header>

          {products.length === 0 ? (
            <div className="wishlist-page__empty">
              <p className="wishlist-page__empty-text">Your curated wardrobe is waiting.</p>
              <Link href="/shop" className="wishlist-page__shop-link">
                Explore the Atelier
              </Link>
            </div>
          ) : (
            <LayoutGroup>
              <motion.div layout className="wishlist-page__grid">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => {
                    if (!product) return null;
                    return (
                      <motion.article
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="wishlist-page__card group"
                      >
                        <Link href={`/products/${product.slug}`} className="block">
                          <div className="wishlist-page__media">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.hero} alt={product.name} draggable={false} />
                            <div
                              className="wishlist-page__heart"
                              data-wishlist-control
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <WishlistButton slug={product.slug} size="sm" />
                            </div>
                          </div>
                          <div className="wishlist-page__meta">
                            <p className="wishlist-page__name">{product.name}</p>
                            <p className="wishlist-page__price">
                              {formatPrice(product.price, product.currency)}
                            </p>
                          </div>
                        </Link>
                        <div className="wishlist-page__actions">
                          <AddToCartButton slug={product.slug} className="flex-1" />
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.slug)}
                            className="wishlist-page__remove"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </div>
      </main>
      <JacquemusFooter />
    </SmoothScroll>
  );
}
