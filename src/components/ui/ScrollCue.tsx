"use client";

import { motion } from "framer-motion";

type ScrollCueProps = {
  label?: string;
  className?: string;
};

export function ScrollCue({
  label = "Scroll down to see more",
  className = "",
}: ScrollCueProps) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-2.5 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <span className="editorial-spacing text-[9px] tracking-[0.38em] text-cream/50">{label}</span>
      <motion.span
        className="flex h-9 w-5 items-start justify-center rounded-full border border-cream/25 p-1"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="block h-1.5 w-0.5 rounded-full bg-cream/80"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.span>
    </motion.div>
  );
}
