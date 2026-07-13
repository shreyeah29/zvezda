"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import { getShowcaseImageTrailItems } from "@/data/homeShowcaseImageTrail";
import type { SlideshowProduct } from "./types";
import {
  DRESS_SPRING,
  getDressEntranceDelay,
  getLetterEntranceDelay,
  LETTER_SPRING,
  PANEL_SPRING,
} from "./useShowcaseEntrance";
import ImageTrail from "@/components/ui/ImageTrail/ImageTrail";
import { ShowcaseGalleryFrame } from "./ShowcaseGalleryFrame";
import "./ProductSlideshow.css";

const SPRING = {
  type: "spring" as const,
  stiffness: 160,
  damping: 18,
  mass: 1,
};

const BROWSE_DRESS_HEIGHT = "19.2vh";
const BROWSE_HERO_DRESS_HEIGHT = "21.1vh";
const HERO_DRESS_INDEX = 2;
const SLOT_VW = 13;
const WHEEL_COOLDOWN_MS = 520;

/** Z V E Z D A — dresses on Z, V, gaps E–Z & Z–D, and A. */
const LETTER_LAYOUT = [
  { char: "Z", dressIndex: 0 },
  { char: "V", dressIndex: 1 },
  { char: "E", dressIndex: null },
  { char: "Z", dressIndex: null },
  { char: "D", dressIndex: null },
  { char: "A", dressIndex: 3 },
] as const;

/** Dresses anchored in the space after a letter column. */
const GAPS_AFTER_COLUMN: Record<number, readonly number[]> = {
  2: [2],
  3: [4],
};

type Mode = "browse" | "detail";

type ProductSlideshowProps = {
  products?: SlideshowProduct[];
  entranceStarted?: boolean;
  lettersStarted?: boolean;
  entranceComplete?: boolean;
};

function buildLetterRotations(): number[] {
  return LETTER_LAYOUT.map(() => Math.random() * 4 - 2);
}

