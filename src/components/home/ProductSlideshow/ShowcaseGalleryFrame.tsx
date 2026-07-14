"use client";

import { motion } from "framer-motion";
import { GALLERY_ENTRANCE_DURATION_S } from "./useShowcaseEntrance";
import "./ShowcaseGalleryFrame.css";

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

const STRIP_ENTRANCE = {
  duration: GALLERY_ENTRANCE_DURATION_S,
  ease: GALLERY_EASE,
};

type ShowcaseGalleryFrameProps = {
  visible: boolean;
  active: boolean;
};

export function ShowcaseGalleryFrame({ visible, active }: ShowcaseGalleryFrameProps) {
  // Border strips removed — clean white well behind the wordmark only.
  if (!active) return null;

  return (
    <div className="ps-gallery-frame ps-gallery-frame--well-only" aria-hidden="true">
      <motion.div
        className="ps-gallery-well"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{
          duration: STRIP_ENTRANCE.duration * 0.7,
          ease: GALLERY_EASE,
          delay: STRIP_ENTRANCE.duration * 0.05,
        }}
      />
    </div>
  );
}
