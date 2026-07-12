"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { formatPrice } from "@/data/products";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import type { Product } from "@/data/products";
import "./HomeEditorialProductCard.css";

const COLLECTION_COLORS: Record<string, string[]> = {
  garden: ["#4a5240", "#6b7560", "#3d4436"],
  peach: ["#d4a088", "#e8c4b0", "#c48870"],
  pink: ["#e8a4b8", "#f5c6d4", "#d4849c"],
  noir: ["#1a1a1a", "#4a4a4a", "#8a8580"],
  yellow: ["#c9a227", "#e8c547", "#a68520"],
  red: ["#8b1a2b", "#c42d42", "#5c1019"],
  orange: ["#c47a3a", "#e89a55", "#9a5520"],
};

type HomeEditorialProductCardProps = {
  product: Product;
  index?: number;
};

export function HomeEditorialProductCard({ product, index = 0 }: HomeEditorialProductCardProps) {
  const router = useRouter();
  const colors = COLLECTION_COLORS[product.collection] ?? ["#0a0a0a", "#5a5a5a", "#9a9a9a"];
  const href = `/products/${product.slug}`;

  return (
    <motion.article
      className="editorial-product-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="editorial-product-card__media">
        <button
          type="button"
          className="editorial-product-card__image-btn"
          onClick={() => router.push(href)}
          aria-label={`View ${product.name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.hero} alt={product.name} draggable={false} loading="lazy" />
        </button>

        <div
          className="editorial-product-card__wishlist"
          data-wishlist-control
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <WishlistButton slug={product.slug} size="sm" />
        </div>
      </div>

      <div className="editorial-product-card__swatches" aria-hidden="true">
        {colors.map((color, i) => (
          <span
            key={`${product.slug}-${color}`}
            className={`editorial-product-card__swatch ${i === 0 ? "is-active" : ""}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <button
        type="button"
        className="editorial-product-card__meta"
        onClick={() => router.push(href)}
      >
        <span className="editorial-product-card__name">{product.name}</span>
        <span className="editorial-product-card__dash">—</span>
        <span className="editorial-product-card__price">{formatPrice(product.price, product.currency)}</span>
      </button>
    </motion.article>
  );
}
