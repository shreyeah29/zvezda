"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CollectionSlide } from "@/components/CollectionCanvas/types";

type CollectionEditorialProps = {
  slides: CollectionSlide[];
  activeIndex: number;
  inactiveIndex: number;
  activeLayer: 0 | 1;
  panelRefs: {
    panelA: React.RefObject<HTMLDivElement | null>;
    panelB: React.RefObject<HTMLDivElement | null>;
    numberA: React.RefObject<HTMLParagraphElement | null>;
    numberB: React.RefObject<HTMLParagraphElement | null>;
  };
  progressRef: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
};

function EditorialPanel({
  slide,
  panelRef,
  numberRef,
  interactive,
}: {
  slide: CollectionSlide;
  panelRef: React.RefObject<HTMLDivElement | null>;
  numberRef: React.RefObject<HTMLParagraphElement | null>;
  interactive: boolean;
}) {
  return (
    <div
      ref={panelRef}
      className="collection-canvas__editorial-panel absolute inset-0 flex flex-col justify-center px-8 md:px-14 lg:px-16"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
      aria-hidden={!interactive}
    >
      <p
        ref={numberRef}
        className="font-display text-[clamp(4rem,11vw,8.5rem)] leading-none font-light text-cream/12"
      >
        {slide.number}
      </p>

      <p className="editorial-spacing mt-8 text-[10px] text-cream/45">{slide.season}</p>

      <h2 className="font-display mt-5 max-w-[14ch] text-[clamp(2.6rem,4.8vw,4.6rem)] leading-[0.95] font-light text-cream">
        {slide.title}
      </h2>

      <p className="editorial-spacing mt-3 text-[10px] text-cream/50">{slide.subtitle}</p>

      <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/58 md:text-[15px]">
        {slide.description}
      </p>

      <motion.div
        className="mt-12"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href={slide.href}
          data-collection-interactive
          className="editorial-spacing group inline-flex items-center gap-4 text-[10px] text-cream/75 transition-colors duration-500 hover:text-cream"
        >
          <span className="h-px w-10 bg-cream/35 transition-all duration-500 group-hover:w-14 group-hover:bg-cream/70" />
          View Collection
        </Link>
      </motion.div>
    </div>
  );
}

export function CollectionEditorial({
  slides,
  activeIndex,
  inactiveIndex,
  activeLayer,
  panelRefs,
  progressRef,
  disabled,
}: CollectionEditorialProps) {
  const slideA = slides[activeLayer === 0 ? activeIndex : inactiveIndex];
  const slideB = slides[activeLayer === 1 ? activeIndex : inactiveIndex];

  return (
    <div className="relative flex h-full flex-col border-r border-white/[0.04]">
      <div className="relative min-h-0 flex-1">
        <EditorialPanel
          slide={slideA}
          panelRef={panelRefs.panelA}
          numberRef={panelRefs.numberA}
          interactive={activeLayer === 0}
        />
        <EditorialPanel
          slide={slideB}
          panelRef={panelRefs.panelB}
          numberRef={panelRefs.numberB}
          interactive={activeLayer === 1}
        />
      </div>

      <div className="px-8 pb-10 md:px-14 lg:px-16">
        <div className="collection-canvas__progress-track h-px w-full bg-white/10">
          <div ref={progressRef} className="collection-canvas__progress-fill h-full w-full bg-cream/55" />
        </div>
        <p className="editorial-spacing mt-4 text-[9px] text-cream/35">
          {String(activeIndex + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </p>
      </div>

      <div
        className={`absolute inset-0 z-20 ${disabled ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!disabled}
      />
    </div>
  );
}
