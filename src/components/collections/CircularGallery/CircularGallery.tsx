"use client";

import { useEffect, useMemo, useRef, useState, startTransition, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { arcCarouselCollections } from "@/data/arcCarouselCollections";
import { getShowcaseImageTrailItems } from "@/data/homeShowcaseImageTrail";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import ImageTrail from "@/components/ui/ImageTrail/ImageTrail";
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
/** Sharp radial wedges — no rounded corner arcs (those create capsule/blob shapes). */
const CORNER_RADIUS = 0;
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

/** Annular sector — outer arc, radial sides, inner arc. Straight radial edges. */
function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
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

  return [
    `M ${p0o.x} ${p0o.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} ${sweepFlagOuter} ${p1o.x} ${p1o.y}`,
    `L ${p1i.x} ${p1i.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} ${sweepFlagInner} ${p0i.x} ${p0i.y}`,
    "Z",
  ].join(" ");
}

type WedgePatternFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  preserveAspectRatio: "xMidYMin slice" | "xMidYMid slice" | "xMaxYMid slice";
};

/** Per-segment focal tweaks — only where the default crop misses the subject. */
const WEDGE_IMAGE_OVERRIDES: Partial<Record<number, Partial<WedgePatternFrame>>> = {
  // Emerald Reverie — green gown, far left wedge
  0: {
    x: -0.02,
    y: -0.12,
    width: 1.45,
    height: 2.15,
    preserveAspectRatio: "xMidYMid slice",
  },
  // Amber Solstice — HSP_2889, shift left so right edge isn't clipped
  1: {
    x: -0.06,
    y: -0.02,
    width: 1.1,
    height: 1.05,
    preserveAspectRatio: "xMidYMid slice",
  },
};

/**
 * Pattern-space image frame inside each wedge bbox.
 * Tall, top-anchored crop (cover) so dresses stay visible — not face-only.
 */
function wedgePatternImage(
  index: number,
  count: number,
  stageWidth: number,
): WedgePatternFrame {
  const center = (count - 1) / 2;
  const offsetFromCenter = (index - center) / Math.max(center, 1);
  const mobile = stageWidth <= 480;
  const tablet = stageWidth <= 768;

  const defaults: WedgePatternFrame = {
    width: mobile ? 1.38 : tablet ? 1.34 : 1.3,
    height: mobile ? 2.25 : tablet ? 2.18 : 2.1,
    x: (1 - (mobile ? 1.38 : tablet ? 1.34 : 1.3)) / 2 - offsetFromCenter * (mobile ? 0.05 : 0.06),
    y: mobile ? -0.38 : -0.42,
    preserveAspectRatio: "xMidYMin slice",
  };

  return { ...defaults, ...WEDGE_IMAGE_OVERRIDES[index] };
}

function innerRadiusRatioForWidth(width: number) {
  if (width <= 380) return 0.52;
  if (width <= 480) return 0.535;
  if (width <= 600) return 0.545;
  if (width <= 900) return 0.55;
  return INNER_RADIUS_RATIO;
}

function hoverOffsetRatioForWidth(width: number) {
  if (width <= 480) return 0.038;
  if (width <= 768) return 0.048;
  return HOVER_OFFSET_RATIO;
}

function strokeWidthForWidth(width: number) {
  if (width <= 480) return 1.5;
  return STROKE_WIDTH;
}

