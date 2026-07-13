"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  getShowcaseGalleryStrips,
  type ShowcaseGalleryCell,
} from "@/data/showcaseGalleryImages";
import { GALLERY_ENTRANCE_DURATION_S } from "./useShowcaseEntrance";
import "./ShowcaseGalleryFrame.css";

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

const STRIP_ENTRANCE = {
  duration: GALLERY_ENTRANCE_DURATION_S,
  ease: GALLERY_EASE,
};

const CELL_STAGGER_S = 0.018;

type StripEdge = "top" | "bottom" | "left" | "right";

type ShowcaseGalleryFrameProps = {
  visible: boolean;
  active: boolean;
};

function stripHidden(edge: StripEdge) {
  switch (edge) {
    case "top":
      return { y: "-100%", opacity: 0.35 };
    case "bottom":
      return { y: "100%", opacity: 0.35 };
    case "left":
      return { x: "-100%", opacity: 0.35 };
    case "right":
      return { x: "100%", opacity: 0.35 };
  }
}

function cellHidden(edge: StripEdge) {
  switch (edge) {
    case "top":
      return { y: -18, opacity: 0 };
    case "bottom":
      return { y: 18, opacity: 0 };
    case "left":
      return { x: -14, opacity: 0 };
    case "right":
      return { x: 14, opacity: 0 };
  }
}

function GalleryCell({
  cell,
  edge,
  index,
  visible,
  hovered,
  onEnter,
  onLeave,
}: {
  cell: ShowcaseGalleryCell;
  edge: StripEdge;
  index: number;
  visible: boolean;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      className={`ps-gallery-cell ps-gallery-cell--${cell.crop}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={cellHidden(edge)}
      animate={
        visible
          ? {
              x: 0,
              y: 0,
              opacity: 1,
              scale: hovered ? 1.06 : 1,
              filter: hovered ? "brightness(1.08)" : "brightness(1)",
            }
          : cellHidden(edge)
      }
      transition={{
        x: {
          duration: STRIP_ENTRANCE.duration * 0.82,
          ease: GALLERY_EASE,
          delay: index * CELL_STAGGER_S,
        },
        y: {
          duration: STRIP_ENTRANCE.duration * 0.82,
          ease: GALLERY_EASE,
          delay: index * CELL_STAGGER_S,
        },
        opacity: {
          duration: STRIP_ENTRANCE.duration * 0.82,
          ease: GALLERY_EASE,
          delay: index * CELL_STAGGER_S,
        },
        scale: { duration: 0.35, ease: GALLERY_EASE },
        filter: { duration: 0.35, ease: GALLERY_EASE },
      }}
      style={{
        boxShadow: hovered ? "0 14px 36px rgba(0, 0, 0, 0.14)" : "none",
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
  edge,
  visible,
  hoveredId,
  onHover,
}: {
  cells: ShowcaseGalleryCell[];
  edge: "top" | "bottom";
  visible: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <motion.div
      className="ps-gallery-strip ps-gallery-strip--horizontal"
      initial={stripHidden(edge)}
      animate={visible ? { x: 0, y: 0, opacity: 1 } : stripHidden(edge)}
      transition={STRIP_ENTRANCE}
    >
      {cells.map((cell, index) => (
        <GalleryCell
          key={cell.id}
          cell={cell}
          edge={edge}
          index={index}
          visible={visible}
          hovered={hoveredId === cell.id}
          onEnter={() => onHover(cell.id)}
          onLeave={() => onHover(null)}
        />
      ))}
    </motion.div>
  );
}

function VerticalStrip({
  cells,
  edge,
  visible,
  hoveredId,
  onHover,
}: {
  cells: ShowcaseGalleryCell[];
  edge: "left" | "right";
  visible: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <motion.div
      className="ps-gallery-strip ps-gallery-strip--vertical"
      initial={stripHidden(edge)}
      animate={visible ? { x: 0, y: 0, opacity: 1 } : stripHidden(edge)}
      transition={STRIP_ENTRANCE}
    >
      {cells.map((cell, index) => (
        <GalleryCell
          key={cell.id}
          cell={cell}
          edge={edge}
          index={index}
          visible={visible}
          hovered={hoveredId === cell.id}
          onEnter={() => onHover(cell.id)}
          onLeave={() => onHover(null)}
        />
      ))}
    </motion.div>
  );
}

export function ShowcaseGalleryFrame({ visible, active }: ShowcaseGalleryFrameProps) {
  const strips = getShowcaseGalleryStrips();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!active) return null;

  return (
    <div className="ps-gallery-frame" aria-hidden="true">
      <HorizontalStrip
        cells={strips.top}
        edge="top"
        visible={visible}
        hoveredId={hoveredId}
        onHover={setHoveredId}
      />

      <div className="ps-gallery-frame__middle">
        <VerticalStrip
          cells={strips.left}
          edge="left"
          visible={visible}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
        <motion.div
          className="ps-gallery-well"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={
            visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }
          }
          transition={{
            duration: STRIP_ENTRANCE.duration * 0.7,
            ease: GALLERY_EASE,
            delay: STRIP_ENTRANCE.duration * 0.18,
          }}
        />
        <VerticalStrip
          cells={strips.right}
          edge="right"
          visible={visible}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
      </div>

      <HorizontalStrip
        cells={strips.bottom}
        edge="bottom"
        visible={visible}
        hoveredId={hoveredId}
        onHover={setHoveredId}
      />
    </div>
  );
}
