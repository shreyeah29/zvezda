"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import type { SlideshowProduct } from "./types";
import "./ProductSlideshow.css";

const SPRING = {
  type: "spring" as const,
  stiffness: 160,
  damping: 18,
  mass: 1,
};

const BROWSE_DRESS_HEIGHT = "17.2vh";
const SLOT_VW = 13;
const WHEEL_COOLDOWN_MS = 520;

/** Z V E Z D A — four dresses on Z, V, Z, A only. */
const LETTER_LAYOUT = [
  { char: "Z", dressIndex: 0 },
  { char: "V", dressIndex: 1 },
  { char: "E", dressIndex: null },
  { char: "Z", dressIndex: 2 },
  { char: "D", dressIndex: null },
  { char: "A", dressIndex: 3 },
] as const;

type Mode = "browse" | "detail";

type ProductSlideshowProps = {
  products?: SlideshowProduct[];
};

function InfoPanel({
  product,
  activeSize,
  activeColor,
  onSizeChange,
  onColorChange,
}: {
  product: SlideshowProduct;
  activeSize: string;
  activeColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}) {
  return (
    <aside className="ps-panel">
      <div className="ps-panel__block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={`title-${product.slug}`}
            className="ps-panel__title"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={SPRING}
          >
            {product.title}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`desc-${product.slug}`}
            className="ps-panel__description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {product.description}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`price-${product.slug}`}
            className="ps-panel__price"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={SPRING}
          >
            {product.price}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`variants-${product.slug}`}
          className="ps-panel__block ps-panel__block--variants"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <div className="ps-panel__row" aria-label="Sizes">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`ps-pill${size === activeSize ? " ps-pill--active" : ""}`}
                onClick={() => onSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="ps-panel__row" aria-label="Colors">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                className={`ps-pill${
                  color.name === activeColor ? " ps-pill--active" : ""
                }`}
                onClick={() => onColorChange(color.name)}
              >
                {color.name}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Link href={product.href} className="ps-panel__cta">
        View Product
      </Link>
    </aside>
  );
}

function detailDressMetrics(index: number, activeIndex: number) {
  const isActive = index === activeIndex;
  return {
    height: isActive ? "50.8vh" : "14.8vh",
    opacity: isActive ? 1 : 0.25,
    zIndex: isActive ? 20 : 10 - Math.abs(index - activeIndex),
  };
}

function DressButton({
  item,
  index,
  mode,
  activeIndex,
  hoveredIndex,
  onClick,
  onHover,
  onLeave,
  className,
}: {
  item: SlideshowProduct;
  index: number;
  mode: Mode;
  activeIndex: number;
  hoveredIndex: number | null;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
  className?: string;
}) {
  const isHovered = hoveredIndex === index;
  const isDimmed = mode === "browse" && hoveredIndex !== null && !isHovered;
  const detailMetrics =
    mode === "detail" ? detailDressMetrics(index, activeIndex) : null;

  return (
    <button
      type="button"
      className={className}
      aria-label={`View ${item.title}`}
      aria-pressed={mode === "detail" && index === activeIndex}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={item.image}
        alt={item.alt}
        className="ps-image"
        draggable={false}
        animate={
          mode === "browse"
            ? {
                height: BROWSE_DRESS_HEIGHT,
                opacity: isDimmed ? 0.4 : 1,
                scale: isHovered ? 1.08 : 1,
                y: isHovered ? -12 : 0,
              }
            : {
                height: detailMetrics?.height,
                opacity: detailMetrics?.opacity,
                scale: 1,
                y: 0,
              }
        }
        transition={SPRING}
        style={{
          zIndex: detailMetrics?.zIndex ?? (isHovered ? 12 : 8),
          filter: isHovered
            ? "drop-shadow(0 18px 36px rgba(0, 0, 0, 0.22))"
            : "none",
        }}
      />
    </button>
  );
}

