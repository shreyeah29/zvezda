"use client";

import { motion } from "framer-motion";

type CollectionNavProps = {
  total: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  disabled: boolean;
};

export function CollectionNav({ total, currentIndex, onSelect, disabled }: CollectionNavProps) {
  return (
    <nav
      className="absolute right-6 bottom-10 z-30 flex flex-col items-end gap-3 md:right-10"
      aria-label="Collection navigation"
    >
      {Array.from({ length: total }, (_, index) => {
        const active = index === currentIndex;
        return (
          <motion.button
            key={index}
            type="button"
            data-collection-interactive
            disabled={disabled}
            aria-label={`Go to collection ${index + 1}`}
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(index)}
            className="collection-canvas__dot group flex items-center gap-3"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className={`editorial-spacing text-[8px] transition-opacity duration-500 ${
                active ? "text-cream/70 opacity-100" : "text-cream/25 opacity-0 group-hover:opacity-100"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                active ? "w-10 bg-cream/75" : "w-4 bg-cream/20 group-hover:w-7 group-hover:bg-cream/45"
              }`}
            />
          </motion.button>
        );
      })}
    </nav>
  );
}
