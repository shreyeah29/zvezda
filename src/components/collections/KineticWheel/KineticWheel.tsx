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
import "./KineticWheel.css";

const ITEM_SPACING = 92;
const VISIBLE_RADIUS = 5;
const FRICTION = 0.92;
const WHEEL_GAIN = 0.55;
const DRAG_GAIN = 1.05;
const SNAP_SOFT = 0.085;
const CURVE_STRENGTH = 92;
const MAX_BLUR = 2.4;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function itemStyle(distance: number) {
  const abs = Math.abs(distance);
  const t = clamp(abs / 3.2, 0, 1);
  const active = abs < 0.45;
  const scale = active ? 1 : 1 - t * 0.28;
  const opacity = active ? 1 : 0.3 + (1 - t) * 0.12;
  const blur = active ? 0 : t * MAX_BLUR;
  // Convex outward (Framer Kinetic Wheel): center bulges right, edges fall left
  const arc = Math.cos(clamp(distance, -3.4, 3.4) * 0.42);
  const x = CURVE_STRENGTH * arc;
  const rotate = distance * 5.2;

  return {
    x,
    y: distance * ITEM_SPACING,
    scale,
    opacity,
    rotate,
    blur,
    active,
    fontSizeBoost: active ? 1.06 : 1 - t * 0.08,
  };
}

type WheelItemProps = {
  piece: KineticPiece;
  distance: number;
  indexLabel: string;
  onSelect: () => void;
};

function WheelItem({ piece, distance, indexLabel, onSelect }: WheelItemProps) {
  const style = itemStyle(distance);
  const [hovered, setHovered] = useState(false);

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
        opacity: hovered && !style.active ? Math.min(1, style.opacity + 0.18) : style.opacity,
        filter: style.blur > 0.05 ? `blur(${style.blur}px)` : "none",
        zIndex: style.active ? 5 : Math.round(4 - Math.abs(distance)),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      aria-current={style.active ? "true" : undefined}
    >
      <span className="kw__item-index" aria-hidden="true">
        {indexLabel}
      </span>
      <span className="kw__item-rule" aria-hidden="true" />
      <span
        className="kw__item-label"
        style={{
          fontSize: `calc(clamp(0.95rem, 1.35vw, 1.2rem) * ${style.fontSizeBoost})`,
          color: style.active ? "#0c0a09" : "rgba(12, 10, 9, 0.48)",
        }}
      >
        {piece.product.name}
      </span>
      <span className="kw__item-rule" aria-hidden="true" />
    </button>
  );
}

function AmbientVideo({
  src,
  objectPosition,
}: {
  src: string;
  objectPosition?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        /* autoplay may be blocked until interaction */
      });
    }
    return () => {
      video.pause();
    };
  }, [src]);

  return (
    <motion.video
      key={src}
      ref={videoRef}
      className="kw__video"
      src={src}
      muted
      playsInline
      loop
      autoPlay
      preload="metadata"
      aria-hidden
      style={objectPosition ? { objectPosition } : undefined}
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 0.78, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.95, ease: [0.45, 0, 0.55, 1] }}
    />
  );
}

function Showcase({
  piece,
  parallaxY,
  zoom,
}: {
  piece: KineticPiece;
  parallaxY: number;
  zoom: number;
}) {
  const images = piece.images;
  const supportCount = Math.min(2, Math.max(0, images.length - 1));
  const hasSupport = supportCount > 0;
  const hero = images[0];
  const supportA = images[1];
  const supportB = images[2];

  return (
    <div className="kw__showcase">
      <div
        className={`kw__gallery${hasSupport ? "" : " kw__gallery--solo"}${
          supportCount === 1 ? " kw__gallery--duo" : ""
        }`}
      >        <div className="kw__hero">
          <AnimatePresence mode="sync">
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
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease: [0.45, 0, 0.55, 1] }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {hasSupport && supportA && (
          <div className={`kw__support${supportCount === 1 ? " kw__support--span" : ""}`}>
            <AnimatePresence mode="sync">
              <motion.img
                key={`${piece.product.slug}-a`}
                src={supportA}
                alt=""
                className="kw__img"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.45, 0, 0.55, 1], delay: 0.05 }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        )}

        {supportCount > 1 && supportB && (
          <div className="kw__support">
            <AnimatePresence mode="sync">
              <motion.img
                key={`${piece.product.slug}-b`}
                src={supportB}
                alt=""
                className="kw__img"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.45, 0, 0.55, 1], delay: 0.1 }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="kw__copy">
        <AnimatePresence mode="wait">
          <motion.div
            key={piece.product.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.p
              className="kw__collection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {piece.product.collectionLabel} Collection
            </motion.p>
            <motion.h2
              className="kw__name"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {piece.product.name}
            </motion.h2>
            <motion.p
              className="kw__tagline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {piece.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.24 }}
            >
              <Link href={`/products/${piece.product.slug}`} className="kw__cta">
                View Product
                <span className="kw__cta-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </motion.div>
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
      const idx = wrapIndex(Math.round(pos / ITEM_SPACING), count);
      startTransition(() => setActiveIndex(idx));
    },
    [count],
  );

  const tick = useCallback(() => {
    let pos = positionRef.current;
    let vel = velocityRef.current;

    if (!draggingRef.current) {
      // Soft snap toward nearest item while preserving continuous inertia feel
      if (Math.abs(vel) < 0.35) {
        const target = Math.round(pos / ITEM_SPACING) * ITEM_SPACING;
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
    const current = Math.round(positionRef.current / ITEM_SPACING);
    const wrappedCurrent = wrapIndex(current, count);
    let delta = index - wrappedCurrent;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    const target = (current + delta) * ITEM_SPACING;
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

  const virtualCenter = position / ITEM_SPACING;

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

  if (count === 0 || !activePiece) return null;

  return (
    <section
      className="kw"
      aria-label="Kinetic product wheel"
      data-lenis-prevent
    >
      <div className="kw__video-layer" aria-hidden="true">
        <AnimatePresence mode="sync">
          {activePiece.video ? (
            <AmbientVideo
              key={activePiece.video}
              src={activePiece.video}
              objectPosition={activePiece.product.videoObjectPosition}
            />
          ) : null}
        </AnimatePresence>
      </div>

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
                indexLabel={String(index + 1).padStart(2, "0")}
                onSelect={() => openProduct(index)}
              />
            ))}
          </div>
        </div>

        <Showcase piece={activePiece} parallaxY={parallaxY} zoom={zoom} />
      </div>

      <p className="kw__hint">Scroll to explore · Click to view</p>
    </section>
  );
}

export default KineticWheel;