export function ProductSlideshow({ products }: ProductSlideshowProps) {
  const items = useMemo(
    () => (products && products.length > 0 ? products : getHomeProductSlideshowItems()),
    [products],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const wheelCooldown = useRef(false);

  const [mode, setMode] = useState<Mode>("browse");
  const [activeIndex, setActiveIndex] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sizes, setSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((item) => [item.slug, item.sizes[1] ?? item.sizes[0]])),
  );
  const [colors, setColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((item) => [item.slug, item.colors[0]?.name ?? ""])),
  );

  const goNext = useCallback(() => {
    setActiveIndex((current) => Math.min(items.length - 1, current + 1));
  }, [items.length]);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => Math.max(0, current - 1));
  }, []);

  const handleDressClick = (index: number) => {
    if (mode === "browse") {
      setActiveIndex(index);
      setMode("detail");
      return;
    }

    if (index === activeIndex) {
      setMode("browse");
      setHoveredIndex(null);
      return;
    }

    setActiveIndex(index);
  };

  useEffect(() => {
    if (mode !== "detail") return;

    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (wheelCooldown.current) return;

      const delta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 8) return;

      wheelCooldown.current = true;
      if (delta > 0) goNext();
      else goPrevious();

      window.setTimeout(() => {
        wheelCooldown.current = false;
      }, WHEEL_COOLDOWN_MS);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [mode, goNext, goPrevious]);

  useEffect(() => {
    if (mode !== "detail") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMode("browse");
        setHoveredIndex(null);
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        goNext();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        goPrevious();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, goNext, goPrevious]);

  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const activeSize = sizes[active.slug] ?? active.sizes[0];
  const activeColor = colors[active.slug] ?? active.colors[0]?.name ?? "";
  const centerOffset = (items.length - 1) / 2;
  const trackShift = mode === "detail" ? (centerOffset - activeIndex) * SLOT_VW : 0;

  return (
    <div
      ref={rootRef}
      className={`ps-root ps-root--${mode}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="ps-word-stage">
        <div className="ps-word-row" aria-hidden="true">
          {LETTER_LAYOUT.map((column, columnIndex) => {
            const dressIndex = column.dressIndex;
            const item = dressIndex !== null ? items[dressIndex] : null;

            return (
              <div
                key={`${column.char}-${columnIndex}`}
                className="ps-letter-col"
              >
                <span className="ps-backdrop-char">{column.char}</span>
                {item && dressIndex !== null && mode === "browse" && (
                  <DressButton
                    item={item}
                    index={dressIndex}
                    mode={mode}
                    activeIndex={activeIndex}
                    hoveredIndex={hoveredIndex}
                    onClick={() => handleDressClick(dressIndex)}
                    onHover={() => setHoveredIndex(dressIndex)}
                    onLeave={() => setHoveredIndex(null)}
                    className="ps-slot--on-letter"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {mode === "detail" && (
          <motion.div
            key="panel-wrap"
            className="ps-panel-wrap"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={SPRING}
          >
            <InfoPanel
              product={active}
              activeSize={activeSize}
              activeColor={activeColor}
              onSizeChange={(size) =>
                setSizes((prev) => ({ ...prev, [active.slug]: size }))
              }
              onColorChange={(color) =>
                setColors((prev) => ({ ...prev, [active.slug]: color }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "detail" && (
        <div className="ps-stage">
          <motion.div
            className="ps-track"
            animate={{ x: `${trackShift}vw` }}
            transition={SPRING}
            drag="x"
            dragConstraints={{ left: -80, right: 80 }}
            dragElastic={0.12}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const threshold = 40;
              const velocityThreshold = 280;
              if (
                info.offset.x < -threshold ||
                info.velocity.x < -velocityThreshold
              ) {
                goNext();
              } else if (
                info.offset.x > threshold ||
                info.velocity.x > velocityThreshold
              ) {
                goPrevious();
              }
            }}
          >
            {items.map((item, index) => (
              <DressButton
                key={item.slug}
                item={item}
                index={index}
                mode={mode}
                activeIndex={activeIndex}
                hoveredIndex={hoveredIndex}
                onClick={() => handleDressClick(index)}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                className="ps-slot"
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ProductSlideshow;
