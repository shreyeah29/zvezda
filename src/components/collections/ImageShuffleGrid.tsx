"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, type Transition } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./ImageShuffleGrid.css";

export type ShuffleGridImage = {
  src: string;
  alt: string;
  href?: string;
};

type AspectRatio = "square" | "landscape" | "portrait";
type ShuffleStyle = "neighbors" | "random" | "diagonal";
type EasingStyle = "easeInOut" | "spring" | "linear" | "easeOut" | "easeIn";

type ImageItem = {
  id: string;
  src: string;
  alt: string;
  href?: string;
  gridPosition: number;
  nextSrc?: string;
  isTransitioning?: boolean;
};

export type ImageShuffleGridProps = {
  images?: ShuffleGridImage[];
  emptySlotColor?: string;
  rows?: number;
  columns?: number;
  gap?: number;
  padding?: number;
  aspectRatio?: AspectRatio;
  objectFit?: React.CSSProperties["objectFit"];
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  swapInterval?: number;
  animationDuration?: number;
  easing?: EasingStyle;
  shuffleStyle?: ShuffleStyle;
  hoverEffect?: boolean;
  hoverScale?: number;
  randomizationIntensity?: number;
  maxSwapsPerInterval?: number;
  enableImageCycle?: boolean;
};

function getAspectRatioValue(ratio: AspectRatio) {
  if (ratio === "landscape") return "16 / 9";
  if (ratio === "portrait") return "9 / 16";
  return "1 / 1";
}

function getTransition(easing: EasingStyle, animationDuration: number): Transition {
  if (easing === "spring") {
    return { type: "spring", stiffness: 300, damping: 30 };
  }
  return { duration: animationDuration, ease: easing };
}

