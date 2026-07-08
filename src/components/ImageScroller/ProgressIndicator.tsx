"use client";

import { motion } from "framer-motion";
import type { ScrollerItem } from "@/components/ImageScroller/types";
import { scrollToPosition } from "@/lib/lenisInstance";
import { SCROLLER_TRIGGER_ID } from "@/hooks/useScrollProgress";

type ProgressIndicatorProps = {
  items: ScrollerItem[];
  activeIndex: number;
  exactIndex: number;
  progress: number;
};

async function scrollToIndex(index: number, itemCount: number) {
  const [{ ScrollTrigger }] = await Promise.all([import("gsap/ScrollTrigger")]);
  const trigger = ScrollTrigger.getById(SCROLLER_TRIGGER_ID);

  if (trigger && itemCount > 1) {
    const progress = index / (itemCount - 1);
    const target = trigger.start + progress * (trigger.end - trigger.start);
    scrollToPosition(target);
    return;
  }

  const container = document.querySelector("[data-scroller-container]");
  if (!container) return;
  const top = container.getBoundingClientRect().top + window.scrollY;
  scrollToPosition(top + index * window.innerHeight);
}

/** Framer-style vertical thumbnail string — sits on the side */
export function ProgressIndicator({
  items,
  activeIndex,
  exactIndex,
  progress,
}: ProgressIndicatorProps) {
  const nearestIndex = Math.min(Math.max(Math.round(exactIndex), 0), items.length - 1);

  return (
    <div className="absolute top-1/2 right-4 z-30 -translate-y-1/2 md:right-8 lg:right-10">
      <div className="relative flex flex-col items-center gap-3 rounded-full border border-cream/10 bg-ink/30 px-2 py-3 backdrop-blur-md md:gap-3.5 md:px-2.5 md:py-4">
        <div className="absolute top-4 bottom-4 left-1/2 w-px -translate-x-1/2 bg-cream/10">
          <div
            className="w-full bg-cream/50 transition-[height] duration-300 ease-out"
            style={{ height: `${Math.max(progress * 100, 4)}%` }}
          />
        </div>

        {items.map((item, index) => {
          const isActive = index === nearestIndex;

          return (
            <button
              key={item.id}
              type="button"
              aria-label={`Scroll to piece ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => void scrollToIndex(index, items.length)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12"
            >
              {isActive && (
                <motion.div
                  layoutId="scroller-thumb-outline"
                  className="absolute inset-0 rounded-lg border-2 border-cream"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <div
                className={`relative h-8 w-8 overflow-hidden rounded-md md:h-10 md:w-10 ${
                  isActive ? "opacity-100" : "opacity-45"
                } transition-opacity duration-300`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
