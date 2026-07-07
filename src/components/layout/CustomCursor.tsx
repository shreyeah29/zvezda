"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursor = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel(cursor?.dataset.cursor ?? "");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", onOver);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", onOver);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseenter", show);
    };
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
        style={{ x: springX, y: springY }}
        animate={{ opacity: visible ? 1 : 0, scale: label ? 2.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream bg-transparent" />
      </motion.div>
      {label && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-[90]"
          style={{ x: springX, y: springY }}
        >
          <span className="editorial-spacing -translate-x-1/2 -translate-y-1/2 text-[9px] text-cream">
            {label}
          </span>
        </motion.div>
      )}
    </>
  );
}
