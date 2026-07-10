"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import "./OrganicCarousel.css";

export type OrganicCarouselItem = {
  image: string;
  title: string;
  category?: string;
  subtitle?: string;
};

export type OrganicCarouselHandle = {
  goNext: () => void;
  goPrev: () => void;
  goToIndex: (index: number) => void;
};

type OrganicCarouselProps = {
  items?: OrganicCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  cardGap?: number;
  borderRadius?: number;
  activeScale?: number;
  inactiveOpacity?: number;
  animationSpeed?: number;
  textColor?: string;
  mobileCardWidth?: number;
  mobileCardHeight?: number;
  mobileGap?: number;
  onItemClick?: (index: number) => void;
  onReady?: (api: OrganicCarouselHandle) => void;
};

const SIDE_BUFFER = 6;

function normalizeIndex(index: number, length: number) {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

const OrganicCarousel = forwardRef<OrganicCarouselHandle, OrganicCarouselProps>(
  function OrganicCarousel(
    {
      items = [],
      cardWidth = 248,
      cardHeight = 420,
      cardGap = 56,
      borderRadius = 46,
      activeScale = 1.05,
      inactiveOpacity = 0.55,
      animationSpeed = 0.6,
      textColor = "#f5f0e8",
      mobileCardWidth = 156,
      mobileCardHeight = 268,
      mobileGap = 22,
      onItemClick,
      onReady,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(() => Math.floor(items.length / 2));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [containerWidth, setContainerWidth] = useState(1200);

    useEffect(() => {
      const checkResponsive = () => {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
      };
      checkResponsive();
      window.addEventListener("resize", checkResponsive);
      return () => window.removeEventListener("resize", checkResponsive);
    }, []);

    useEffect(() => {
      const element = containerRef.current;
      if (!element) return;

      const updateWidth = () => setContainerWidth(element.offsetWidth || 1200);
      updateWidth();

      const observer = new ResizeObserver(updateWidth);
      observer.observe(element);
      return () => observer.disconnect();
    }, []);

    const currentCardWidth = isMobile ? mobileCardWidth : isTablet ? cardWidth * 0.79 : cardWidth;
    const currentCardHeight = isMobile ? mobileCardHeight : isTablet ? cardHeight * 0.79 : cardHeight;
    const currentGap = isMobile ? mobileGap : isTablet ? cardGap * 0.7 : cardGap;
    const itemStep = currentCardWidth + currentGap;

    const activeCardCenter = index * itemStep + currentCardWidth / 2;
    const trackX = containerWidth / 2 - activeCardCenter;

    const goToNext = useCallback(() => {
      if (items.length === 0) return;
      setIndex((prev) => prev + 1);
      setHoveredIndex(null);
    }, [items.length]);

    const goToPrev = useCallback(() => {
      if (items.length === 0) return;
      setIndex((prev) => prev - 1);
      setHoveredIndex(null);
    }, [items.length]);

    const goToIndex = useCallback(
      (target: number) => {
        if (target < 0 || target >= items.length) return;
        setIndex((prev) => {
          const current = normalizeIndex(prev, items.length);
          return prev - current + target;
        });
        setHoveredIndex(null);
      },
      [items.length],
    );

    const apiRef = useRef<OrganicCarouselHandle>({
      goNext: goToNext,
      goPrev: goToPrev,
      goToIndex,
    });
    apiRef.current = { goNext: goToNext, goPrev: goToPrev, goToIndex };

    useImperativeHandle(ref, () => apiRef.current);

    useEffect(() => {
      onReady?.(apiRef.current);
    }, [onReady]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        const target = event.target as HTMLElement;
        const isEditable =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable;
        if (isEditable) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goToPrev();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goToNext();
        }
      },
      [goToNext, goToPrev],
    );

    const visibleCards = useMemo(() => {
      const range: number[] = [];
      for (let i = index - SIDE_BUFFER; i <= index + SIDE_BUFFER; i += 1) {
        range.push(i);
      }
      return range;
    }, [index]);

    if (items.length === 0) {
      return (
        <div className="organic-carousel organic-carousel--empty">
          <p className="editorial-spacing text-[9px] text-cream/40">No pieces to show</p>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Atelier collection carousel"
        onKeyDown={handleKeyDown}
        className="organic-carousel"
      >
        <motion.div
          className="organic-carousel__track"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const threshold = 50;
            if (info.offset.x > threshold) goToPrev();
            else if (info.offset.x < -threshold) goToNext();
          }}
          animate={{ x: trackX }}
          transition={{ type: "spring", stiffness: 300, damping: 32, duration: animationSpeed }}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            height: currentCardHeight,
          }}
        >
          {visibleCards.map((virtualIndex) => {
            const itemIndex = normalizeIndex(virtualIndex, items.length);
            const item = items[itemIndex];
            const isActive = virtualIndex === index;
            const isHovered = hoveredIndex === virtualIndex;
            const showInfo = isActive || isHovered;

            return (
              <motion.div
                key={virtualIndex}
                className="organic-carousel__card"
                style={{
                  width: currentCardWidth,
                  left: virtualIndex * itemStep,
                }}
                animate={{
                  scale: isActive ? activeScale : 1,
                  opacity: isActive ? 1 : inactiveOpacity,
                }}
                transition={{ duration: animationSpeed * 0.5, ease: "easeOut" }}
                onMouseEnter={() => {
                  if (!isMobile) setHoveredIndex(virtualIndex);
                }}
                onMouseLeave={() => {
                  if (!isMobile) setHoveredIndex(null);
                }}
                onClick={() => {
                  if (isDragging) return;
                  if (isMobile) {
                    if (isActive) return;
                    setIndex(virtualIndex);
                    return;
                  }
                  if (!isActive) {
                    setIndex(virtualIndex);
                    return;
                  }
                  onItemClick?.(itemIndex);
                }}
              >
                <div
                  className="organic-carousel__image"
                  style={{
                    width: currentCardWidth,
                    height: currentCardHeight,
                    borderRadius: `${borderRadius}%`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} draggable={false} />
                </div>

                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      className="organic-carousel__caption"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.category && (
                        <p className="organic-carousel__category" style={{ color: textColor }}>
                          {item.category}
                        </p>
                      )}
                      <p className="organic-carousel__title" style={{ color: textColor }}>
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="organic-carousel__subtitle" style={{ color: textColor }}>
                          {item.subtitle}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  },
);

export default OrganicCarousel;
