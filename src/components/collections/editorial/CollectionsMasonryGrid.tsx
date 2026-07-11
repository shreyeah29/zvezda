"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EditorialCollection } from "@/data/editorialCollections";
import "./CollectionsMasonryGrid.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type CollectionsMasonryGridProps = {
  collections: EditorialCollection[];
};

export function CollectionsMasonryGrid({ collections }: CollectionsMasonryGridProps) {
  return (
    <section className="collections-masonry editorial-section" aria-label="Collection grid">
      <div className="editorial-container">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={collections.map((c) => c.id).join("-")}
            className="collections-masonry__grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {collections.map((collection, index) => (
              <motion.article
                key={collection.id}
                className={`collections-masonry__item collections-masonry__item--${(index % 3) + 1}`}
                layout
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }}
              >
                <Link href={`/collections/${collection.slug}`} className="collections-masonry__link">
                  <div className="collections-masonry__image-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="collections-masonry__image"
                      loading="lazy"
                    />
                    <div className="collections-masonry__overlay">
                      <h2 className="collections-masonry__title">{collection.title}</h2>
                      <span className="editorial-link-arrow collections-masonry__cta">
                        View Collection
                        <span className="editorial-link-arrow__icon" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="collections-masonry__desc">{collection.description}</p>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
