"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  CARD_WIDTH,
  getDepthStyle,
  nearestIndex,
  offsetForIndex,
  PRODUCT_SPACING,
} from "@/lib/motion/MotionUtilities";
import { applyCardTransform, animateStageToIndex } from "@/lib/motion/AnimationController";
import { useMomentum } from "./useMomentum";
import { useThumbnailSync } from "./useThumbnailSync";

type UseProductStageOptions = {
  productCount: number;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  thumbStripRef: React.RefObject<HTMLDivElement | null>;
  thumbInnerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onCenterChange?: (index: number) => void;
};

export function useProductStage({
  productCount,
  cardRefs,
  thumbStripRef,
  thumbInnerRef,
  stageRef,
  onDragStart,
  onDragEnd,
  onCenterChange,
}: UseProductStageOptions) {
  const worldOffset = useRef(0);
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const stageCenterX = useRef(0);
  const thumbCenterX = useRef(0);
  const animTween = useRef<gsap.core.Tween | null>(null);
  const dragMovedRef = useRef(false);
  const dragDistance = useRef(0);
  const lastCenterIdx = useRef(-1);

  const { sync } = useThumbnailSync();

  const updateStage = useCallback(() => {
    const center = stageCenterX.current;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const x = i * PRODUCT_SPACING + worldOffset.current;
      const cardCenter = x + CARD_WIDTH / 2;
      applyCardTransform(el, x, getDepthStyle(cardCenter - center));
    });

    sync(thumbInnerRef.current, {
      worldOffset: worldOffset.current,
      stageCenterX: center,
      stripCenterX: thumbCenterX.current,
      productCount,
    });

    const activeIdx = nearestIndex(worldOffset.current, center, productCount);
    if (activeIdx !== lastCenterIdx.current) {
      lastCenterIdx.current = activeIdx;
      onCenterChange?.(activeIdx);
    }
  }, [cardRefs, thumbInnerRef, productCount, sync, onCenterChange]);

  const { setVelocity, start: startMomentum, stop: stopMomentum } = useMomentum({
    onTick: (delta) => {
      worldOffset.current += delta;
      updateStage();
    },
    onEnd: onDragEnd,
  });

  const glideToIndex = useCallback(
    (index: number, onComplete?: () => void) => {
      animTween.current?.kill();
      stopMomentum();
      isDragging.current = false;

      animTween.current = animateStageToIndex({
        index,
        stageCenterX: stageCenterX.current,
        currentOffset: worldOffset.current,
        onUpdate: (v) => {
          worldOffset.current = v;
          updateStage();
        },
        onComplete,
      });
    },
    [updateStage, stopMomentum]
  );

  const nudgeStage = useCallback(
    (direction: -1 | 1) => {
      const idx = nearestIndex(worldOffset.current, stageCenterX.current, productCount);
      const next = Math.max(0, Math.min(productCount - 1, idx + direction));
      if (next !== idx) glideToIndex(next);
    },
    [glideToIndex, productCount]
  );

  useEffect(() => {
    const measure = () => {
      if (stageRef.current) {
        stageCenterX.current = stageRef.current.getBoundingClientRect().width / 2;
      }
      if (thumbStripRef.current) {
        thumbCenterX.current = thumbStripRef.current.getBoundingClientRect().width / 2;
      }
      worldOffset.current = offsetForIndex(0, stageCenterX.current);
      updateStage();
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stageRef, thumbStripRef, updateStage]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-thumb], [data-stage-arrow]")) return;
      animTween.current?.kill();
      stopMomentum();
      isDragging.current = true;
      dragMovedRef.current = false;
      dragDistance.current = 0;
      lastPointerX.current = e.clientX;
      setVelocity(0);
      stage.setPointerCapture(e.pointerId);
      onDragStart?.();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      dragDistance.current += Math.abs(delta);
      if (dragDistance.current > 8) dragMovedRef.current = true;
      setVelocity(delta);
      worldOffset.current += delta;
      updateStage();
    };

    const onPointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      startMomentum();
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
    };
  }, [stageRef, updateStage, startMomentum, stopMomentum, setVelocity, onDragStart]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      animTween.current?.kill();
      stopMomentum();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      worldOffset.current -= delta * 0.75;
      setVelocity(-delta * 0.25);
      updateStage();
      onDragStart?.();
      startMomentum();
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [stageRef, updateStage, startMomentum, stopMomentum, setVelocity, onDragStart]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudgeStage(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nudgeStage(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudgeStage]);

  return {
    glideToIndex,
    nudgeStage,
    getCenterIndex: () => nearestIndex(worldOffset.current, stageCenterX.current, productCount),
    dragMovedRef,
  };
}
