"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type LogoRotatorImage = {
  src: string;
  alt: string;
};

type LogoRotatorProps = {
  images: LogoRotatorImage[];
  speed?: number;
  imageWidth?: number;
  aspectRatio?: number;
  imageRadius?: number;
  onImageClick?: () => void;
  premium?: boolean;
};

export function LogoRotator({
  images,
  speed = 14,
  imageWidth = 300,
  aspectRatio = 0.75,
  imageRadius = 10,
  onImageClick,
  premium = false,
}: LogoRotatorProps) {
  const logos = images.filter((image) => !!image.src);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const [, forceRender] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const lastPointerX = useRef(0);
  const autoSpeed = useRef(1);
  const dragVelocity = useRef(0);
  const scrollVelocity = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      startTransition(() => setWindowWidth(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scaleFactor = windowWidth <= 480 ? 0.4 : windowWidth <= 768 ? 0.6 : 1;
  const responsiveImageWidth = imageWidth * scaleFactor;
  const responsiveImageHeight = responsiveImageWidth / aspectRatio;
  const count = logos.length || 1;
  const gap = 20;
  const radiusX = Math.max((count * (responsiveImageWidth + gap)) / (2 * Math.PI), 200 * scaleFactor);
  const radiusZ = radiusX * 0.85;
  const radiusY = 40 * scaleFactor;
  const containerPadding = windowWidth <= 768 ? 80 : 100;

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragMoved.current = false;
    lastPointerX.current = e.clientX;
    autoSpeed.current = 0;
    dragVelocity.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointerX.current;
    if (Math.abs(dx) > 2) dragMoved.current = true;
    lastPointerX.current = e.clientX;
    const sensitivity = 0.3;
    angleRef.current = (angleRef.current + dx * sensitivity) % 360;
    dragVelocity.current = dx * sensitivity;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    autoSpeed.current = 1;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const isNearViewport = rect.bottom > -viewH * 0.5 && rect.top < viewH * 1.5;
      if (isNearViewport) {
        scrollVelocity.current += delta * 0.03;
        scrollVelocity.current = Math.max(-3, Math.min(3, scrollVelocity.current));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (logos.length === 0) return;
    const degreesPerSecond = 360 / speed;
    let lastTime: number | null = null;

    const animate = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (Math.abs(scrollVelocity.current) > 0.01) {
        angleRef.current = (angleRef.current + scrollVelocity.current) % 360;
        scrollVelocity.current *= 0.97;
      } else {
        scrollVelocity.current = 0;
      }

      if (!isDragging.current) {
        if (Math.abs(dragVelocity.current) > 0.1) {
          angleRef.current = (angleRef.current + dragVelocity.current) % 360;
          dragVelocity.current *= 0.92;
        } else {
          dragVelocity.current = 0;
          angleRef.current =
            (angleRef.current + degreesPerSecond * delta * autoSpeed.current) % 360;
        }
      }

      startTransition(() => forceRender((v) => v + 1));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [logos.length, speed]);

  if (logos.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
        No images available
      </div>
    );
  }

  const baseAngle = angleRef.current;
  const items = logos.map((logo, i) => {
    const itemAngle = (baseAngle + (360 / count) * i) % 360;
    const rad = (itemAngle * Math.PI) / 180;
    const x = Math.sin(rad) * radiusX;
    const z = Math.cos(rad) * radiusZ;
    const depthNorm = (z + radiusZ) / (2 * radiusZ);
    const scale = 0.35 + depthNorm * 0.65;
    const y = -Math.cos(rad) * radiusY;
    return { logo, x, y, z, scale, depthNorm, index: i };
  });

  const sorted = [...items].sort((a, b) => a.z - b.z);

  const handleImageClick = () => {
    if (dragMoved.current) return;
    onImageClick?.();
  };

  return (
    <div
      ref={sectionRef}
      className="relative flex w-full select-none items-center justify-center touch-pan-y"
      style={{
        minHeight: radiusY * 2 + responsiveImageHeight + containerPadding,
        cursor: isDragging.current ? "grabbing" : "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="relative"
        style={{
          width: radiusX * 2 + responsiveImageWidth + containerPadding,
          height: radiusY * 2 + responsiveImageHeight + containerPadding,
        }}
      >
        {sorted.map((item) => {
          const isHovered = hoveredIndex === item.index;
          const hoverBoost = premium && isHovered ? 1.08 : 1;
          const liftY = premium && isHovered ? -14 : 0;
          const finalScale = item.scale * hoverBoost;

          return (
            <button
              key={item.index}
              type="button"
              aria-label={`Open Instagram — ${item.logo.alt}`}
              onClick={handleImageClick}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="absolute top-1/2 left-1/2 border-0 bg-transparent p-0"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "transform",
                transform: `translate(-50%, -50%) translateX(${item.x}px) translateY(${item.y + liftY}px) scale(${finalScale})`,
                zIndex: Math.round(item.depthNorm * 100) + (isHovered ? 20 : 0),
                cursor: "pointer",
                transition:
                  "transform 0.55s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease, z-index 0s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.logo.src}
                alt={item.logo.alt}
                draggable={false}
                style={{
                  width: responsiveImageWidth,
                  height: responsiveImageHeight,
                  objectFit: "cover",
                  display: "block",
                  borderRadius: imageRadius,
                  pointerEvents: "none",
                  border: premium ? "2px solid rgba(255,255,255,0.88)" : undefined,
                  boxShadow: isHovered
                    ? "0 32px 72px rgba(10,10,10,0.3), 0 14px 32px rgba(10,10,10,0.2)"
                    : premium
                      ? "0 20px 48px rgba(10,10,10,0.16), 0 8px 20px rgba(10,10,10,0.1)"
                      : "0 18px 48px rgba(0,0,0,0.55)",
                  transition: "box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
