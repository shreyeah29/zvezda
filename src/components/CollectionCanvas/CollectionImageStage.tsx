"use client";

import { useCallback } from "react";
import { motion, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import type { CollectionSlide } from "@/components/CollectionCanvas/types";

type CollectionImageStageProps = {
  slides: CollectionSlide[];
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  currentIndex: number;
  pointerX: number;
  pointerY: number;
};

export function CollectionImageStage({
  slides,
  imageRefs,
  currentIndex,
  pointerX,
  pointerY,
}: CollectionImageStageProps) {
  const parallaxX = useSpring(pointerX * 0.018, { stiffness: 80, damping: 22 });
  const parallaxY = useSpring(pointerY * 0.014, { stiffness: 80, damping: 22 });
  const lightX = useTransform(parallaxX, (value) => 50 + value * 2.2);
  const lightY = useTransform(parallaxY, (value) => 42 + value * 2.2);
  const lightGradient = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.1), transparent 58%)`;

  const setRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      imageRefs.current[index] = node;
    },
    [imageRefs]
  );

  return (
    <div
      className="relative h-full overflow-hidden"
      data-collection-interactive
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.slug}
            ref={setRef(index)}
            className="collection-canvas__image-layer absolute inset-0 flex items-center justify-center"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <motion.div
              className="relative h-[88%] w-[82%]"
              style={{
                x: index === currentIndex ? parallaxX : 0,
                y: index === currentIndex ? parallaxY : 0,
              }}
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={`${slide.title} — editorial campaign`}
                className="h-full w-full object-contain object-center"
                draggable={false}
              />
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div className="collection-canvas__light absolute inset-0" style={{ background: lightGradient }} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
    </div>
  );
}
