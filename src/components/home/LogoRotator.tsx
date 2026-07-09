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
};

export function LogoRotator({
  images,
  speed = 14,
  imageWidth = 300,
  aspectRatio = 0.75,
  imageRadius = 10,
  onImageClick,
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
        const sensitivity = 0.03;
        scrollVelocity.current += delta * sensitivity;
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
      <div className="flex h-full w-full items-center justify-center text-sm text-cream/40">
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
        {sorted.map((item) => (
          <button
            key={item.index}
            type="button"
            aria-label={`Open Instagram — ${item.logo.alt}`}
            onClick={handleImageClick}
            className="absolute top-1/2 left-1/2 border-0 bg-transparent p-0"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transform: `translate(-50%, -50%) translateX(${item.x}px) translateY(${item.y}px) scale(${item.scale})`,
              zIndex: Math.round(item.depthNorm * 100),
              cursor: "pointer",
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
                boxShadow: "0 18px 48px rgba(0,0,0,0.55)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
