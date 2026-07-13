"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  arcCarouselCollections,
  type ArcCarouselCollection,
} from "@/data/arcCarouselCollections";
import "./ArcImageCarousel.css";

const FOCAL_DEG = -90;
const CARD_SHADOW = "0 10px 30px rgba(0, 0, 0, 0.12)";
const CARD_SHADOW_HOVER = "0 16px 40px rgba(0, 0, 0, 0.14)";
const ACTIVE_SCALE = 1.2;
const INACTIVE_SCALE = 0.86;
const INACTIVE_OPACITY = 0.62;
const ACTIVE_LIFT = 18;
const HOVER_LIFT = 8;
const HOVER_SCALE = 1.03;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function wrapAngleDeg(a: number) {
  let r = a % 360;
  if (r < -180) r += 360;
  if (r > 180) r -= 360;
  return r;
}

function shortestAngleDistanceDeg(a: number, b: number) {
  return Math.abs(wrapAngleDeg(a - b));
}

function cxFromSize(width: number) {
  return width / 2;
}

function pickArcParams(width: number) {
  if (width <= 480) {
    return { spanDeg: 155, radiusFactor: 0.88, tiltDeg: 0 };
  }
  if (width <= 768) {
    return { spanDeg: 205, radiusFactor: 0.78, tiltDeg: 0 };
  }
  return { spanDeg: 245, radiusFactor: 0.72, tiltDeg: 0 };
}

function cardBaseWidth(width: number) {
  if (width <= 480) return clamp(width * 0.52, 160, 240);
  if (width <= 768) return clamp(width * 0.34, 180, 260);
  return clamp(width * 0.24, 190, 280);
}

function cardBaseHeightFromWidth(w: number) {
  return w * 1.25;
}

