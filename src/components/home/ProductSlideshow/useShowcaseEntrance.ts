"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const GALLERY_ENTRANCE_DURATION_S = 0.95;

export const LETTER_SPRING = {
  type: "spring" as const,
  stiffness: 48,
  damping: 28,
  mass: 2.1,
};

export const DRESS_SPRING = {
  type: "spring" as const,
  stiffness: 140,
  damping: 20,
  mass: 1,
};

export const PANEL_SPRING = {
  type: "spring" as const,
  stiffness: 160,
  damping: 22,
  mass: 1,
};

const LETTER_COUNT = 6;
export const LETTER_STAGGER_S = 0.42;
const LETTER_DURATION_S = 1.55;
const POST_LETTER_PAUSE_S = 0.35;
const DRESS_STAGGER_S = 0.1;

/** Green → Black & Orange → Red → Pink → Copper (gap dress). */
export const DRESS_REVEAL_ORDER = [0, 1, 2, 3, 4] as const;

export function getLetterEntranceDelay(columnIndex: number): number {
  return GALLERY_ENTRANCE_DURATION_S + columnIndex * LETTER_STAGGER_S;
}

export function getDressEntranceDelay(dressIndex: number): number {
  const order = (DRESS_REVEAL_ORDER as readonly number[]).indexOf(dressIndex);
  if (order === -1) return 0;

  const letterEnd =
    GALLERY_ENTRANCE_DURATION_S +
    (LETTER_COUNT - 1) * LETTER_STAGGER_S +
    LETTER_DURATION_S;
  return letterEnd + POST_LETTER_PAUSE_S + order * DRESS_STAGGER_S;
}

export function getEntranceTotalDuration(): number {
  const lastDressDelay = getDressEntranceDelay(
    DRESS_REVEAL_ORDER[DRESS_REVEAL_ORDER.length - 1],
  );
  return lastDressDelay + 0.55;
}

export function useShowcaseEntrance(sectionRef: RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion();
  const hasTriggered = useRef(false);
  const [entranceStarted, setEntranceStarted] = useState(reduced);
  const [lettersStarted, setLettersStarted] = useState(reduced);
  const [entranceComplete, setEntranceComplete] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setEntranceStarted(true);
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced, sectionRef]);

  useEffect(() => {
    if (reduced || !entranceStarted || lettersStarted) return;

    const timer = window.setTimeout(() => {
      setLettersStarted(true);
    }, GALLERY_ENTRANCE_DURATION_S * 1000);

    return () => window.clearTimeout(timer);
  }, [reduced, entranceStarted, lettersStarted]);

  useEffect(() => {
    if (reduced || !entranceStarted || entranceComplete) return;

    const timer = window.setTimeout(() => {
      setEntranceComplete(true);
    }, getEntranceTotalDuration() * 1000 + 120);

    return () => window.clearTimeout(timer);
  }, [reduced, entranceStarted, entranceComplete]);

  return { entranceStarted, lettersStarted, entranceComplete };
}
