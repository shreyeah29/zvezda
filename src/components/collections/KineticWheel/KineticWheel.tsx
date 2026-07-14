"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getKineticPieces, type KineticPiece } from "./kineticData";
import { AmbientVideoLayer } from "./AmbientVideoLayer";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import "./KineticWheel.css";

const ITEM_SPACING_DESKTOP = 84;
const ITEM_SPACING_MOBILE = 64;
const VISIBLE_RADIUS = 5;
const FRICTION = 0.92;
const WHEEL_GAIN = 0.55;
const DRAG_GAIN = 1.05;
const SNAP_SOFT = 0.085;
const CURVE_STRENGTH_DESKTOP = 92;
const CURVE_STRENGTH_MOBILE = 28;
const MAX_BLUR = 2.4;

function ZvezdaStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
      <path
        d="M12 1.2 L13.35 9.55 L21.8 12 L13.35 14.45 L12 22.8 L10.65 14.45 L2.2 12 L10.65 9.55 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function itemStyle(
  distance: number,
  spacing: number,
  curveStrength: number,
  compact = false,
) {
  const abs = Math.abs(distance);
  const t = clamp(abs / 3.2, 0, 1);
  const active = abs < 0.45;
  const scale = active ? 1 : 1 - t * (compact ? 0.14 : 0.28);
  // Keep inactive names readable — especially over full-bleed video.
  const opacity = active
    ? 1
    : compact
      ? 0.72 + (1 - t) * 0.18
      : 0.3 + (1 - t) * 0.12;
  const blur = active ? 0 : t * (compact ? 0.6 : MAX_BLUR);
  // Convex outward (Framer Kinetic Wheel): center bulges right, edges fall left
  const arc = Math.cos(clamp(distance, -3.4, 3.4) * 0.42);
  const x = curveStrength * arc;
  const rotate = distance * (curveStrength > 60 ? 5.2 : 3.2);

  return {
    x,
    y: distance * spacing,
    scale,
    opacity,
    rotate,
    blur,
    active,
    fontSizeBoost: active ? (compact ? 1.02 : 1.06) : 1 - t * (compact ? 0.04 : 0.08),
  };
}

type WheelItemProps = {
  piece: KineticPiece;
  distance: number;
  spacing: number;
  curveStrength: number;
  compact?: boolean;
  lightLabels?: boolean;
  onSelect: () => void;
};

