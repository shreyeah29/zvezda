"use client";

import { motion, useMotionValue, useSpring, animate, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import type { GalleryImage } from "@/data/collectionCategories";

type InertiaGridProps = {
  items: GalleryImage[];
  backgroundColor?: string;
  columns?: number;
  itemSize?: number;
  gap?: number;
  preset?: "drift" | "repel" | "glitch";
  amount?: number;
};

const SPRING_POSITION = { stiffness: 220, damping: 18, mass: 0.9 };
const SPRING_SCALE = { stiffness: 80, damping: 22, mass: 1.2 };

const PRESET_BASE = {
  drift: { maxDisp: 0.12, springStiffness: 35, rotationRange: 0, mass: 2.5 },
  repel: { maxDisp: 0.4, springStiffness: 180, rotationRange: 8, mass: 1.2 },
  glitch: { maxDisp: 0.35, springStiffness: 140, rotationRange: 15, mass: 1.4 },
};

export function InertiaGrid({
  items,
  backgroundColor = "#050505",
  columns = 3,
  itemSize = 180,
  gap = 16,
  preset = "repel",
  amount = 50,
}: InertiaGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const prefersReduced = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const activePhysics = useMemo(() => {
    const base = PRESET_BASE[preset];
    const intensity = amount / 100;
    return {
      maxDisp: base.maxDisp * intensity,
      springStiffness: base.springStiffness,
      rotationRange: base.rotationRange * intensity,
      mass: base.mass,
    };
  }, [amount, preset]);

  const { scaledItemSize, scaledGap } = useMemo(() => {
    const gridWidth = columns * itemSize + (columns - 1) * gap + gap * 2;
    if (containerWidth > 0 && containerWidth < gridWidth) {
      const scale = containerWidth / gridWidth;
      return { scaledItemSize: itemSize * scale, scaledGap: gap * scale };
    }
    return { scaledItemSize: itemSize, scaledGap: gap };
  }, [columns, containerWidth, gap, itemSize]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        startTransition(() => setContainerWidth(entry.contentRect.width));
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const shouldAnimate = !prefersReduced && isInView;

  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor }}>
      <div
        ref={containerRef}
        className="mx-auto flex min-h-[520px] max-w-6xl items-start justify-center"
        onMouseMove={
          shouldAnimate
            ? (e) => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
              }
            : undefined
        }
        onMouseLeave={() => {
          mouseX.set(-9999);
          mouseY.set(-9999);
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, ${scaledItemSize}px)`,
            gridAutoRows: `${scaledItemSize}px`,
            gap: scaledGap,
            padding: scaledGap,
          }}
        >
          {items.map((item, index) => (
            <InertiaCard
              key={`${item.src}-${index}`}
              item={item}
              mouseX={mouseX}
              mouseY={mouseY}
              physics={activePhysics}
              shouldAnimate={shouldAnimate}
              index={index}
              itemSize={scaledItemSize}
              preset={preset}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function InertiaCard({
  item,
  mouseX,
  mouseY,
  physics,
  shouldAnimate,
  index,
  itemSize,
  preset,
}: {
  item: GalleryImage;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  physics: { maxDisp: number; springStiffness: number; rotationRange: number; mass: number };
  shouldAnimate: boolean;
  index: number;
  itemSize: number;
  preset: "drift" | "repel" | "glitch";
}) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const presetConfig = useMemo(
    () => ({
      maxDisp: itemSize * physics.maxDisp,
      springStiffness: physics.springStiffness,
      rotationRange: physics.rotationRange,
      mass: physics.mass,
    }),
    [itemSize, physics]
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const itemScale = useMotionValue(1);
  const springX = useSpring(x, { ...SPRING_POSITION, stiffness: presetConfig.springStiffness, mass: presetConfig.mass });
  const springY = useSpring(y, { ...SPRING_POSITION, stiffness: presetConfig.springStiffness, mass: presetConfig.mass });
  const springRotate = useSpring(rotate, { ...SPRING_POSITION, stiffness: presetConfig.springStiffness, mass: presetConfig.mass });
  const springScale = useSpring(itemScale, SPRING_SCALE);

  useEffect(() => {
    if (!shouldAnimate) return;
    let rafId = 0;
    const updatePosition = () => {
      if (!itemRef.current) {
        rafId = requestAnimationFrame(updatePosition);
        return;
      }
      const rect = itemRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseXVal = mouseX.get();
      const mouseYVal = mouseY.get();
      const dx = mouseXVal - centerX;
      const dy = mouseYVal - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = itemSize * 1.25;

      if (mouseXVal === -9999 || distance >= influenceRadius) {
        x.set(0);
        y.set(0);
        rotate.set(0);
        itemScale.set(1);
        startTransition(() => setIsAnimating(false));
      } else {
        const force = Math.pow((influenceRadius - distance) / influenceRadius, 2.5);
        const targetX = -(dx / distance) * force * presetConfig.maxDisp;
        const targetY = -(dy / distance) * force * presetConfig.maxDisp;
        const targetRotate = -(dx / distance) * force * presetConfig.rotationRange;
        x.set(targetX);
        y.set(targetY);
        rotate.set(targetRotate);
        if (preset === "glitch") {
          const randomFlicker = (Math.random() - 0.5) * 30;
          animate(rotate, targetRotate + randomFlicker, { duration: 0.08, ease: "linear" });
        }
        itemScale.set(distance < itemSize * 0.9 ? 1.06 : 0.94);
        startTransition(() => setIsAnimating(true));
      }
      rafId = requestAnimationFrame(updatePosition);
    };
    rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [shouldAnimate, itemScale, itemSize, mouseX, mouseY, preset, presetConfig.maxDisp, presetConfig.rotationRange, rotate, x, y]);

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    borderRadius: item.borderRadius || "4%",
    display: "block",
    pointerEvents: "none" as const,
  };

  if (!shouldAnimate) {
    return (
      <button type="button" className="block h-full w-full border-0 bg-transparent p-0" aria-label={item.alt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} style={imageStyle} />
      </button>
    );
  }

  return (
    <motion.button
      ref={itemRef}
      type="button"
      className="block h-full w-full border-0 bg-transparent p-0"
      aria-label={item.alt}
      style={{ willChange: isAnimating ? "transform" : "auto" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 80, damping: 22, mass: 1.2, delay: index * 0.05 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={item.src}
        alt={item.alt}
        style={{ ...imageStyle, x: springX, y: springY, rotate: springRotate, scale: springScale }}
      />
    </motion.button>
  );
}
