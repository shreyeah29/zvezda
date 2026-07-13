"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { arcCarouselCollections } from "@/data/arcCarouselCollections";
import "./CircularGallery.css";

/** Tangent rotations / polar offsets from top-center (−90°). */
const CARD_ANGLES = [-54, -36, -18, 0, 18, 36, 54] as const;

const CARD_WIDTH = 190;
const CARD_HEIGHT = 260;
const RADIUS = 520;
const LOAD_STAGGER = 0.08;
const LOAD_DURATION = 0.8;
const HOVER_DURATION = 0.35;
const TEXT_FADE = 0.25;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function CircularGallery() {
  const items = arcCarouselCollections.slice(0, 7);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = useMemo(() => {
    return items.map((item, index) => {
      const offset = CARD_ANGLES[index] ?? 0;
      const polarDeg = -90 + offset;
      const rad = degToRad(polarDeg);
      return {
        item,
        index,
        rotation: offset,
        x: Math.cos(rad) * RADIUS,
        y: Math.sin(rad) * RADIUS,
      };
    });
  }, [items]);

  const activeIndex = hoveredIndex ?? Math.floor(items.length / 2);
  const activeItem = items[activeIndex] ?? items[0];

  const stageHeight = RADIUS + CARD_HEIGHT * 0.35 + 160;
  const stageWidth = RADIUS * 2 + CARD_WIDTH;

  return (
    <section className="cg-hero" aria-label="Collections gallery">
      <div className="cg-hero__inner">
        <div
          className="cg-stage"
          style={
            {
              "--cg-radius": `${RADIUS}px`,
              "--cg-card-w": `${CARD_WIDTH}px`,
              "--cg-card-h": `${CARD_HEIGHT}px`,
              "--cg-stage-w": `${stageWidth}px`,
              "--cg-stage-h": `${stageHeight}px`,
              "--cg-origin-y": `${RADIUS}px`,
            } as CSSProperties
          }
        >
          <div className="cg-stage__arc">
            {cards.map(({ item, index, rotation, x, y }) => (
              <motion.div
                key={item.title}
                className="cg-card"
                initial={{ opacity: 0, y: 40, rotate: rotation }}
                animate={{ opacity: 1, y: 0, rotate: rotation }}
                transition={{
                  duration: LOAD_DURATION,
                  delay: index * LOAD_STAGGER,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={
                  {
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    left: `calc(50% + ${x}px - ${CARD_WIDTH / 2}px)`,
                    top: `calc(var(--cg-origin-y) + ${y}px - ${CARD_HEIGHT / 2}px)`,
                  } as CSSProperties
                }
              >
                <motion.button
                  type="button"
                  className="cg-card__hit"
                  aria-label={item.imageAlt}
                  aria-pressed={hoveredIndex === index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  whileHover={{
                    y: -16,
                    scale: 1.06,
                    filter: "brightness(1.05)",
                    boxShadow: "0 35px 70px rgba(0,0,0,0.18)",
                  }}
                  transition={{
                    duration: HOVER_DURATION,
                    ease: "easeOut",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="cg-card__img"
                    draggable={false}
                  />
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="cg-copy" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeItem.title}-${activeIndex}`}
                className="cg-copy__inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: TEXT_FADE, ease: "easeOut" }}
              >
                <h2 className="cg-copy__title">{activeItem.title}</h2>
                <p className="cg-copy__subtitle">{activeItem.subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CircularGallery;
