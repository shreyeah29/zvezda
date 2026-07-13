"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import type { JacquemusCollectionMedia } from "@/data/jacquemusCollections";
import { getLenisInstance } from "@/lib/lenisInstance";
import "./ScaleEffectGallery.css";

const DOME_RADIUS = 1.5;
const MAX_SCALE = 1;
const MIN_SCALE = 0.78;

export function orderGalleryMedia(media: JacquemusCollectionMedia[]): JacquemusCollectionMedia[] {
  const videos = media.filter((item) => item.type === "video");
  const images = media.filter((item) => item.type === "image");
  return [...videos, ...images];
}

function getScaleFromDistance(distancePx: number, slotHeight: number): number {
  if (slotHeight <= 0) return MAX_SCALE;

  const normalizedDistance = Math.abs(distancePx) / slotHeight;
  if (normalizedDistance >= DOME_RADIUS) return MIN_SCALE;

  const t = normalizedDistance / DOME_RADIUS;
  const heightOnDome = Math.sqrt(Math.max(0, 1 - t * t));
  return MIN_SCALE + heightOnDome * (MAX_SCALE - MIN_SCALE);
}

type ScaleEffectGalleryProps = {
  media: JacquemusCollectionMedia[];
};

function GalleryMedia({ item }: { item: JacquemusCollectionMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [item.type]);

  if (item.type === "video") {
    return (
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={item.poster}
        className="scale-gallery__media"
      >
        <source src={item.src} type="video/mp4" />
      </video>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.src}
      alt={item.alt}
      className="scale-gallery__media"
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

export function ScaleEffectGallery({ media }: ScaleEffectGalleryProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const updateScales = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const slots = list.querySelectorAll<HTMLElement>(".scale-gallery__slot");
    if (slots.length === 0) return;

    const firstSlot = slots[0];
    const secondSlot = slots[1];
    const slotHeight =
      secondSlot != null
        ? secondSlot.offsetTop - firstSlot.offsetTop
        : firstSlot.offsetHeight + parseFloat(getComputedStyle(list).gap || "0");

    const viewportCenter = window.innerHeight / 2;

    slots.forEach((slot, index) => {
      const frame = frameRefs.current[index];
      if (!frame) return;

      const rect = slot.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = itemCenter - viewportCenter;
      const scale = getScaleFromDistance(distance, slotHeight);

      frame.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(4)})`;
    });
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateScales();
    });
  }, [updateScales]);

  useEffect(() => {
    frameRefs.current = frameRefs.current.slice(0, media.length);
    updateScales();

    let lenisCleanup: (() => void) | undefined;
    let lenisRetryId = 0;

    const attachLenis = () => {
      const lenis = getLenisInstance();
      if (!lenis || lenisCleanup) return Boolean(lenisCleanup);

      lenis.on("scroll", scheduleUpdate);
      lenisCleanup = () => lenis.off("scroll", scheduleUpdate);
      return true;
    };

    if (!attachLenis()) {
      lenisRetryId = window.setInterval(() => {
        if (attachLenis()) window.clearInterval(lenisRetryId);
      }, 120);
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const list = listRef.current;
    const resizeObserver = list ? new ResizeObserver(scheduleUpdate) : null;
    if (list && resizeObserver) resizeObserver.observe(list);

    const visibilityObserver =
      list &&
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) scheduleUpdate();
        },
        { rootMargin: "100% 0px" },
      );
    if (list && visibilityObserver) visibilityObserver.observe(list);

    return () => {
      window.clearInterval(lenisRetryId);
      lenisCleanup?.();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [media.length, scheduleUpdate, updateScales]);

  if (media.length === 0) return null;

  return (
    <div className="scale-gallery">
      <ul ref={listRef} className="scale-gallery__list">
        {media.map((item, index) => {
          const frame = (
            <div
              ref={(node) => {
                frameRefs.current[index] = node;
              }}
              className="scale-gallery__frame"
            >
              {item.href ? (
                <Link href={item.href} className="scale-gallery__link" aria-label={item.alt}>
                  <GalleryMedia item={item} />
                </Link>
              ) : (
                <GalleryMedia item={item} />
              )}
            </div>
          );

          return (
            <li key={`${item.src}-${index}`} className="scale-gallery__slot">
              {frame}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
