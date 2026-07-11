"use client";

import { useRef, useState, useCallback } from "react";
import "./HomeScrollGallery.css";

const GALLERY_IMAGES = [
  { src: "/assets/images/film/HSP_4145.jpg", alt: "Garden campaign" },
  { src: "/assets/images/film/HSP_4233.jpg", alt: "Runway moment" },
  { src: "/assets/images/film/HSP_4408.jpg", alt: "Editorial walk" },
  { src: "/assets/images/film/HSP_4669.jpg", alt: "Atelier look" },
  { src: "/assets/images/film/HSP_4743.jpg", alt: "Collection detail" },
  { src: "/assets/images/film/HSP_4751.jpg", alt: "Campaign still" },
  { src: "/assets/images/film/HSP_4755.jpg", alt: "Runway portrait" },
  { src: "/assets/images/film/HSP_4779.jpg", alt: "Fashion moment" },
  { src: "/assets/images/film/HSP_4787.jpg", alt: "Editorial frame" },
  { src: "/assets/images/film/HSP_4096.jpg", alt: "Garden trio" },
  { src: "/assets/images/film/HSP_4702.jpg", alt: "Garden duo" },
  { src: "/assets/images/film/HSP_3336.jpg", alt: "Monochrome duo" },
];

export function HomeScrollGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });

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

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    trackRef.current?.releasePointerCapture(e.pointerId);
  }, []);

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
        {GALLERY_IMAGES.map((img) => (
          <div key={img.src} className="jm-scroll-gallery__slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="jm-scroll-gallery__image" draggable={false} />
          </div>
        ))}
      </div>
      <hr className="jm-divider" />
    </section>
  );
}
