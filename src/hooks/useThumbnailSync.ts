"use client";

import { useCallback } from "react";
import {
  nearestIndex,
  thumbOffsetForStage,
  THUMB_SPACING,
} from "@/lib/motion/MotionUtilities";

type SyncOptions = {
  worldOffset: number;
  stageCenterX: number;
  stripCenterX: number;
  productCount: number;
};

/**
 * Synchronize thumbnail strip position and active state with the main stage.
 */
export function useThumbnailSync() {
  const sync = useCallback(
    (innerEl: HTMLElement | null, opts: SyncOptions) => {
      if (!innerEl) return;

      const { worldOffset, stageCenterX, stripCenterX, productCount } = opts;
      const offset = thumbOffsetForStage(
        worldOffset,
        stageCenterX,
        stripCenterX,
        productCount
      );
      innerEl.style.transform = `translate3d(${offset}px, -50%, 0)`;

      const activeIdx = nearestIndex(worldOffset, stageCenterX, productCount);
      const thumbSize = THUMB_SPACING - 12;

      innerEl.querySelectorAll("[data-thumb]").forEach((node, i) => {
        const el = node as HTMLElement;
        const isActive = i === activeIdx;
        el.style.opacity = isActive ? "1" : "0.42";
        el.style.transform = isActive ? "scale(1.14)" : "scale(1)";
        el.style.boxShadow = isActive
          ? "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(245,240,232,0.25)"
          : "none";
        el.style.borderColor = isActive ? "rgba(245,240,232,0.35)" : "rgba(245,240,232,0.12)";
        el.style.width = `${thumbSize}px`;
        el.style.height = `${thumbSize * 1.35}px`;
      });
    },
    []
  );

  return { sync };
}