function InfoPanel({
  product,
  activeSize,
  activeColor,
  onSizeChange,
  onColorChange,
  skipEntranceMotion,
}: {
  product: SlideshowProduct;
  activeSize: string;
  activeColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  skipEntranceMotion?: boolean;
}) {
  return (
    <aside className="ps-panel">
      <div className="ps-panel__block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={`title-${product.slug}`}
            className="ps-panel__title"
            initial={skipEntranceMotion ? false : { y: 16, opacity: 0 }}
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
            initial={skipEntranceMotion ? false : { opacity: 0 }}
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
            initial={skipEntranceMotion ? false : { opacity: 0, y: 6 }}
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
          initial={skipEntranceMotion ? false : { opacity: 0 }}
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
  entranceStarted = true,
  lettersStarted = true,
  entranceComplete = true,
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
  entranceStarted?: boolean;
  lettersStarted?: boolean;
  entranceComplete?: boolean;
}) {
  const isHovered = hoveredIndex === index;
  const isDimmed = mode === "browse" && hoveredIndex !== null && !isHovered;
  const isHeroDress = index === HERO_DRESS_INDEX;
  const detailMetrics =
    mode === "detail" ? detailDressMetrics(index, activeIndex) : null;

  const browseHeight = isHeroDress ? BROWSE_HERO_DRESS_HEIGHT : BROWSE_DRESS_HEIGHT;
  const dressDelay = getDressEntranceDelay(index);
  const showBrowseEntrance = mode === "browse" && !entranceComplete;

  const browseEntranceAnimate = lettersStarted
    ? {
        height: browseHeight,
        opacity: 1,
        y: 0,
        scale: 1,
      }
    : {
        height: browseHeight,
        opacity: 0,
        y: 25,
        scale: 0.95,
      };

  return (
    <button
      type="button"
      className={className}
      aria-label={`View ${item.title}`}
      aria-pressed={mode === "detail" && index === activeIndex}
      onClick={onClick}
      onMouseEnter={() => entranceComplete && onHover()}
      onMouseLeave={() => entranceComplete && onLeave()}
      style={{ pointerEvents: entranceComplete ? "auto" : "none" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={item.image}
        alt={item.alt}
        className="ps-image"
        draggable={false}
        initial={
          showBrowseEntrance
            ? { opacity: 0, y: 25, scale: 0.95, height: browseHeight }
            : false
        }
        animate={
          mode === "browse"
            ? showBrowseEntrance
              ? browseEntranceAnimate
              : {
                  height: browseHeight,
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
        transition={
          showBrowseEntrance
            ? { ...DRESS_SPRING, delay: dressDelay }
            : entranceComplete
              ? SPRING
              : { duration: 0 }
        }
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

export function ProductSlideshow({
  products,
  entranceStarted = true,
  lettersStarted = true,
  entranceComplete = true,
}: ProductSlideshowProps) {
  const items = useMemo(
    () => (products && products.length > 0 ? products : getHomeProductSlideshowItems()),
    [products],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const wheelCooldown = useRef(false);
  const letterRotations = useRef(buildLetterRotations()).current;

  const [mode, setMode] = useState<Mode>("browse");
  const [activeIndex, setActiveIndex] = useState(HERO_DRESS_INDEX);
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
    if (!entranceComplete) return;

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

  const trailImages = useMemo(() => getShowcaseImageTrailItems(), []);

  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const activeSize = sizes[active.slug] ?? active.sizes[0];
  const activeColor = colors[active.slug] ?? active.colors[0]?.name ?? "";
  const centerOffset = (items.length - 1) / 2;
  const trackShift = mode === "detail" ? (centerOffset - activeIndex) * SLOT_VW : 0;
  const showLetterEntrance = !entranceComplete;
  const showImageTrail = mode === "browse" && entranceComplete;

  return (
    <div
      ref={rootRef}
      className={`ps-root ps-root--${mode}`}
      onMouseLeave={() => entranceComplete && setHoveredIndex(null)}
    >
      {showImageTrail && (
        <ImageTrail
          items={trailImages}
          variant={5}
          eventTargetRef={rootRef}
        />
      )}

      <ShowcaseGalleryFrame
        visible={entranceStarted}
        active={mode === "browse"}
      />

      <div className="ps-word-stage">
        <div className="ps-word-row" aria-hidden="true">
          {LETTER_LAYOUT.map((column, columnIndex) => {
            const dressIndex = column.dressIndex;
            const item = dressIndex !== null ? items[dressIndex] : null;
            const gapDresses = GAPS_AFTER_COLUMN[columnIndex] ?? [];

            return (
              <Fragment key={`${column.char}-${columnIndex}`}>
                <div className="ps-letter-col">
                  <motion.span
                    className="ps-backdrop-char"
                    initial={
                      showLetterEntrance
                        ? {
                            y: -180,
                            opacity: 0,
                            filter: "blur(8px)",
                            rotate: letterRotations[columnIndex] ?? 0,
                          }
                        : false
                    }
                    animate={
                      lettersStarted || entranceComplete
                        ? {
                            y: 0,
                            opacity: 0.08,
                            filter: "blur(0px)",
                            rotate: 0,
                          }
                        : {
                            y: -180,
                            opacity: 0,
                            filter: "blur(8px)",
                            rotate: letterRotations[columnIndex] ?? 0,
                          }
                    }
                    transition={{
                      ...LETTER_SPRING,
                      delay: getLetterEntranceDelay(columnIndex),
                    }}
                  >
                    {column.char}
                  </motion.span>
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
                      entranceStarted={lettersStarted}
                      entranceComplete={entranceComplete}
                    />
                  )}
                </div>
                {gapDresses.map((gapDressIndex) => {
                  const gapItem = items[gapDressIndex];
                  if (!gapItem || mode !== "browse") return null;

                  return (
                    <div
                      key={`gap-${columnIndex}-${gapDressIndex}`}
                      className="ps-gap-col"
                    >
                      <DressButton
                        item={gapItem}
                        index={gapDressIndex}
                        mode={mode}
                        activeIndex={activeIndex}
                        hoveredIndex={hoveredIndex}
                        onClick={() => handleDressClick(gapDressIndex)}
                        onHover={() => setHoveredIndex(gapDressIndex)}
                        onLeave={() => setHoveredIndex(null)}
                        className="ps-slot--on-letter"
                        entranceStarted={lettersStarted}
                        entranceComplete={entranceComplete}
                      />
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {mode === "detail" && (
          <motion.div
            key="panel-wrap"
            className="ps-panel-wrap"
            initial={
              entranceComplete ? { opacity: 0, y: 10 } : { opacity: 0, x: -16 }
            }
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={entranceComplete ? PANEL_SPRING : SPRING}
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
              skipEntranceMotion={!entranceComplete}
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
                key={`${item.slug}-${item.image}`}
                item={item}
                index={index}
                mode={mode}
                activeIndex={activeIndex}
                hoveredIndex={hoveredIndex}
                onClick={() => handleDressClick(index)}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                className="ps-slot"
                entranceStarted={lettersStarted}
                entranceComplete={entranceComplete}
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ProductSlideshow;
