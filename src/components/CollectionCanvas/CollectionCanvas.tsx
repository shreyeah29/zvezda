"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collections } from "@/data/collections";
import { buildCollectionSlides } from "@/components/CollectionCanvas/types";
import { CollectionCursor } from "@/components/CollectionCanvas/CollectionCursor";
import { CollectionEditorial } from "@/components/CollectionCanvas/CollectionEditorial";
import { CollectionImageStage } from "@/components/CollectionCanvas/CollectionImageStage";
import { CollectionNav } from "@/components/CollectionCanvas/CollectionNav";
import {
  animateCollectionTransition,
  setInitialCollectionState,
} from "@/components/CollectionCanvas/collectionTimeline";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./CollectionCanvas.css";

const WHEEL_THRESHOLD = 72;
const SWIPE_THRESHOLD = 56;

export function CollectionCanvas() {
  const reduced = usePrefersReducedMotion();
  const slides = useMemo(() => buildCollectionSlides(collections), []);

  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const numberARef = useRef<HTMLParagraphElement>(null);
  const numberBRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [inactiveIndex, setInactiveIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const [isActive, setIsActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const transitioningRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const activeLayerRef = useRef<0 | 1>(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
    activeIndexRef.current = activeIndex;
  }, [activeLayer, activeIndex]);

  useEffect(() => {
    const images = imageRefs.current.filter(Boolean) as HTMLElement[];
    const progressBar = progressRef.current;
    const panelA = panelARef.current;
    const panelB = panelBRef.current;
    if (!images.length || !progressBar || !panelA || !panelB) return;

    void (async () => {
      await setInitialCollectionState(images, 0, progressBar);
      const { gsap } = await import("gsap");
      gsap.set(panelA, { opacity: 1, y: 0 });
      gsap.set(panelB, { opacity: 0, y: 0 });
    })();
  }, [slides.length]);

  const runTransition = useCallback(
    async (targetIndex: number) => {
      if (transitioningRef.current || targetIndex === activeIndexRef.current) return;
      if (targetIndex < 0 || targetIndex >= slides.length) return;

      const images = imageRefs.current.filter(Boolean) as HTMLElement[];
      const progressBar = progressRef.current;
      const panelA = panelARef.current;
      const panelB = panelBRef.current;
      const numberA = numberARef.current;
      const numberB = numberBRef.current;

      if (!images.length || !progressBar || !panelA || !panelB || !numberA || !numberB) return;

      const fromIndex = activeIndexRef.current;
      const direction = targetIndex > fromIndex ? "next" : "prev";
      const nextLayer: 0 | 1 = activeLayerRef.current === 0 ? 1 : 0;

      transitioningRef.current = true;
      setIsTransitioning(true);
      setInactiveIndex(targetIndex);

      if (reduced) {
        setActiveIndex(targetIndex);
        setActiveLayer(nextLayer);
        activeIndexRef.current = targetIndex;
        activeLayerRef.current = nextLayer;
        void setInitialCollectionState(images, targetIndex, progressBar);
        transitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      const activePanel = activeLayerRef.current === 0 ? panelA : panelB;
      const inactivePanel = nextLayer === 0 ? panelA : panelB;
      const numberActive = activeLayerRef.current === 0 ? numberA : numberB;
      const numberInactive = nextLayer === 0 ? numberA : numberB;

      await animateCollectionTransition({
        images,
        fromIndex,
        toIndex: targetIndex,
        direction,
        editorial: {
          active: activePanel,
          inactive: inactivePanel,
          numberActive,
          numberInactive,
        },
        progressBar,
        onComplete: () => {
          setActiveIndex(targetIndex);
          setActiveLayer(nextLayer);
          activeIndexRef.current = targetIndex;
          activeLayerRef.current = nextLayer;
          transitioningRef.current = false;
          setIsTransitioning(false);
        },
      });
    },
    [reduced, slides.length]
  );

  const goNext = useCallback(() => {
    const next = (activeIndexRef.current + 1) % slides.length;
    void runTransition(next);
  }, [runTransition, slides.length]);

  const goPrev = useCallback(() => {
    const prev = (activeIndexRef.current - 1 + slides.length) % slides.length;
    void runTransition(prev);
  }, [runTransition, slides.length]);

  const goTo = useCallback(
    (index: number) => {
      void runTransition(index);
    },
    [runTransition]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting && entry.intersectionRatio > 0.45),
      { threshold: [0.45, 0.6, 0.85] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (transitioningRef.current) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, isActive]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = (event: WheelEvent) => {
      if (!isActive || transitioningRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      wheelAccumRef.current += event.deltaY;
      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) return;

      if (wheelAccumRef.current > 0) goNext();
      else goPrev();

      wheelAccumRef.current = 0;
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev, isActive]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!isActive || transitioningRef.current || touchStartRef.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartRef.current;
      const delta = touchStartRef.current - endY;
      touchStartRef.current = null;

      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      if (delta > 0) goNext();
      else goPrev();
    };

    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev, isActive]);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    setPointer({ x, y });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="collection-canvas viewport-fill relative h-screen w-full overflow-hidden bg-black"
      aria-label="Collection editorial canvas"
      onPointerMove={onPointerMove}
    >
      <CollectionCursor imageShiftX={pointer.x * 40} imageShiftY={pointer.y * 40} />

      <div className="collection-canvas__grid relative z-10 grid h-full w-full grid-cols-1 lg:grid-cols-[35fr_65fr]">
        <CollectionEditorial
          slides={slides}
          activeIndex={activeIndex}
          inactiveIndex={inactiveIndex}
          activeLayer={activeLayer}
          panelRefs={{
            panelA: panelARef,
            panelB: panelBRef,
            numberA: numberARef,
            numberB: numberBRef,
          }}
          progressRef={progressRef}
          disabled={isTransitioning}
        />

        <CollectionImageStage
          slides={slides}
          imageRefs={imageRefs}
          currentIndex={activeIndex}
          pointerX={pointer.x}
          pointerY={pointer.y}
        />
      </div>

      <CollectionNav
        total={slides.length}
        currentIndex={activeIndex}
        onSelect={goTo}
        disabled={isTransitioning}
      />

      {isTransitioning && <div className="absolute inset-0 z-50" aria-hidden />}
    </section>
  );
}
