"use client";

import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { arcCarouselCollections } from "@/data/arcCarouselCollections";
import "./CircularGallery.css";

const VB_WIDTH = 1000;
const VB_HEIGHT = 520;
const CX = VB_WIDTH / 2;
const CY = 500;
const START_ANGLE = -180;
const SWEEP_ANGLE = 180;
const GAP_DEGREES = 0;
const INNER_RADIUS_RATIO = 0.56;
const OUTER_PADDING = 8;
const CORNER_RADIUS = 10;
const STROKE_WIDTH = 2;
const HOVER_SCALE = 1.02;
const HOVER_OFFSET_RATIO = 0.06;
const HOVER_DURATION = 0.35;
const TEXT_FADE = 0.25;
const LOAD_STAGGER = 0.08;
const LOAD_DURATION = 0.8;

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

function innerRadiusRatioForWidth(width: number) {
  if (width <= 480) return 0.54;
  if (width <= 900) return 0.55;
  return INNER_RADIUS_RATIO;
}

export function CircularGallery() {
  const items = arcCarouselCollections.slice(0, 7);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(1200);
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

  const innerRatio = innerRadiusRatioForWidth(stageWidth);
  const count = items.length;
  const totalGap = GAP_DEGREES * Math.max(0, count - 1);
  const usableSweep =
    SWEEP_ANGLE >= 0
      ? Math.max(0, SWEEP_ANGLE - totalGap)
      : Math.min(0, SWEEP_ANGLE + totalGap);
  const seg = usableSweep / count;
  const outerR = VB_WIDTH / 2 - OUTER_PADDING;
  const innerR = clamp(innerRatio, 0.05, 0.95) * outerR;

  const wedges = useMemo(() => {
    const list: {
      path: string;
      clipId: string;
      midAngle: number;
      index: number;
    }[] = [];

    for (let i = 0; i < count; i += 1) {
      const a0 =
        START_ANGLE + i * (seg + (SWEEP_ANGLE >= 0 ? GAP_DEGREES : -GAP_DEGREES));
      const a1 = a0 + seg;
      list.push({
        path: arcPath(CX, CY, outerR, innerR, a0, a1, CORNER_RADIUS),
        clipId: `cg_clip_${i}`,
        midAngle: (a0 + a1) / 2,
        index: i,
      });
    }

    return list;
  }, [count, seg, outerR, innerR]);

  const defaultIndex = Math.floor(count / 2);
  const activeIndex = hoveredIndex ?? defaultIndex;
  const activeItem = items[activeIndex] ?? items[0];

  const orderedWedges = useMemo(() => {
    if (hoveredIndex === null) return wedges;
    const hovered = wedges.find((w) => w.index === hoveredIndex);
    if (!hovered) return wedges;
    return [...wedges.filter((w) => w.index !== hoveredIndex), hovered];
  }, [wedges, hoveredIndex]);

  return (
    <section className="cg-hero" aria-label="Collections circular gallery">
      <div className="cg-hero__inner">
        <div className="cg-stage" ref={stageRef}>
          <svg
            className="cg-svg"
            viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden={false}
            onPointerLeave={() => {
              startTransition(() => setHoveredIndex(null));
            }}
          >
            <defs>
              {wedges.map((wedge) => (
                <clipPath key={wedge.clipId} id={wedge.clipId}>
                  <path d={wedge.path} />
                </clipPath>
              ))}
            </defs>

            <g className="cg-wedges">
              {orderedWedges.map((wedge) => {
                const item = items[wedge.index];
                const midRad = degToRad(wedge.midAngle);
                const hoverX =
                  Math.cos(midRad) * outerR * HOVER_OFFSET_RATIO;
                const hoverY =
                  Math.sin(midRad) * outerR * HOVER_OFFSET_RATIO;

                return (
                  <motion.g
                    key={item.title}
                    className="cg-wedge"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      opacity: {
                        duration: LOAD_DURATION,
                        delay: wedge.index * LOAD_STAGGER,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    style={{
                      transformOrigin: `${CX}px ${CY}px`,
                      transformBox: "view-box",
                    }}
                    onHoverStart={() => {
                      startTransition(() => setHoveredIndex(wedge.index));
                    }}
                    onHoverEnd={() => {
                      startTransition(() => setHoveredIndex(null));
                    }}
                    whileHover={{
                      scale: HOVER_SCALE,
                      x: hoverX,
                      y: hoverY,
                      filter: "brightness(1.06)",
                      transition: {
                        duration: HOVER_DURATION,
                        ease: [0, 0, 0.2, 1],
                      },
                    }}
                  >
                    <g clipPath={`url(#${wedge.clipId})`}>
                      <image
                        href={item.image}
                        x={0}
                        y={0}
                        width={VB_WIDTH}
                        height={VB_WIDTH}
                        preserveAspectRatio="xMidYMid slice"
                        className="cg-wedge__image"
                      />
                    </g>
                    <path
                      d={wedge.path}
                      fill="none"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth={STROKE_WIDTH}
                      vectorEffect="non-scaling-stroke"
                      pointerEvents="none"
                    />
                    <path
                      d={wedge.path}
                      fill="transparent"
                      stroke="none"
                      className="cg-wedge__hit"
                      role="img"
                      aria-label={item.imageAlt}
                    />
                  </motion.g>
                );
              })}
            </g>
          </svg>

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
