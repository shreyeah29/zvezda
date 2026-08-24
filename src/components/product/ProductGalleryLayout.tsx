"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistButton } from "@/components/commerce/CommerceAnimations";
import type { Product } from "@/data/products";
import { formatPrice, formatProductPrice } from "@/data/products";
import "./ProductGalleryLayout.css";

const STANDARD_SIZES = ["6", "8", "10", "12"] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const SIZE_GUIDE = [
  { size: "6", bust: "32\"", waist: "26\"", hip: "36\"" },
  { size: "8", bust: "34\"", waist: "28\"", hip: "38\"" },
  { size: "10", bust: "36\"", waist: "30\"", hip: "40\"" },
  { size: "12", bust: "38\"", waist: "32\"", hip: "42\"" },
] as const;

type ProductGalleryLayoutProps = {
  product: Product;
  images: string[];
  collectionTitle?: string;
};

const imageVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 56,
    scale: 1.04,
    filter: "blur(10px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -56,
    scale: 0.97,
    filter: "blur(6px)",
  }),
};

export function ProductGalleryLayout({
  product,
  images,
  collectionTitle,
}: ProductGalleryLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions?.[0] ?? STANDARD_SIZES[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const [customOpen, setCustomOpen] = useState(false);
  const [customColourOpen, setCustomColourOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const prevIndex = useRef(0);

  const sizeChoices = STANDARD_SIZES;
  const activeImage = images[activeIndex] ?? product.hero;
  const enquiryHref = `/contact?product=${encodeURIComponent(product.name)}#enquiry`;
  const details = product.story || product.description;
  const care = product.care ?? "Dry clean only";

  const selectImage = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > prevIndex.current ? 1 : -1);
    prevIndex.current = index;
    setActiveIndex(index);
  };

  return (
    <div className="jm-product-gallery mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[72px_1fr_340px] lg:gap-10 xl:grid-cols-[80px_1fr_380px]">
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                key={`${img}-${i}`}
                type="button"
                onClick={() => selectImage(i)}
                animate={{ scale: isActive ? 1.04 : 1 }}
                whileHover={{ scale: isActive ? 1.04 : 1.02 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`jm-product-gallery__thumb gpu relative shrink-0 overflow-hidden rounded-lg lg:w-full ${
                  isActive ? "jm-product-gallery__thumb--active" : ""
                }`}
                style={{ width: 56, aspectRatio: "3/4" }}
                aria-label={`View image ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover object-top" />
              </motion.button>
            );
          })}
        </div>

        <div className="order-1 overflow-hidden lg:order-2">
          <div className="jm-product-gallery__stage relative overflow-hidden rounded-[28px] md:rounded-[32px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeImage}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EASE }}
                className="relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={product.name}
                  className="aspect-[3/4] w-full object-cover object-top md:aspect-[4/5]"
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1">
              <p className="text-[10px] text-white/90">
                {activeIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>

        <div className="jm-product-gallery__rail order-3 lg:sticky lg:top-24 lg:self-start">
          <p className="jm-product-gallery__label">{collectionTitle ?? product.collectionLabel}</p>
          <div className="jm-product-gallery__title-row">
            <h1 className="jm-product-gallery__title font-product">{product.name}</h1>
            <p className="jm-product-gallery__price">
              {formatProductPrice(product)}
            </p>
          </div>
          {product.priceOptions && product.priceOptions.length > 1 && (
            <ul className="mt-3 space-y-1">
              {product.priceOptions.map((option) => (
                <li key={option.label} className="text-[12px] text-black/65">
                  {option.label} — {formatPrice(option.amount, product.currency)}
                </li>
              ))}
            </ul>
          )}

          <dl className="jm-product-gallery__facts">
            <div>
              <dt>Made to order</dt>
              <dd>Crafted exclusively for you.</dd>
            </div>
            <div>
              <dt>Creation time</dt>
              <dd>3–4 weeks</dd>
            </div>
            <div>
              <dt>Returns</dt>
              <dd>Final sale</dd>
            </div>
          </dl>

          <div>
            <p className="jm-product-gallery__section">Select your colour</p>
            <div className="jm-product-gallery__swatches">
              <button
                type="button"
                onClick={() => setCustomColourOpen(false)}
                className={`jm-product-gallery__size ${
                  !customColourOpen ? "jm-product-gallery__size--active" : ""
                }`}
              >
                Original colour
              </button>
              <button
                type="button"
                onClick={() => setCustomColourOpen((open) => !open)}
                className={`jm-product-gallery__size ${
                  customColourOpen ? "jm-product-gallery__size--active" : ""
                }`}
                aria-expanded={customColourOpen}
              >
                Custom colour
              </button>
            </div>
            <AnimatePresence initial={false}>
              {customColourOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="jm-product-gallery__panel">
                    <p>Make it yours in a shade of your choice. Enquire with our atelier to explore available colour options for this piece.</p>
                    <Link href={enquiryHref}>Enquire about colour</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="jm-product-gallery__fit-head">
              <p className="jm-product-gallery__section">Select your fit</p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="jm-product-gallery__link"
              >
                Size Guide
              </button>
            </div>
            <div className="jm-product-gallery__sizes">
              {sizeChoices.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setCustomOpen(false);
                  }}
                  className={`jm-product-gallery__size ${
                    selectedSize === size && !customOpen ? "jm-product-gallery__size--active" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {product.sizeNote && !customOpen ? (
              <p className="mt-2 text-[11px] leading-relaxed text-black/55">{product.sizeNote}</p>
            ) : null}
            <button
              type="button"
              onClick={() => setCustomOpen((open) => !open)}
              className={`jm-product-gallery__outline-btn ${
                customOpen ? "jm-product-gallery__outline-btn--active" : ""
              }`}
              aria-expanded={customOpen}
            >
              Custom measurements
            </button>
            <AnimatePresence initial={false}>
              {customOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="jm-product-gallery__panel">
                    <p>Have your piece made specifically for you.</p>
                    <Link href={enquiryHref} className="jm-product-gallery__checkout">
                      Continue with custom measurements
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="jm-product-gallery__buy">
            <div className="jm-product-gallery__qty">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="jm-product-gallery__qty-btn"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="jm-product-gallery__qty-value">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="jm-product-gallery__qty-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <AddToCartButton
              slug={product.slug}
              quantity={quantity}
              size={selectedSize}
              className="jm-product-gallery__bag"
              label="Add to Bag"
            />
          </div>
          <Link href="/cart" className="jm-product-gallery__checkout">
            Checkout
          </Link>
          <div className="jm-product-gallery__actions">
            <Link href={enquiryHref} className="jm-product-gallery__enquire">
              Enquire
            </Link>
            <div className="jm-product-gallery__wishlist">
              <WishlistButton slug={product.slug} size="sm" />
              <span>Add to Wishlist</span>
            </div>
          </div>

          {details || product.fabric || product.craft?.length ? (
          <div className="jm-product-gallery__accordion">
            <button
              type="button"
              onClick={() => setDescOpen((o) => !o)}
              className="jm-product-gallery__accordion-trigger"
            >
              <span className="jm-product-gallery__accordion-label">Product details</span>
              <span className="jm-product-gallery__accordion-icon">{descOpen ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {descOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="jm-product-gallery__accordion-body">
                  {details ? (
                    <div>
                      <p className="jm-product-gallery__section-label">Description</p>
                      <p className="jm-product-gallery__body">{details}</p>
                    </div>
                  ) : null}
                  {product.craft && product.craft.length > 0 ? (
                    <div>
                      <p className="jm-product-gallery__section-label">Craft</p>
                      <ul className="jm-product-gallery__list">
                        {product.craft.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {product.fabric ? (
                    <div>
                      <p className="jm-product-gallery__section-label">Fabric</p>
                      <p className="jm-product-gallery__body">{product.fabric}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="jm-product-gallery__section-label">Care</p>
                    <p className="jm-product-gallery__body">{care}</p>
                  </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          ) : null}
        </div>
      </div>

      {sizeGuideOpen ? (
        <div className="jm-size-guide" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
          <button
            type="button"
            className="jm-size-guide__backdrop"
            aria-label="Close size guide"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="jm-size-guide__sheet">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="jm-product-gallery__label">Fit</p>
                <h2 id="size-guide-title" className="jm-product-gallery__title mt-1 text-[1.5rem]">
                  Size guide
                </h2>
              </div>
              <button type="button" className="jm-product-gallery__link" onClick={() => setSizeGuideOpen(false)}>
                Close
              </button>
            </div>
            <table className="jm-size-guide__table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust</th>
                  <th>Waist</th>
                  <th>Hip</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((row) => (
                  <tr key={row.size}>
                    <td>{row.size}</td>
                    <td>{row.bust}</td>
                    <td>{row.waist}</td>
                    <td>{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="jm-product-gallery__body mt-4 text-[12px]">
              Standard sizes 6–12. For a made-to-measure fit, choose custom measurements.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
