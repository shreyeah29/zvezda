"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const GALLERY_ENTRANCE_DURATION_S = 1.1;

export const LETTER_SPRING = {
  type: "spring" as const,
  stiffness: 48,
  damping: 28,
  mass: 2.1,
};

export const DRESS_SPRING = {
  type: "spring" as const,
  stiffness: 52,
  damping: 24,
  mass: 1.9,
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
const DRESS_STAGGER_S = 0.48;
const DRESS_ANIM_DURATION_S = 1.35;

/** Green → Black & Orange → Red → Pink → Copper (gap dress). */
export const DRESS_REVEAL_ORDER = [0, 1, 2, 3, 4] as const;

/** Stagger offset from the moment letters begin (after gallery strips land). */
export function getLetterEntranceDelay(columnIndex: number): number {
  return columnIndex * LETTER_STAGGER_S;
}

export function getLettersCompleteTime(): number {
  return (
    GALLERY_ENTRANCE_DURATION_S +
    (LETTER_COUNT - 1) * LETTER_STAGGER_S +
    LETTER_DURATION_S
  );
}

/** Stagger offset from the moment dresses begin (after letters land). */
export function getDressEntranceDelay(dressIndex: number): number {
  const order = (DRESS_REVEAL_ORDER as readonly number[]).indexOf(dressIndex);
  if (order === -1) return 0;
  return order * DRESS_STAGGER_S;
}

export function getEntranceTotalDuration(): number {
  const dressesStart = getLettersCompleteTime() + POST_LETTER_PAUSE_S;
  const lastDressDelay =
    (DRESS_REVEAL_ORDER.length - 1) * DRESS_STAGGER_S + DRESS_ANIM_DURATION_S;
  return dressesStart + lastDressDelay + 0.2;
}

export function useShowcaseEntrance(sectionRef: RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion();
  const hasTriggered = useRef(false);
  const [entranceStarted, setEntranceStarted] = useState(reduced);
  const [lettersStarted, setLettersStarted] = useState(reduced);
  const [dressesStarted, setDressesStarted] = useState(reduced);
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
    if (reduced || !lettersStarted || dressesStarted) return;

    const dressesDelayMs =
      ((LETTER_COUNT - 1) * LETTER_STAGGER_S +
        LETTER_DURATION_S +
        POST_LETTER_PAUSE_S) *
      1000;

    const timer = window.setTimeout(() => {
      setDressesStarted(true);
    }, dressesDelayMs);

    return () => window.clearTimeout(timer);
  }, [reduced, lettersStarted, dressesStarted]);

  useEffect(() => {
    if (reduced || !entranceStarted || entranceComplete) return;

    const timer = window.setTimeout(() => {
      setEntranceComplete(true);
    }, getEntranceTotalDuration() * 1000 + 120);

    return () => window.clearTimeout(timer);
  }, [reduced, entranceStarted, entranceComplete]);

  return { entranceStarted, lettersStarted, dressesStarted, entranceComplete };
}