export function ImageShuffleGrid({
  images = [],
  emptySlotColor = "#1a1a1a",
  rows = 3,
  columns = 3,
  gap = 10,
  padding = 20,
  aspectRatio = "square",
  objectFit = "cover",
  borderRadius = 6,
  borderColor = "rgba(255,255,255,0.88)",
  borderWidth = 4,
  backgroundColor = "#0a0a0a",
  swapInterval = 2200,
  animationDuration = 0.8,
  easing = "easeInOut",
  shuffleStyle = "neighbors",
  hoverEffect = true,
  hoverScale = 1.04,
  randomizationIntensity = 100,
  maxSwapsPerInterval = 1,
  enableImageCycle = true,
}: ImageShuffleGridProps) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sources = images.map((img) => img.src).filter(Boolean);
    const loaded = new Set<string>();
    sources.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded.add(src);
        setPreloadedImages(new Set(loaded));
      };
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    const totalSlots = rows * columns;
    const displayImages = images.slice(0, totalSlots);
    const items: ImageItem[] = displayImages.map((image, index) => ({
      id: `image-${index}`,
      src: image.src,
      alt: image.alt || `Image ${index + 1}`,
      href: image.href,
      gridPosition: index,
    }));

    for (let i = displayImages.length; i < totalSlots; i++) {
      items.push({
        id: `empty-${i}`,
        src: "",
        alt: `Empty slot ${i + 1}`,
        gridPosition: i,
      });
    }

    setImageItems(items);
  }, [rows, columns, images]);

  const swapPositions = useCallback(() => {
    if (imageItems.length < 2) return;

    const newImageItems = [...imageItems];
    const usedImages = new Set<number>();
    const swapsToPerform = Math.min(maxSwapsPerInterval, Math.floor(imageItems.length / 2));
    const currentlyVisibleSources = new Set(
      newImageItems.filter((item) => item.src).map((item) => item.src),
    );

    const getAvailableImageForCycle = () => {
      if (!enableImageCycle || images.length <= imageItems.length) return null;
      const available = images.filter((img) => !currentlyVisibleSources.has(img.src));
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    };

    const getNeighbors = (position: number) => {
      const row = Math.floor(position / columns);
      const col = position % columns;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(position - columns);
      if (row < rows - 1) neighbors.push(position + columns);
      if (col > 0) neighbors.push(position - 1);
      if (col < columns - 1) neighbors.push(position + 1);
      return neighbors;
    };

    const getDiagonalNeighbors = (position: number) => {
      const row = Math.floor(position / columns);
      const col = position % columns;
      const neighbors: number[] = [];
      if (row > 0 && col > 0) neighbors.push(position - columns - 1);
      if (row > 0 && col < columns - 1) neighbors.push(position - columns + 1);
      if (row < rows - 1 && col > 0) neighbors.push(position + columns - 1);
      if (row < rows - 1 && col < columns - 1) neighbors.push(position + columns + 1);
      return neighbors;
    };

    for (let swapCount = 0; swapCount < swapsToPerform; swapCount++) {
      const availableImages = newImageItems
        .map((item, index) => ({ item, index }))
        .filter(({ index }) => !usedImages.has(index));

      if (availableImages.length < 2) break;

      const pick = availableImages[Math.floor(Math.random() * availableImages.length)];
      const selectedImageIndex = pick.index;
      const currentPosition = pick.item.gridPosition;

      let neighborPositions: number[] = [];
      if (shuffleStyle === "neighbors") {
        neighborPositions = getNeighbors(currentPosition);
      } else if (shuffleStyle === "diagonal") {
        neighborPositions = getDiagonalNeighbors(currentPosition);
      }

      let neighborImageIndex = -1;

      if (shuffleStyle === "random") {
        const randomIndex1 = Math.floor(Math.random() * availableImages.length);
        let randomIndex2 = Math.floor(Math.random() * availableImages.length);
        while (randomIndex2 === randomIndex1 && availableImages.length > 1) {
          randomIndex2 = Math.floor(Math.random() * availableImages.length);
        }
        neighborImageIndex = availableImages[randomIndex2].index;
      } else {
        const availableNeighbors = neighborPositions.filter((neighborPosition) => {
          const idx = newImageItems.findIndex((item) => item.gridPosition === neighborPosition);
          return idx !== -1 && !usedImages.has(idx);
        });
        if (availableNeighbors.length === 0) continue;
        const randomNeighbor =
          availableNeighbors[Math.floor(Math.random() * availableNeighbors.length)];
        neighborImageIndex = newImageItems.findIndex(
          (item) => item.gridPosition === randomNeighbor,
        );
      }

      if (neighborImageIndex === -1) continue;

      const temp = newImageItems[selectedImageIndex].gridPosition;
      newImageItems[selectedImageIndex].gridPosition =
        newImageItems[neighborImageIndex].gridPosition;
      newImageItems[neighborImageIndex].gridPosition = temp;

      const newImage = getAvailableImageForCycle();
      if (newImage && preloadedImages.has(newImage.src)) {
        newImageItems[selectedImageIndex].nextSrc = newImage.src;
        newImageItems[selectedImageIndex].isTransitioning = true;
        currentlyVisibleSources.add(newImage.src);
        const itemId = newImageItems[selectedImageIndex].id;
        setTimeout(() => {
          startTransition(() => {
            setImageItems((prev) =>
              prev.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      src: item.nextSrc || item.src,
                      href: newImage.href ?? item.href,
                      isTransitioning: false,
                      nextSrc: undefined,
                    }
                  : item,
              ),
            );
          });
        }, animationDuration * 1000 + 50);
      }

      usedImages.add(selectedImageIndex);
      usedImages.add(neighborImageIndex);
    }

    startTransition(() => setImageItems(newImageItems));
  }, [
    animationDuration,
    columns,
    enableImageCycle,
    imageItems,
    images,
    maxSwapsPerInterval,
    preloadedImages,
    rows,
    shuffleStyle,
  ]);

  useEffect(() => {
    if (reduced || imageItems.length === 0) return;
    const interval = setInterval(() => {
      if (Math.random() * 100 < randomizationIntensity) {
        swapPositions();
      }
    }, swapInterval);
    return () => clearInterval(interval);
  }, [swapInterval, swapPositions, randomizationIntensity, reduced, imageItems.length]);

  const getGridPosition = (position: number) => {
    const row = Math.floor(position / columns);
    const col = position % columns;
    return { gridColumn: col + 1, gridRow: row + 1 };
  };

  const handleClick = (item: ImageItem) => {
    if (item.href) router.push(item.href);
  };

  return (
    <div
      className="image-shuffle-grid"
      style={{ backgroundColor, padding, gap }}
    >
      <div
        className="image-shuffle-grid__inner"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap,
        }}
      >
        {imageItems.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            layout
            className="image-shuffle-grid__cell"
            style={{
              ...getGridPosition(item.gridPosition),
              borderRadius,
              backgroundColor: emptySlotColor,
              border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
              aspectRatio: getAspectRatioValue(aspectRatio),
            }}
            transition={getTransition(easing, animationDuration)}
            whileHover={hoverEffect && item.src ? { scale: hoverScale } : undefined}
            onClick={() => handleClick(item)}
            disabled={!item.src}
            aria-label={item.alt}
          >
            {item.src && (
              <motion.img
                src={item.src}
                alt={item.alt}
                className="image-shuffle-grid__img"
                style={{ objectFit }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0 }}
              />
            )}
            {item.nextSrc && (
              <motion.img
                src={item.nextSrc}
                alt={item.alt}
                className="image-shuffle-grid__img image-shuffle-grid__img--next"
                style={{ objectFit }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: animationDuration, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default ImageShuffleGrid;
