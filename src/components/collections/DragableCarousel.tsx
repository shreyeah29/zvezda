"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

type DragableCarouselProps = {
  images: string[];
  slideWidth?: number;
  slideHeight?: number;
  gap?: number;
  borderRadius?: number;
};

const wrapperStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  cursor: "grab",
  userSelect: "none",
  position: "relative",
};

export function DragableCarousel({
  images,
  slideWidth = 320,
  slideHeight = 400,
  gap = 20,
  borderRadius = 12,
}: DragableCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);
  const trackX = useRef(0);
  const drag = useRef({
    active: false,
    startX: 0,
    startTrackX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const slides = images.length > 0 ? images : [];
  const count = slides.length;
  const step = slideWidth + gap;
  const perspective = 1000;
  const maxRotateY = 45;
  const depth = 150;
  const activeScale = 1;
  const inactiveScale = 0.85;
  const inactiveOpacity = 0.5;

  const centerXFor = useCallback(
    (i: number) => {
      const el = containerRef.current;
      if (!el) return -i * step;
      return el.offsetWidth / 2 - i * step - slideWidth / 2;
    },
    [slideWidth, step]
  );

  const render = useCallback(() => {
    const el = containerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    track.style.transform = `translateX(${trackX.current}px)`;
    const center = el.offsetWidth / 2;
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      const slideCenter = i * step + slideWidth / 2 + trackX.current;
      const norm = (slideCenter - center) / step;
      const abs = Math.abs(norm);
      const ry = norm * maxRotateY;
      const tz = -abs * depth;
      const sc = Math.max(inactiveScale, activeScale - abs * (activeScale - inactiveScale));
      const op = Math.max(inactiveOpacity, 1 - abs * (1 - inactiveOpacity));
      slide.style.transform = `perspective(${perspective}px) rotateY(${ry}deg) translateZ(${tz}px) scale(${sc})`;
      slide.style.opacity = `${op}`;
      slide.style.zIndex = `${100 - Math.round(abs * 10)}`;
    });
  }, [activeScale, depth, inactiveOpacity, inactiveScale, maxRotateY, slideWidth, step]);

  const snapTo = useCallback(
    (i: number, instant = false) => {
      const target = ((i % count) + count) % count;
      const x = centerXFor(target);
      if (instant) {
        trackX.current = x;
        render();
        indexRef.current = target;
        setActiveIndex(target);
        return;
      }
      indexRef.current = target;
      setActiveIndex(target);
      gsap.killTweensOf(trackX);
      gsap.to(trackX, {
        current: x,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: render,
      });
    },
    [centerXFor, count, render]
  );

  useEffect(() => {
    slidesRef.current = slidesRef.current.slice(0, count);
    snapTo(0, true);
  }, [count, gap, slideWidth, snapTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || count <= 1) return;

    const onStart = (e: MouseEvent | TouchEvent) => {
      gsap.killTweensOf(trackX);
      drag.current.active = true;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      drag.current.startX = x;
      drag.current.startTrackX = trackX.current;
      drag.current.lastX = x;
      drag.current.lastTime = Date.now();
      drag.current.velocity = 0;
      container.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!drag.current.active) return;
      if ("cancelable" in e && e.cancelable) e.preventDefault();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const now = Date.now();
      const dt = now - drag.current.lastTime;
      if (dt > 0) drag.current.velocity = ((x - drag.current.lastX) / dt) * 1000;
      drag.current.lastX = x;
      drag.current.lastTime = now;
      trackX.current = drag.current.startTrackX + (x - drag.current.startX);
      render();
    };

    const onEnd = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      container.style.cursor = "grab";
      const projected = trackX.current + drag.current.velocity * 0.12;
      const center = container.offsetWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        const sc = i * step + slideWidth / 2 + projected;
        const d = Math.abs(sc - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      snapTo(best);
    };

    container.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    container.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      container.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      container.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [count, render, slideWidth, snapTo, step]);

  if (count === 0) return null;

  return (
    <div className="px-4 py-16 md:px-8 md:py-24">
      <div ref={containerRef} style={{ ...wrapperStyle, height: slideHeight + 80 }}>
        <div ref={trackRef} style={{ display: "flex", gap, alignItems: "center" }}>
          {slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              ref={(el) => {
                slidesRef.current[i] = el;
              }}
              style={{
                width: slideWidth,
                height: slideHeight,
                borderRadius,
                overflow: "hidden",
                flexShrink: 0,
                willChange: "transform, opacity",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => snapTo(indexRef.current - 1)}
          style={{ ...arrowBtnStyle, left: 12 }}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => snapTo(indexRef.current + 1)}
          style={{ ...arrowBtnStyle, right: 12 }}
        >
          ›
        </button>

        <div style={dotsRowStyle}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => snapTo(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: "#f5f0e8",
                opacity: i === activeIndex ? 1 : 0.3,
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 200,
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  fontSize: 24,
  color: "#333",
};

const dotsRowStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 8,
  zIndex: 200,
};
