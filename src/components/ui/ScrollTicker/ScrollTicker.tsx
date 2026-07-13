"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { getLenisInstance } from "@/lib/lenisInstance";
import "./ScrollTicker.css";

type ScrollTickerProps = {
  children: ReactNode;
  baseSpeed?: number;
  initialDirection?: "left" | "right";
  gap?: number;
  boostIntensity?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Framer-inspired Scroll Ticker:
 * Infinite horizontal marquee that reverses on scroll direction
 * and boosts speed with scroll velocity.
 */
export function ScrollTicker({
  children,
  baseSpeed = 80,
  initialDirection = "left",
  gap = 24,
  boostIntensity = 1,
  className,
  style,
}: ScrollTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const directionRef = useRef<"left" | "right">(initialDirection);
  const velocityRef = useRef(1);
  const lastTimeRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const inViewRef = useRef(true);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    directionRef.current = initialDirection;
  }, [initialDirection]);

  const measureAndReplicate = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const containerWidth = container.offsetWidth;
    if (containerWidth <= 0) return;

    const singleCopyWidth = track.scrollWidth / copies;
    if (singleCopyWidth <= 0) return;

    const needed = Math.max(2, Math.ceil((containerWidth * 2) / singleCopyWidth) + 1);
    if (needed !== copies) setCopies(needed);
  }, [copies]);

  useEffect(() => {
    measureAndReplicate();
    const ro = new ResizeObserver(measureAndReplicate);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureAndReplicate, children, gap]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const boostFromDelta = useCallback(
    (dy: number) => {
      if (dy === 0) return;

      const next =
        dy > 0
          ? initialDirection
          : initialDirection === "left"
            ? "right"
            : "left";
      directionRef.current = next;

      const absDelta = Math.min(Math.abs(dy), 200);
      const intensity = Math.max(0, boostIntensity);
      velocityRef.current = 1 + (absDelta / 200) * intensity;
      lastScrollTimeRef.current = performance.now();
    },
    [boostIntensity, initialDirection],
  );

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onWheel = (e: WheelEvent) => boostFromDelta(e.deltaY);

    const onScroll = () => {
      const y = window.scrollY;
      boostFromDelta(y - lastScrollYRef.current);
      lastScrollYRef.current = y;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const lenis = getLenisInstance();
    const onLenisScroll = (e: { velocity?: number; direction?: number }) => {
      const dy = e.velocity ?? e.direction ?? 0;
      boostFromDelta(dy);
    };
    lenis?.on("scroll", onLenisScroll);

    let retryId = 0;
    let lenisCleanup: (() => void) | undefined;

    if (lenis) {
      lenisCleanup = () => lenis.off("scroll", onLenisScroll);
    } else {
      retryId = window.setInterval(() => {
        const instance = getLenisInstance();
        if (!instance) return;
        instance.on("scroll", onLenisScroll);
        lenisCleanup = () => instance.off("scroll", onLenisScroll);
        window.clearInterval(retryId);
      }, 120);
    }

    return () => {
      window.clearInterval(retryId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      lenisCleanup?.();
    };
  }, [boostFromDelta]);

  useEffect(() => {
    const step = (timestamp: number) => {
      const track = trackRef.current;
      if (!track) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      if (!inViewRef.current) {
        lastTimeRef.current = null;
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      const prev = lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (prev != null) {
        const deltaSec = (timestamp - prev) / 1000;
        const dir = directionRef.current === "left" ? -1 : 1;

        let velocity = velocityRef.current;
        if (lastScrollTimeRef.current != null) {
          const elapsed = timestamp - lastScrollTimeRef.current;
          if (elapsed > 100) {
            const t = Math.min((elapsed - 100) / 400, 1);
            velocity = 1 + (velocity - 1) * (1 - t);
            if (t >= 1) {
              velocity = 1;
              velocityRef.current = 1;
              lastScrollTimeRef.current = null;
            } else {
              velocityRef.current = velocity;
            }
          }
        }

        positionRef.current += dir * baseSpeed * velocity * deltaSec;

        const singleCopyWidth = track.scrollWidth / copies;
        if (singleCopyWidth > 0) {
          while (positionRef.current <= -singleCopyWidth) {
            positionRef.current += singleCopyWidth;
          }
          while (positionRef.current > 0) {
            positionRef.current -= singleCopyWidth;
          }
        }

        track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [baseSpeed, copies]);

  const strips = Array.from({ length: copies }, (_, i) => (
    <div
      key={`ticker-copy-${i}`}
      className="scroll-ticker__strip"
      style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
      aria-hidden={i > 0}
    >
      {children}
    </div>
  ));

  return (
    <div
      ref={containerRef}
      className={className ? `scroll-ticker ${className}` : "scroll-ticker"}
      style={style}
      role="marquee"
      aria-label="Scroll-controlled ticker"
    >
      <div ref={trackRef} className="scroll-ticker__track">
        {strips}
      </div>
    </div>
  );
}
