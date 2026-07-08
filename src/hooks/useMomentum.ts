"use client";

import { useCallback, useRef } from "react";
import { FRICTION, MIN_VELOCITY } from "@/lib/motion/MotionUtilities";

type UseMomentumOptions = {
  onTick: (delta: number) => void;
  onEnd?: () => void;
};

/**
 * rAF-based momentum loop for luxurious stage glide after release.
 */
export function useMomentum({ onTick, onEnd }: UseMomentumOptions) {
  const velocity = useRef(0);
  const rafId = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    velocity.current = 0;
  }, []);

  const setVelocity = useCallback((v: number) => {
    velocity.current = v;
  }, []);

  const start = useCallback(() => {
    cancelAnimationFrame(rafId.current);

    const loop = () => {
      if (Math.abs(velocity.current) > MIN_VELOCITY) {
        onTick(velocity.current);
        velocity.current *= FRICTION;
        rafId.current = requestAnimationFrame(loop);
      } else {
        velocity.current = 0;
        onEnd?.();
      }
    };

    rafId.current = requestAnimationFrame(loop);
  }, [onTick, onEnd]);

  return { velocity, setVelocity, start, stop };
}