function WheelItem({
  piece,
  distance,
  spacing,
  curveStrength,
  compact = false,
  lightLabels = false,
  onSelect,
}: WheelItemProps) {
  const style = itemStyle(distance, spacing, curveStrength, compact);
  const [hovered, setHovered] = useState(false);
  const labelSize = compact
    ? `calc(clamp(0.52rem, 2.1vw, 0.64rem) * ${style.fontSizeBoost})`
    : `calc(clamp(0.95rem, 1.35vw, 1.2rem) * ${style.fontSizeBoost})`;
  const activeColor = lightLabels ? "#fafaf9" : "#0c0a09";
  const idleColor = lightLabels ? "rgba(250, 250, 249, 0.78)" : "rgba(12, 10, 9, 0.48)";

  return (
    <button
      type="button"
      id={`kw-item-${piece.product.slug}`}
      className={`kw__item${style.active ? " is-active" : ""}`}
      role="option"
      aria-selected={style.active}
      style={{
        transform: `translate3d(${style.x}px, calc(-50% + ${style.y}px), 0) rotate(${style.rotate}deg) scale(${
          style.scale * (hovered && !style.active ? 1.03 : 1)
        })`,
        opacity: hovered && !style.active ? Math.min(1, style.opacity + 0.12) : style.opacity,
        filter: style.blur > 0.05 ? `blur(${style.blur}px)` : "none",
        zIndex: style.active ? 5 : Math.round(4 - Math.abs(distance)),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      aria-current={style.active ? "true" : undefined}
    >
      <span className="kw__item-star" aria-hidden="true">
        <ZvezdaStar />
      </span>
      <span
        className="kw__item-label"
        style={{
          fontSize: labelSize,
          color: style.active ? activeColor : idleColor,
        }}
      >
        {piece.product.name}
      </span>
    </button>
  );
}

function Showcase({
  piece,
  parallaxY,
  zoom,
  compact = false,
}: {
  piece: KineticPiece;
  parallaxY: number;
  zoom: number;
  compact?: boolean;
}) {
  const hasVideo = Boolean(piece.video);
  const images = piece.images;
  // Single hero still only — no collage. On compact/mobile, still is a full-bleed layer.
  const showInlineStill = !hasVideo && !compact;
  const hero = images[0];

  return (
    <div
      className={`kw__showcase${hasVideo || compact ? " kw__showcase--video" : ""}`}
    >
      {showInlineStill && hero && (
        <div className="kw__gallery kw__gallery--solo">
          <div className="kw__hero">
            <AnimatePresence mode="sync" initial={false}>
              <motion.img
                key={`${piece.product.slug}-hero`}
                src={hero}
                alt={piece.product.name}
                className="kw__img"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  scale: zoom,
                  y: parallaxY,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.45, 0, 0.55, 1] }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className={`kw__copy${compact ? " kw__copy--action" : ""}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={piece.product.slug}
            initial={compact ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {!compact && (
              <>
                <p className="kw__collection">{piece.product.collectionLabel} Collection</p>
                <h2 className="kw__name">{piece.product.name}</h2>
                <p className="kw__tagline">{piece.tagline}</p>
              </>
            )}
            <Link
              href={`/products/${piece.product.slug}`}
              className={`kw__cta${compact ? " kw__cta--button" : ""}`}
            >
              View Product
              {!compact && (
                <span className="kw__cta-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function KineticWheel() {
  const pieces = useMemo(() => getKineticPieces(), []);
  const count = pieces.length;
  const router = useRouter();
  const isMobile = useMaxWidth(768);
  const itemSpacing = isMobile ? ITEM_SPACING_MOBILE : ITEM_SPACING_DESKTOP;
  const curveStrength = isMobile ? CURVE_STRENGTH_MOBILE : CURVE_STRENGTH_DESKTOP;
  const spacingRef = useRef(itemSpacing);
  spacingRef.current = itemSpacing;

  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointerY = useRef(0);
  const scrollDirRef = useRef(0);
  const wheelColRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const [zoom, setZoom] = useState(1);

  const activePiece = pieces[activeIndex] ?? pieces[0];

  const syncActive = useCallback(
    (pos: number) => {
      const spacing = spacingRef.current;
      const idx = wrapIndex(Math.round(pos / spacing), count);
      startTransition(() => setActiveIndex(idx));
    },
    [count],
  );

  const tick = useCallback(() => {
    let pos = positionRef.current;
    let vel = velocityRef.current;
    const spacing = spacingRef.current;

    if (!draggingRef.current) {
      // Soft snap toward nearest item while preserving continuous inertia feel
      if (Math.abs(vel) < 0.35) {
        const target = Math.round(pos / spacing) * spacing;
        const delta = target - pos;
        vel += delta * SNAP_SOFT;
      }
      vel *= FRICTION;
      if (Math.abs(vel) < 0.02) vel = 0;
    }

    if (vel !== 0 || draggingRef.current) {
      pos += vel;
      positionRef.current = pos;
      velocityRef.current = vel;
      setPosition(pos);
      syncActive(pos);

      const dir = Math.sign(vel) || scrollDirRef.current;
      scrollDirRef.current = dir;
      const speed = clamp(Math.abs(vel) / 18, 0, 1);
      setParallaxY(-dir * (8 + speed * 4));
      setZoom(1 + speed * 0.02);
    } else {
      setParallaxY((y) => y * 0.86);
      setZoom((z) => 1 + (z - 1) * 0.88);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [syncActive]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  useEffect(() => {
    const el = wheelColRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta = event.deltaY;
      // Normalize trackpad vs mouse wheel
      const amount = Math.abs(delta) < 40 ? delta : Math.sign(delta) * Math.min(Math.abs(delta), 90);
      velocityRef.current += amount * WHEEL_GAIN * 0.08;
      scrollDirRef.current = Math.sign(amount) || scrollDirRef.current;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    draggingRef.current = true;
    lastPointerY.current = event.clientY;
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dy = event.clientY - lastPointerY.current;
    lastPointerY.current = event.clientY;
    positionRef.current += dy * DRAG_GAIN;
    velocityRef.current = dy * DRAG_GAIN * 0.55;
    scrollDirRef.current = Math.sign(dy) || scrollDirRef.current;
    setPosition(positionRef.current);
    syncActive(positionRef.current);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    draggingRef.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const goToIndex = (index: number) => {
    const spacing = spacingRef.current;
    const current = Math.round(positionRef.current / spacing);
    const wrappedCurrent = wrapIndex(current, count);
    let delta = index - wrappedCurrent;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    const target = (current + delta) * spacing;
    const start = positionRef.current;
    const diff = target - start;
    const duration = 520;
    const startTime = performance.now();

    const animateTo = (now: number) => {
      const t = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      positionRef.current = start + diff * eased;
      setPosition(positionRef.current);
      syncActive(positionRef.current);
      if (t < 1) requestAnimationFrame(animateTo);
      else velocityRef.current = 0;
    };
    requestAnimationFrame(animateTo);
  };

  const openProduct = (index: number) => {
    const piece = pieces[index];
    if (!piece) return;
    if (index !== activeIndex) {
      goToIndex(index);
      return;
    }
    router.push(`/products/${piece.product.slug}`);
  };

  const virtualCenter = position / itemSpacing;

  const visibleItems = useMemo(() => {
    const items: { key: string; index: number; distance: number }[] = [];
    const base = Math.round(virtualCenter);
    for (let offset = -VISIBLE_RADIUS; offset <= VISIBLE_RADIUS; offset += 1) {
      const logical = base + offset;
      const index = wrapIndex(logical, count);
      const distance = logical - virtualCenter;
      items.push({ key: `${logical}-${index}`, index, distance });
    }
    return items;
  }, [virtualCenter, count]);

  const neighborSrcs = useMemo(() => {
    const urls: string[] = [];
    for (const offset of [-2, -1, 1, 2]) {
      const piece = pieces[wrapIndex(activeIndex + offset, count)];
      if (piece?.video) urls.push(piece.video);
    }
    return urls;
  }, [activeIndex, count, pieces]);

  if (count === 0 || !activePiece) return null;

  const hasVideo = Boolean(activePiece.video);
  const stillSrc = !hasVideo ? activePiece.images[0] : undefined;
  const hasFullBleedMedia = hasVideo || Boolean(stillSrc);

  return (
    <section
      className={`kw${isMobile ? " kw--mobile" : ""}${hasVideo ? " kw--has-video" : ""}${
        stillSrc && isMobile ? " kw--has-still" : ""
      }`}
      aria-label="Kinetic product wheel"
      data-lenis-prevent
    >
      {hasVideo ? (
        <AmbientVideoLayer
          src={activePiece.video}
          neighborSrcs={neighborSrcs}
          objectPosition={activePiece.product.videoObjectPosition}
          variant="backdrop"
        />
      ) : null}

      {stillSrc && isMobile ? (
        <div className="kw__still-layer" aria-hidden="true">
          <AnimatePresence mode="sync" initial={false}>
            <motion.img
              key={stillSrc}
              src={stillSrc}
              alt=""
              className="kw__still-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: zoom }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.45, 0, 0.55, 1] }}
              draggable={false}
            />
          </AnimatePresence>
        </div>
      ) : null}

      <div
        className="kw__mood"
        style={
          {
            "--kw-glow": activePiece.mood.glow,
            background: `radial-gradient(ellipse 55% 70% at 72% 48%, ${activePiece.mood.glow} 0%, transparent 68%)`,
          } as React.CSSProperties
        }
      />

      <div className="kw__shell">
        <div
          ref={wheelColRef}
          className="kw__wheel-col"
          tabIndex={0}
          role="listbox"
          aria-label="Scroll product names"
          aria-activedescendant={`kw-item-${activePiece.product.slug}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
              event.preventDefault();
              goToIndex(wrapIndex(activeIndex + 1, count));
            }
            if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
              event.preventDefault();
              goToIndex(wrapIndex(activeIndex - 1, count));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              openProduct(activeIndex);
            }
          }}
        >
          <div className="kw__wheel">
            {visibleItems.map(({ key, index, distance }) => (
              <WheelItem
                key={key}
                piece={pieces[index]}
                distance={distance}
                spacing={itemSpacing}
                curveStrength={curveStrength}
                compact={isMobile}
                lightLabels={hasFullBleedMedia && isMobile}
                onSelect={() => openProduct(index)}
              />
            ))}
          </div>
        </div>

        <Showcase
          piece={activePiece}
          parallaxY={parallaxY}
          zoom={zoom}
          compact={isMobile}
        />
      </div>

      <p className="kw__hint">Scroll to explore · Tap to view</p>
    </section>
  );
}

export default KineticWheel;
