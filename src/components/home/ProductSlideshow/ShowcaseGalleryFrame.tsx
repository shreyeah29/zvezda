"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  getShowcaseGalleryStrips,
  type ShowcaseGalleryCell,
} from "@/data/showcaseGalleryImages";
import "./ShowcaseGalleryFrame.css";

const GALLERY_FADE = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as const,
};

type ShowcaseGalleryFrameProps = {
  visible: boolean;
  active: boolean;
};

function GalleryCell({
  cell,
  hovered,
  onEnter,
  onLeave,
}: {
  cell: ShowcaseGalleryCell;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      className={`ps-gallery-cell ps-gallery-cell--${cell.crop}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{
        scale: hovered ? 1.06 : 1,
        filter: hovered ? "brightness(1.08)" : "brightness(1)",
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        boxShadow: hovered
          ? "0 14px 36px rgba(0, 0, 0, 0.14)"
          : "none",
        zIndex: hovered ? 4 : 1,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cell.src} alt="" className="ps-gallery-cell__img" draggable={false} />
    </motion.div>
  );
}

function HorizontalStrip({
  cells,
  hoveredId,
  onHover,
}: {
  cells: ShowcaseGalleryCell[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div className="ps-gallery-strip ps-gallery-strip--horizontal">
      {cells.map((cell) => (
        <GalleryCell
          key={cell.id}
          cell={cell}
          hovered={hoveredId === cell.id}
          onEnter={() => onHover(cell.id)}
          onLeave={() => onHover(null)}
        />
      ))}
    </div>
  );
}

function VerticalStrip({
  cells,
  hoveredId,
  onHover,
}: {
  cells: ShowcaseGalleryCell[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div className="ps-gallery-strip ps-gallery-strip--vertical">
      {cells.map((cell) => (
        <GalleryCell
          key={cell.id}
          cell={cell}
          hovered={hoveredId === cell.id}
          onEnter={() => onHover(cell.id)}
          onLeave={() => onHover(null)}
        />
      ))}
    </div>
  );
}

export function ShowcaseGalleryFrame({ visible, active }: ShowcaseGalleryFrameProps) {
  const strips = getShowcaseGalleryStrips();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!active) return null;

  return (
    <motion.div
      className="ps-gallery-frame"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={GALLERY_FADE}
    >
      <HorizontalStrip
        cells={strips.top}
        hoveredId={hoveredId}
        onHover={setHoveredId}
      />

      <div className="ps-gallery-frame__middle">
        <VerticalStrip
          cells={strips.left}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
        <div className="ps-gallery-well" />
        <VerticalStrip
          cells={strips.right}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
      </div>

      <HorizontalStrip
        cells={strips.bottom}
        hoveredId={hoveredId}
        onHover={setHoveredId}
      />
    </motion.div>
  );
}
