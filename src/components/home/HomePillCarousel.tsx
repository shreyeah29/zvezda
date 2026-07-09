"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import SplitText from "@/components/ui/SplitText";
import TextType from "@/components/ui/TextType";
import "./PillCarousel.css";

const AUTOPLAY_MS = 4200;
const TRANSITION = 0.65;

type CardStyle = {
  left: string;
  top: string;
  scale: number;
  zIndex: number;
  opacity: number;
  blur: number;
  brightness: number;
};

/** Diagonal 3D cascade — ported from the Framer PillCarousel layout. */
function getCardStyle(index: number, current: number, count: number, hovered: boolean): CardStyle {
  const diff = (index - current + count) % count;
  const hoverScale = hovered ? 1.05 : 1;
  const hoverBrightness = hovered ? 1.15 : 1;

  if (diff === 0) {
    return { left: "50%", top: "50%", scale: 1, zIndex: 50, opacity: 1, blur: 0, brightness: 1 };
  }
  if (diff === 1 || diff === -count + 1) {
    return { left: "88%", top: "34%", scale: 0.85 * hoverScale, zIndex: 40, opacity: hovered ? 1 : 0.95, blur: 0.5, brightness: hoverBrightness };
  }
  if (diff === 2 || diff === -count + 2) {
    return { left: "122%", top: "22%", scale: 0.7 * hoverScale, zIndex: 30, opacity: hovered ? 0.9 : 0.85, blur: 1.5, brightness: hoverBrightness };
  }
  if (diff === count - 1 || diff === -1) {
    return { left: "12%", top: "66%", scale: 0.85 * hoverScale, zIndex: 40, opacity: hovered ? 1 : 0.95, blur: 0.5, brightness: hoverBrightness };
  }
  if (diff === count - 2 || diff === -2) {
    return { left: "-22%", top: "78%", scale: 0.7 * hoverScale, zIndex: 30, opacity: hovered ? 0.9 : 0.85, blur: 1.5, brightness: hoverBrightness };
  }
  return { left: "50%", top: "50%", scale: 0.5, zIndex: 10, opacity: 0, blur: 3, brightness: 1 };
}

function getShortDescription(story: string) {
  const firstSentence = story.split(".")[0]?.trim();
  return firstSentence ? `${firstSentence}.` : story;
}

export const HomePillCarousel = forwardRef<HTMLElement>(function HomePillCarousel(_, ref) {
  const items = useMemo(() => products, []);
  const count = items.length;
  const [current, setCurrent] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [nameComplete, setNameComplete] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, count]);

  const active = items[current];
  const shortDescription = active ? getShortDescription(active.story) : "";

  useEffect(() => {
    setNameComplete(false);
  }, [active?.slug]);

  return (
    <section
      ref={ref}
      className="pill-carousel snap-none"
      aria-label="Collection explorer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pill-carousel__ambient" aria-hidden="true" />

      <p className="editorial-spacing pill-carousel__eyebrow">The Collection</p>

      <div className="pill-carousel__layout">
        <div className="pill-carousel__stage">
        {items.map((product, index) => {
          const isCenter = (index - current + count) % count === 0;
          const cs = getCardStyle(index, current, count, hoveredIndex === index);

          return (
            <div
              key={product.slug}
              className={`pill-carousel__card ${isCenter ? "is-center" : ""}`}
              style={{
                left: cs.left,
                top: cs.top,
                zIndex: cs.zIndex,
                opacity: cs.opacity,
                transform: `translate(-50%, -50%) scale(${cs.scale})`,
                filter: `blur(${cs.blur}px) brightness(${cs.brightness})`,
                transition: `all ${TRANSITION}s cubic-bezier(0.4, 0, 0.2, 1)`,
                cursor: isCenter ? "default" : "pointer",
              }}
              onClick={() => !isCenter && setCurrent(index)}
              onMouseEnter={() => !isCenter && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-hidden={cs.opacity === 0}
            >
              <div className="pill-carousel__card-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.hero}
                  alt={product.name}
                  draggable={false}
                  loading={index < 4 ? "eager" : "lazy"}
                />
              </div>
            </div>
          );
        })}

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="pill-carousel__pill"
            initial={{ opacity: 0, x: "-50%", y: 16, scale: 0.85 }}
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: 16, scale: 0.85 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link href={`/products/${active?.slug}`} data-cursor="VIEW">
              View Product
            </Link>
            <span className="pill-carousel__pill-arrow" aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </div>

        <div className="pill-carousel__side">
          <div className="pill-carousel__meta">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SplitText
              key={`name-${active?.slug}`}
              tag="h2"
              text={active?.name ?? ""}
              className="pill-carousel__name"
              delay={38}
              duration={0.85}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 34, rotateX: -35 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              textAlign="left"
              onLetterAnimationComplete={() => setNameComplete(true)}
            />
            {nameComplete && (
              <TextType
                key={`desc-${active?.slug}`}
                as="p"
                text={shortDescription}
                className="pill-carousel__desc"
                typingSpeed={18}
                initialDelay={140}
                loop={false}
                showCursor
                cursorCharacter="|"
                cursorClassName="pill-carousel__desc-cursor"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

          <div className="pill-carousel__controls">
        <span className="pill-carousel__counter">
          {String(current + 1).padStart(2, "0")} <i>/</i> {String(count).padStart(2, "0")}
        </span>
        <div className="pill-carousel__arrows">
          <button type="button" className="pill-carousel__arrow" onClick={prev} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <button type="button" className="pill-carousel__arrow" onClick={next} aria-label="Next">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
});
