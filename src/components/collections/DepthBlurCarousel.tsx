"use client";

import { useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

type DepthBlurCarouselProps = {
  images: string[];
  backgroundColor?: string;
};

export function DepthBlurCarousel({
  images,
  backgroundColor = "#0a0608",
}: DepthBlurCarouselProps) {
  const pool = images.length > 0 ? images : [];
  const renderItems = useMemo(() => {
    const items: string[] = [];
    while (items.length < 18 && pool.length > 0) {
      items.push(...pool);
    }
    return items;
  }, [pool]);

  const totalItems = renderItems.length;
  const scrollTarget = useRef(0);
  const rawScroll = useMotionValue(0);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smoothScroll = useSpring(rawScroll, { stiffness: 180, damping: 100, mass: 1, restDelta: 0.001 });

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY * 0.8;
    scrollTarget.current += delta * 0.004;
    rawScroll.set(scrollTarget.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      scrollTarget.current = Math.round(scrollTarget.current);
      rawScroll.set(scrollTarget.current);
    }, 150);
  };

  const handlePan = (_: unknown, info: { delta: { x: number }; velocity: { x: number } }) => {
    scrollTarget.current += -info.delta.x * 0.005;
    rawScroll.set(scrollTarget.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
  };

  const handlePanEnd = (_: unknown, info: { velocity: { x: number } }) => {
    scrollTarget.current += -info.velocity.x * 0.0015;
    scrollTarget.current = Math.round(scrollTarget.current);
    rawScroll.set(scrollTarget.current);
  };

  if (totalItems === 0) return null;

  return (
    <div
      className="relative min-h-[420px] w-full overflow-hidden md:min-h-[480px]"
      style={{ perspective: 400 }}
      onWheel={handleWheel}
    >
      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        className="absolute inset-0 z-[5] cursor-grab active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      />
      <div className="relative flex h-[420px] items-center justify-center md:h-[480px]">
        <div style={{ position: "relative", width: 0, height: 0, transformStyle: "preserve-3d" }}>
          {renderItems.map((src, i) => (
            <PremiumSmearCard key={`card-${src}-${i}`} src={src} index={i} total={totalItems} smoothScroll={smoothScroll} />
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-[25%]"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          maskImage: "linear-gradient(to right, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-[25%]"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          maskImage: "linear-gradient(to left, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

function PremiumSmearCard({
  src,
  index,
  total,
  smoothScroll,
}: {
  src: string;
  index: number;
  total: number;
  smoothScroll: ReturnType<typeof useSpring>;
}) {
  const itemWidth = 500;
  const itemHeight = 285;
  const sideItemWidth = 320;
  const sideItemHeight = 280;
  const gap = 64;
  const maxRotation = 90;
  const borderRadius = 10;

  const localOffset = useTransform(smoothScroll, (v) => {
    const linearBase = index - v;
    let mapped = ((linearBase % total) + total) % total;
    if (mapped > total / 2) mapped -= total;
    return mapped;
  });

  const absOffset = useTransform(localOffset, Math.abs);
  const cardWidth = useTransform(absOffset, [0, 1], [itemWidth, sideItemWidth], { clamp: true });
  const cardHeight = useTransform(absOffset, [0, 1], [itemHeight, sideItemHeight], { clamp: true });
  const marginLeft = useTransform(cardWidth, (w) => -w / 2);
  const marginTop = useTransform(cardHeight, (h) => -h / 2);
  const x = useTransform(localOffset, (o) => {
    const a = Math.abs(o);
    const s = Math.sign(o);
    const centerToNext = itemWidth / 2 + gap + sideItemWidth / 2;
    const sideToSide = sideItemWidth + gap;
    if (a === 0) return 0;
    if (a <= 1) return s * centerToNext * a;
    return s * (centerToNext + (a - 1) * sideToSide * 0.85);
  });
  const z = useTransform(absOffset, (a) => -a * 200);
  const rotateY = useTransform(localOffset, (o) => Math.sign(o) * Math.min(Math.abs(o) * 35, maxRotation));
  const zIndex = useTransform(absOffset, (a) => 1000 - Math.round(a * 10));
  const visibilityOpacity = useTransform(absOffset, [0, 5, 7], [1, 1, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        marginLeft,
        marginTop,
        width: cardWidth,
        height: cardHeight,
        rotateY,
        x,
        z,
        zIndex,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius,
          opacity: visibilityOpacity,
        }}
      />
    </motion.div>
  );
}

export function BlackPinkSection({
  story,
  storyLines,
  title,
  subtitle,
  images,
  accentColor,
  textColor,
  mutedColor,
  backgroundColor,
}: {
  story: string;
  storyLines: string[];
  title: string;
  subtitle: string;
  images: string[];
  accentColor: string;
  textColor: string;
  mutedColor: string;
  backgroundColor: string;
}) {
  return (
    <section className="min-h-screen" style={{ backgroundColor }}>
      <div className="grid min-h-screen lg:grid-cols-[minmax(280px,38%)_1fr]">
        <div className="flex flex-col justify-center px-6 py-24 md:px-10 lg:sticky lg:top-0 lg:h-screen">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="editorial-spacing text-[10px]"
            style={{ color: accentColor }}
          >
            {subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.08 }}
            className="font-display mt-6 text-5xl font-light md:text-7xl"
            style={{ color: textColor }}
          >
            {title}
          </motion.h2>
          <div className="mt-10 space-y-5">
            {storyLines.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className="font-display text-xl font-light md:text-2xl"
                style={{ color: mutedColor }}
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 max-w-md text-sm leading-[1.9] md:text-base"
            style={{ color: mutedColor }}
          >
            {story}
          </motion.p>
        </div>
        <div className="flex items-center py-12 lg:py-0">
          <DepthBlurCarousel images={images} backgroundColor={backgroundColor} />
        </div>
      </div>
    </section>
  );
}
