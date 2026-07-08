"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CollectionCursorProps = {
  imageShiftX?: number;
  imageShiftY?: number;
};

export function CollectionCursor({ imageShiftX = 0, imageShiftY = 0 }: CollectionCursorProps) {
  const reduced = usePrefersReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 420, damping: 38 });
  const springY = useSpring(y, { stiffness: 420, damping: 38 });

  useEffect(() => {
    if (reduced) return;

    document.body.classList.add("has-custom-cursor");

    const move = (event: MouseEvent) => {
      x.set(event.clientX + imageShiftX * 0.12);
      y.set(event.clientY + imageShiftY * 0.12);
      setVisible(true);
    };

    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setHovering(Boolean(target.closest("[data-collection-interactive]")));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", onOver);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseenter", show);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", onOver);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseenter", show);
    };
  }, [imageShiftX, imageShiftY, reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      className="collection-canvas-cursor pointer-events-none fixed top-0 left-0 z-[80]"
      style={{ x: springX, y: springY }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: hovering ? 2.4 : 1,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/90 bg-transparent" />
    </motion.div>
  );
}
