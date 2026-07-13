"use client";

import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { arcCarouselCollections } from "@/data/arcCarouselCollections";
import "./CircularGallery.css";

const VB = 1000;
const START_ANGLE = -180;
const SWEEP_ANGLE = 180;
const GAP_DEGREES = 3;
const OUTER_PADDING = 8;
const CORNER_RADIUS = 10;
const HOVER_SCALE = 1.06;
const HOVER_DURATION = 0.35;
const TEXT_FADE_DURATION = 0.25;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = degToRad(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
  cornerRadius: number,
) {
  const sweep = a1 - a0;
  const absSweep = Math.abs(sweep);
  const largeArc = absSweep > 180 ? 1 : 0;
  const sweepFlagOuter = sweep >= 0 ? 1 : 0;
  const sweepFlagInner = sweep >= 0 ? 0 : 1;

  const p0o = polar(cx, cy, rOuter, a0);
  const p1o = polar(cx, cy, rOuter, a1);
  const p0i = polar(cx, cy, rInner, a0);
  const p1i = polar(cx, cy, rInner, a1);

  const cr = clamp(cornerRadius, 0, Math.max(0, (rOuter - rInner) * 0.48));
  if (cr <= 0) {
    return [
      `M ${p0o.x} ${p0o.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} ${sweepFlagOuter} ${p1o.x} ${p1o.y}`,
      `L ${p1i.x} ${p1i.y}`,
      `A ${rInner} ${rInner} 0 ${largeArc} ${sweepFlagInner} ${p0i.x} ${p0i.y}`,
      "Z",
    ].join(" ");
  }

  const insetOuter = (cr / rOuter) * (180 / Math.PI);
  const insetInner = (cr / rInner) * (180 / Math.PI);
  const a0o = a0 + (sweep >= 0 ? insetOuter : -insetOuter);
  const a1o = a1 - (sweep >= 0 ? insetOuter : -insetOuter);
  const a0i = a0 + (sweep >= 0 ? insetInner : -insetInner);
  const a1i = a1 - (sweep >= 0 ? insetInner : -insetInner);

  const q0o = polar(cx, cy, rOuter, a0o);
  const q1o = polar(cx, cy, rOuter, a1o);
  const q0i = polar(cx, cy, rInner, a0i);
  const q1i = polar(cx, cy, rInner, a1i);
  const p0oIn = polar(cx, cy, rOuter, a0);
  const p1oIn = polar(cx, cy, rOuter, a1);
  const p0iIn = polar(cx, cy, rInner, a0);
  const p1iIn = polar(cx, cy, rInner, a1);
  const cornerArc = cr;

  return [
    `M ${q0o.x} ${q0o.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} ${sweepFlagOuter} ${q1o.x} ${q1o.y}`,
    `A ${cornerArc} ${cornerArc} 0 0 ${sweepFlagOuter} ${p1iIn.x} ${p1iIn.y}`,
    `L ${q1i.x} ${q1i.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} ${sweepFlagInner} ${q0i.x} ${q0i.y}`,
    `A ${cornerArc} ${cornerArc} 0 0 ${sweepFlagOuter} ${p0oIn.x} ${p0oIn.y}`,
    "Z",
  ].join(" ");
}

function useInnerRadiusRatio(width: number) {
  if (width <= 480) return 0.52;
  if (width <= 768) return 0.54;
  return 0.56;
}

export function CircularGallery() {
  const items = arcCarouselCollections;
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(900);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) setStageWidth(width);
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const innerRadiusRatio = useInnerRadiusRatio(stageWidth);
  const count = items.length;
  const totalGap = GAP_DEGREES * Math.max(0, count - 1);
  const usableSweep =
    SWEEP_ANGLE >= 0
      ? Math.max(0, SWEEP_ANGLE - totalGap)
      : Math.min(0, SWEEP_ANGLE + totalGap);
  const seg = usableSweep / count;

  const cx = VB / 2;
  const cy = VB / 2;
  const outerR = VB / 2 - OUTER_PADDING;
  const innerR = clamp(innerRadiusRatio, 0.05, 0.95) * outerR;
  const hoverLiftVb = 14;

  const wedges = useMemo(() => {
    const list: {
      path: string;
      fillId: string;
      midAngle: number;
      index: number;
    }[] = [];

    for (let i = 0; i < count; i += 1) {
      const a0 =
        START_ANGLE + i * (seg + (SWEEP_ANGLE >= 0 ? GAP_DEGREES : -GAP_DEGREES));
      const a1 = a0 + seg;
      const path = arcPath(cx, cy, outerR, innerR, a0, a1, CORNER_RADIUS);
      list.push({
        path,
        fillId: `cg_img_${i}`,
        midAngle: (a0 + a1) / 2,
        index: i,
      });
    }

    return list;
  }, [count, seg, cx, cy, outerR, innerR]);

  const activeIndex = hoveredIndex ?? 0;
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <section className="circular-gallery-hero" aria-label="Collections circular gallery">
      <div className="circular-gallery-hero__stage" ref={stageRef}>
        <svg
          className="circular-gallery-hero__svg"
          viewBox={`0 0 ${VB} ${VB}`}
          aria-hidden="true"
          onPointerLeave={() => {
            startTransition(() => setHoveredIndex(null));
          }}
        >
          <defs>
            {items.map((item, i) => (
              <pattern
                key={item.title}
                id={`cg_img_${i}`}
                patternUnits="objectBoundingBox"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <image
                  href={item.image}
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                  preserveAspectRatio="xMidYMid meet"
                />
              </pattern>
            ))}
          </defs>

          <g>
            {wedges.map((wedge) => {
              const item = items[wedge.index];
              const midRad = degToRad(wedge.midAngle);
              const hoverX = Math.cos(midRad) * hoverLiftVb * 0.35;
              const hoverY = Math.sin(midRad) * hoverLiftVb * 0.35 - hoverLiftVb * 0.55;

              return (
                <motion.path
                  key={item.title}
                  d={wedge.path}
                  fill={`url(#${wedge.fillId})`}
                  stroke="#ffffff"
                  strokeWidth={2}
                  role="img"
                  aria-label={item.imageAlt}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transformBox: "fill-box",
                    cursor: "pointer",
                  }}
                  onHoverStart={() => {
                    startTransition(() => setHoveredIndex(wedge.index));
                  }}
                  whileHover={{
                    scale: HOVER_SCALE,
                    x: hoverX,
                    y: hoverY,
                    filter:
                      "brightness(1.08) saturate(1.1) drop-shadow(0 10px 28px rgba(0,0,0,0.16))",
                  }}
                  transition={{
                    duration: HOVER_DURATION,
                    ease: [0, 0, 0.2, 1],
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="circular-gallery-hero__content" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeItem.title}-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TEXT_FADE_DURATION, ease: "easeOut" }}
          >
            <h2 className="circular-gallery-hero__title">{activeItem.title}</h2>
            <p className="circular-gallery-hero__subtitle">{activeItem.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default CircularGallery;
