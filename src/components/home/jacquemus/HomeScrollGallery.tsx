"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { resolveScrollGalleryImages } from "@/data/homeScrollGallery";
import "./HomeScrollGallery.css";

const LOOP_COPIES = 3;

export function HomeScrollGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentWidthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });

  const baseImages = useMemo(() => resolveScrollGalleryImages(), []);
  const loopImages = useMemo(
    () =>
      Array.from({ length: LOOP_COPIES }, (_, copy) =>
        baseImages.map((img, i) => ({ ...img, key: `${copy}-${i}-${img.src}` })),
      ).flat(),
    [baseImages],
  );

  const recenterIfNeeded = useCallback(() => {
    const track = trackRef.current;
    const segment = segmentWidthRef.current;
    if (!track || segment <= 0) return;

    const { scrollLeft } = track;
    if (scrollLeft <= segment * 0.25) {
      track.scrollLeft = scrollLeft + segment;
    } else if (scrollLeft >= segment * (LOOP_COPIES - 0.25)) {
      track.scrollLeft = scrollLeft - segment;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measureAndCenter = () => {
      segmentWidthRef.current = track.scrollWidth / LOOP_COPIES;
      if (segmentWidthRef.current > 0) {
        track.scrollLeft = segmentWidthRef.current;
      }
    };

    measureAndCenter();

    const ro = new ResizeObserver(measureAndCenter);
    ro.observe(track);

    const onScroll = () => recenterIfNeeded();
    track.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      track.removeEventListener("scroll", onScroll);
    };
  }, [recenterIfNeeded, loopImages.length]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
    };
    track.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !trackRef.current) return;
      const dx = e.clientX - dragState.current.startX;
      trackRef.current.scrollLeft = dragState.current.scrollLeft - dx;
    },
    [isDragging],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(false);
      trackRef.current?.releasePointerCapture(e.pointerId);
      recenterIfNeeded();
    },
    [recenterIfNeeded],
  );

  return (
    <section className="jm-scroll-gallery" aria-label="Campaign gallery">
      <hr className="jm-divider" />
      <div
        ref={trackRef}
        className={`jm-scroll-gallery__track${isDragging ? " jm-scroll-gallery__track--dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {loopImages.map((img) => (
          <div key={img.key} className="jm-scroll-gallery__slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="jm-scroll-gallery__image" draggable={false} loading="eager" />
          </div>
        ))}
      </div>
      <hr className="jm-divider" />
    </section>
  );
}