export function CircularGallery() {
  const items = arcCarouselCollections.slice(0, 7);
  const isMobile = useMaxWidth(768);
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trailImages = useMemo(() => getShowcaseImageTrailItems(), []);
  const [stageWidth, setStageWidth] = useState(1200);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pointerDownRef = useRef<{ index: number; x: number; y: number } | null>(null);

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
  const hoverOffsetRatio = hoverOffsetRatioForWidth(stageWidth);
  const strokeW = strokeWidthForWidth(stageWidth);
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
      patternId: string;
      midAngle: number;
      index: number;
    }[] = [];

    for (let i = 0; i < count; i += 1) {
      const a0 =
        START_ANGLE + i * (seg + (SWEEP_ANGLE >= 0 ? GAP_DEGREES : -GAP_DEGREES));
      const a1 = a0 + seg;
      list.push({
        path: arcPath(CX, CY, outerR, innerR, a0, a1),
        patternId: `cg_img_${i}`,
        midAngle: (a0 + a1) / 2,
        index: i,
      });
    }

    return list;
  }, [count, seg, outerR, innerR]);

  const defaultIndex = Math.floor(count / 2);
  const activeIndex = hoveredIndex ?? defaultIndex;
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <section ref={heroRef} className="cg-hero" aria-label="Collections circular gallery">
      {!isMobile && (
        <ImageTrail
          items={trailImages}
          variant={5}
          eventTargetRef={heroRef}
          className="cg-image-trail"
        />
      )}
      <div className="cg-hero__inner">
        <div
          className="cg-stage"
          ref={stageRef}
          style={
            {
              "--cg-copy-top": stageWidth <= 480 ? "66%" : stageWidth <= 768 ? "68%" : "70%",
            } as CSSProperties
          }
        >
          <svg
            className="cg-svg"
            viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerLeave={() => {
              startTransition(() => setHoveredIndex(null));
            }}
          >
            <defs>
              {wedges.map((wedge) => {
                const item = items[wedge.index];
                const frame = wedgePatternImage(wedge.index, count, stageWidth);
                const clipId = `cg_pat_clip_${wedge.index}`;
                return (
                  <pattern
                    key={wedge.patternId}
                    id={wedge.patternId}
                    patternUnits="objectBoundingBox"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <clipPath id={clipId}>
                      <rect x="0" y="0" width="1" height="1" />
                    </clipPath>
                    <g clipPath={`url(#${clipId})`}>
                      <image
                        href={item.image}
                        x={frame.x}
                        y={frame.y}
                        width={frame.width}
                        height={frame.height}
                        preserveAspectRatio={frame.preserveAspectRatio}
                      />
                    </g>
                  </pattern>
                );
              })}
            </defs>

            <g className="cg-wedges">
              {wedges.map((wedge) => {
                const item = items[wedge.index];
                const isHovered = hoveredIndex === wedge.index;
                const midRad = degToRad(wedge.midAngle);
                const hoverX =
                  Math.cos(midRad) * outerR * hoverOffsetRatio;
                const hoverY =
                  Math.sin(midRad) * outerR * hoverOffsetRatio;

                return (
                  <motion.path
                    key={item.title}
                    d={wedge.path}
                    fill={`url(#${wedge.patternId})`}
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth={strokeW}
                    strokeLinejoin="miter"
                    role="link"
                    tabIndex={0}
                    aria-label={`View ${item.title} product`}
                    className="cg-wedge"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      scale: isHovered ? HOVER_SCALE : 1,
                      x: isHovered ? hoverX : 0,
                      y: isHovered ? hoverY : 0,
                      filter: isHovered
                        ? "brightness(1.06)"
                        : "brightness(1)",
                    }}
                    transition={{
                      opacity: {
                        duration: LOAD_DURATION,
                        delay: wedge.index * LOAD_STAGGER,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      default: {
                        duration: HOVER_DURATION,
                        ease: [0, 0, 0.2, 1],
                      },
                    }}
                    style={{
                      transformOrigin: `${CX}px ${CY}px`,
                      transformBox: "fill-box",
                      cursor: "pointer",
                    }}
                    onPointerEnter={() => {
                      startTransition(() => setHoveredIndex(wedge.index));
                    }}
                    onPointerDown={(event) => {
                      pointerDownRef.current = {
                        index: wedge.index,
                        x: event.clientX,
                        y: event.clientY,
                      };
                      startTransition(() => setHoveredIndex(wedge.index));
                    }}
                    onPointerUp={(event) => {
                      const start = pointerDownRef.current;
                      pointerDownRef.current = null;
                      if (!start || start.index !== wedge.index) return;
                      const dx = event.clientX - start.x;
                      const dy = event.clientY - start.y;
                      if (dx * dx + dy * dy > 100) return;
                      router.push(`/products/${item.productSlug}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/products/${item.productSlug}`);
                      }
                    }}
                  />
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