function getActiveIndex(rotationDeg: number, baseAngles: number[], focalDeg = FOCAL_DEG) {
  let best = 0;
  let bestD = Number.POSITIVE_INFINITY;
  for (let i = 0; i < baseAngles.length; i += 1) {
    const a = baseAngles[i] + rotationDeg;
    const d = shortestAngleDistanceDeg(a, focalDeg);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function rotationToBringIndexToFocal(
  index: number,
  baseAngles: number[],
  focalDeg = FOCAL_DEG,
) {
  const a = baseAngles[index] ?? 0;
  return focalDeg - a;
}

function nearestWrappedRotation(current: number, target: number) {
  const candidates = [target, target + 360, target - 360];
  let best = candidates[0];
  let bestDist = Math.abs(best - current);
  for (const candidate of candidates.slice(1)) {
    const dist = Math.abs(candidate - current);
    if (dist < bestDist) {
      best = candidate;
      bestDist = dist;
    }
  }
  return best;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function softEmphasisFromDistance(distDeg: number, maxDeg: number) {
  const t = clamp(distDeg / maxDeg, 0, 1);
  return 1 - easeOutCubic(t);
}

type ArcItemProps = {
  item: ArcCarouselCollection;
  index: number;
  rotation: MotionValue<number>;
  baseAngles: number[];
  width: number;
  radius: number;
  centerY: number;
  cardW: number;
  cardH: number;
  arcTiltDeg: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
};

function ArcItem({
  item,
  index,
  rotation,
  baseAngles,
  width,
  radius,
  centerY,
  cardW,
  cardH,
  arcTiltDeg,
  isHovered,
  onHover,
  onClick,
}: ArcItemProps) {
  const angleDeg = baseAngles[index] ?? FOCAL_DEG;

  const x = useCallback(
    (rot: number) => {
      const theta = (Math.PI / 180) * (angleDeg + rot + arcTiltDeg);
      const cx = cxFromSize(width);
      return cx + radius * Math.cos(theta) - cardW / 2;
    },
    [angleDeg, arcTiltDeg, width, radius, cardW],
  );

  const y = useCallback(
    (rot: number) => {
      const theta = (Math.PI / 180) * (angleDeg + rot + arcTiltDeg);
      return centerY + radius * Math.sin(theta) - cardH / 2;
    },
    [angleDeg, arcTiltDeg, radius, centerY, cardH],
  );

  const rotateZ = useCallback(
    (rot: number) => angleDeg + rot + arcTiltDeg + 90,
    [angleDeg, arcTiltDeg],
  );

  const scale = useCallback(
    (rot: number) => {
      const a = angleDeg + rot;
      const dist = shortestAngleDistanceDeg(a, FOCAL_DEG);
      const e = softEmphasisFromDistance(dist, 60);
      const base = lerp(INACTIVE_SCALE, ACTIVE_SCALE, e);
      return isHovered ? base * HOVER_SCALE : base;
    },
    [angleDeg, isHovered],
  );

  const opacity = useCallback(
    (rot: number) => {
      const a = angleDeg + rot;
      const dist = shortestAngleDistanceDeg(a, FOCAL_DEG);
      const e = softEmphasisFromDistance(dist, 80);
      return lerp(INACTIVE_OPACITY, 1, e);
    },
    [angleDeg],
  );

  const lift = useCallback(
    (rot: number) => {
      const a = angleDeg + rot;
      const dist = shortestAngleDistanceDeg(a, FOCAL_DEG);
      const e = softEmphasisFromDistance(dist, 55);
      const base = -ACTIVE_LIFT * e;
      return isHovered ? base - HOVER_LIFT : base;
    },
    [angleDeg, isHovered],
  );

  const zIndex = useCallback(
    (rot: number) => {
      const a = angleDeg + rot;
      const dist = shortestAngleDistanceDeg(a, FOCAL_DEG);
      const e = softEmphasisFromDistance(dist, 80);
      return Math.round(10 + e * 1000 + (isHovered ? 50 : 0));
    },
    [angleDeg, isHovered],
  );

  const xMv = useTransform(rotation, x);
  const yMv = useTransform(rotation, y);
  const rMv = useTransform(rotation, rotateZ);
  const sMv = useTransform(rotation, scale);
  const oMv = useTransform(rotation, opacity);
  const liftMv = useTransform(rotation, lift);
  const zMv = useTransform(rotation, zIndex);

  return (
    <motion.button
      type="button"
      className="arc-carousel__card"
      aria-label={`Select ${item.title}`}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(index)}
      style={{
        left: xMv,
        top: yMv,
        width: cardW,
        height: cardH,
        zIndex: zMv,
        scale: sMv,
        rotate: rMv,
        opacity: oMv,
        y: liftMv,
      }}
    >
      <div
        className="arc-carousel__card-inner"
        style={{
          boxShadow: isHovered ? CARD_SHADOW_HOVER : CARD_SHADOW,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.imageAlt}
          className="arc-carousel__card-img"
          draggable={false}
        />
      </div>
    </motion.button>
  );
}

type ArcImageCarouselProps = {
  items?: ArcCarouselCollection[];
};

export function ArcImageCarousel({
  items = arcCarouselCollections,
}: ArcImageCarouselProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentElRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 900, height: 620 });
  const [contentTop, setContentTop] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasEntered, setHasEntered] = useState(reducedMotion ?? false);

  const { spanDeg, radiusFactor, tiltDeg } = useMemo(
    () => pickArcParams(size.width),
    [size.width],
  );

  const baseAngles = useMemo(() => {
    const total = items.length;
    if (total <= 1) return [FOCAL_DEG];
    const step = spanDeg / (total - 1);
    const mid = (total - 1) / 2;
    return Array.from({ length: total }, (_, i) => FOCAL_DEG + (i - mid) * step);
  }, [items.length, spanDeg]);

  const radius = useMemo(() => {
    const r = size.width * radiusFactor;
    return clamp(r, 220, 720);
  }, [size.width, radiusFactor]);

  const centerY = useMemo(() => 140 + radius, [radius]);
  const cardW = useMemo(() => clamp(cardBaseWidth(size.width), 120, 380), [size.width]);
  const cardH = useMemo(() => cardBaseHeightFromWidth(cardW), [cardW]);

  const rotation = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const wheelSnapTimeoutRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const ro = new ResizeObserver((entries) => {
      const cr = entries?.[0]?.contentRect;
      if (!cr) return;
      setSize({
        width: Math.max(1, cr.width),
        height: Math.max(1, cr.height),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setHasEntered(true);
      return;
    }
    const timer = window.setTimeout(() => setHasEntered(true), 60);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (items.length <= 0) return;
    const idx = getActiveIndex(rotation.get(), baseAngles, FOCAL_DEG);
    const target = rotationToBringIndexToFocal(idx, baseAngles, FOCAL_DEG);
    rotation.set(target);
    setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, baseAngles]);

  useMotionValueEvent(rotation, "change", (v) => {
    const next = getActiveIndex(v, baseAngles, FOCAL_DEG);
    if (next !== activeIndexRef.current) {
      setActiveIndex(next);
    }
  });

  useEffect(() => {
    const topOfArc = centerY - radius;
    const bottomOfArc = centerY + radius;
    const safe = Math.min(bottomOfArc - cardH * 0.35, size.height * 0.6);
    const isMobile = size.width <= 480;
    const nextTop =
      Math.max(topOfArc + radius * 0.58, safe) - 48 + (isMobile ? 96 : 0);
    setContentTop(nextTop);
  }, [centerY, radius, cardH, size.height, size.width]);

  const animateRotationTo = useCallback(
    (target: number, onComplete?: () => void) => {
      animRef.current?.stop();
      animRef.current = null;

      if (reducedMotion) {
        rotation.set(target);
        onComplete?.();
        return;
      }

      animRef.current = animate(rotation, target, {
        type: "spring",
        stiffness: 520,
        damping: 52,
        mass: 1,
        onComplete: () => {
          animRef.current = null;
          onComplete?.();
        },
      });
    },
    [reducedMotion, rotation],
  );

  const snapToNearest = useCallback(() => {
    if (items.length <= 1) return;
    const current = rotation.get();
    let bestIdx = 0;
    let bestTarget = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < items.length; i += 1) {
      const base = rotationToBringIndexToFocal(i, baseAngles, FOCAL_DEG);
      for (const offset of [0, 360, -360]) {
        const candidate = base + offset;
        const dist = Math.abs(candidate - current);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
          bestTarget = candidate;
        }
      }
    }

    animateRotationTo(bestTarget, () => {
      setActiveIndex(bestIdx);
    });
  }, [items.length, rotation, baseAngles, animateRotationTo]);

  const goToIndex = useCallback(
    (idx: number, onComplete?: () => void) => {
      if (items.length <= 1) return;
      const next = clamp(idx, 0, items.length - 1);
      const base = rotationToBringIndexToFocal(next, baseAngles, FOCAL_DEG);
      const target = nearestWrappedRotation(rotation.get(), base);
      animateRotationTo(target, () => {
        setActiveIndex(next);
        onComplete?.();
      });
    },
    [items.length, rotation, baseAngles, animateRotationTo],
  );

  const goPrev = useCallback(() => {
    const next = (activeIndexRef.current - 1 + items.length) % items.length;
    goToIndex(next);
  }, [items.length, goToIndex]);

  const goNext = useCallback(() => {
    const next = (activeIndexRef.current + 1) % items.length;
    goToIndex(next);
  }, [items.length, goToIndex]);

  const handleCardClick = useCallback(
    (index: number) => {
      const href = items[index]?.href;
      if (!href) return;

      if (index === activeIndexRef.current) {
        router.push(href);
        return;
      }

      goToIndex(index, () => {
        router.push(href);
      });
    },
    [items, goToIndex, router],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (items.length <= 1) return;
      pointerIdRef.current = e.pointerId;
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartRotRef.current = rotation.get();
      animRef.current?.stop();
      animRef.current = null;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [items.length, rotation],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      if (pointerIdRef.current !== e.pointerId) return;
      const dx = e.clientX - dragStartXRef.current;
      const next = dragStartRotRef.current + dx * (0.18 * 0.6);
      rotation.set(next);
    },
    [rotation],
  );

  const endPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId) return;
      isDraggingRef.current = false;
      pointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      snapToNearest();
    },
    [snapToNearest],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const dir = e.key === "ArrowLeft" ? -1 : 1;
      const next = (activeIndexRef.current + dir + items.length) % items.length;
      goToIndex(next);
    },
    [items.length, goToIndex],
  );

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (items.length <= 1) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      rotation.set(rotation.get() + delta * 0.06);
      if (wheelSnapTimeoutRef.current != null) {
        window.clearTimeout(wheelSnapTimeoutRef.current);
      }
      wheelSnapTimeoutRef.current = window.setTimeout(() => {
        snapToNearest();
      }, 140);
    },
    [items.length, rotation, snapToNearest],
  );

  useEffect(
    () => () => {
      if (wheelSnapTimeoutRef.current != null) {
        window.clearTimeout(wheelSnapTimeoutRef.current);
      }
    },
    [],
  );

  const activeItem = items[clamp(activeIndex, 0, Math.max(0, items.length - 1))];

  return (
    <motion.section
      ref={rootRef}
      className="arc-carousel"
      aria-label="Collections arc carousel"
      role="region"
      tabIndex={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: hasEntered ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onLostPointerCapture={endPointer}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <div className="arc-carousel__glow" aria-hidden="true" />

      <div className="arc-carousel__stage">
        {items.map((item, index) => (
          <ArcItem
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            rotation={rotation}
            baseAngles={baseAngles}
            width={size.width}
            radius={radius}
            centerY={centerY}
            cardW={cardW}
            cardH={cardH}
            arcTiltDeg={tiltDeg}
            isHovered={hoveredIndex === index}
            onHover={setHoveredIndex}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <div className="arc-carousel__content" style={{ top: contentTop }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${activeItem?.title ?? "none"}-${activeIndex}`}
            ref={contentElRef}
            className="arc-carousel__content-inner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: reducedMotion ? 0 : 0.22,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            <div className="arc-carousel__title-row">
              <button
                type="button"
                className="arc-carousel__nav"
                aria-label="Previous collection"
                disabled={items.length <= 1}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <h2 className="arc-carousel__title">{activeItem?.title ?? ""}</h2>

              <button
                type="button"
                className="arc-carousel__nav"
                aria-label="Next collection"
                disabled={items.length <= 1}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <p className="arc-carousel__subtitle">{activeItem?.subtitle ?? ""}</p>

            {activeItem?.href ? (
              <Link
                href={activeItem.href}
                className="arc-carousel__cta"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                Explore Collection →
              </Link>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="arc-carousel__dots" aria-hidden="true">
        {items.map((item, index) => (
          <div
            key={`${item.title}-dot-${index}`}
            className={`arc-carousel__dot${
              index === activeIndex ? " arc-carousel__dot--active" : ""
            }`}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default ArcImageCarousel;
