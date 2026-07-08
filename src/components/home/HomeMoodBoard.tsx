"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getMoodBoardItems, type MoodBoardItem } from "@/components/home/moodBoardData";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./MoodBoard.css";

gsap.registerPlugin(ScrollTrigger);

export function HomeMoodBoard() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const items = useMemo(() => getMoodBoardItems(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 48, rotate: items[index]?.rotate ?? 0 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          rotate: items[index]?.rotate ?? 0,
          duration: 1,
          delay: index * 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        });
      });
    }, section);

    const onMove = (event: PointerEvent) => {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      gsap.to(stage, { x, y, duration: 0.9, ease: "power2.out" });
    };

    section.addEventListener("pointermove", onMove);

    return () => {
      section.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, [items, reduced]);

  return (
    <section ref={sectionRef} className="mood-board snap-none" aria-label="Interactive mood board">
      <div className="mood-board__backdrop" aria-hidden="true" />
      <div ref={stageRef} className="mood-board__stage">
        {items.map((item, index) => {
          const isHovered = hoveredId === item.id;
          const isNeighbor = hoveredId !== null && hoveredId !== item.id;

          return (
            <motion.button
              key={item.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              className={`mood-board__item ${isHovered ? "is-hovered" : ""}`}
              style={{
                width: item.width,
                height: item.height,
                top: item.top,
                left: item.left,
                zIndex: item.zIndex,
              }}
              animate={{
                scale: isHovered ? 1.05 : isNeighbor ? 0.96 : 1,
                x: isNeighbor ? (index % 2 === 0 ? -8 : 8) : 0,
                y: isNeighbor ? 6 : 0,
                rotate: isHovered ? 0 : item.rotate,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => router.push(`/products/${item.slug}`)}
              aria-label={`View ${item.label}`}
              data-cursor="VIEW"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} draggable={false} />
              <span className="mood-board__view">View</span>
              <span className="mood-board__label">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="mood-board__veil" aria-hidden="true" />
    </section>
  );
}
