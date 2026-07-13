"use client";

import {
  useState,
  startTransition,
  useRef,
  useEffect,
  type CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { ProductSlideshowProps, SlideItem } from "./types";

let instanceCounter = 0;

const DEFAULT_ITEMS: SlideItem[] = [
  {
    image: {
      src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
      alt: "Gradient 1 - Blue",
    },
    productInfo: {
      title: "Éclipse Satin Blazer",
      description:
        "A tailored, midnight-black satin blazer with structured shoulders and refined lapels, perfect for evening elegance",
      price: "$780",
    },
    buttonLink: "",
  },
  {
    image: {
      src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
      alt: "Gradient 2 - Purple",
    },
    productInfo: {
      title: "Lumen Silk Slip Dress",
      description:
        "Fluid, bias-cut silk dress with a subtle metallic sheen and minimalist silhouette for a polished, contemporary look",
      price: "$999",
    },
    buttonLink: "",
  },
  {
    image: {
      src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
      alt: "Gradient 3 - Orange",
    },
    productInfo: {
      title: "Vérité Cashmere Suit",
      description:
        "Sumptuously soft cashmere knit with a relaxed fit and elongated cuffs, ideal for layering in transitional seasons",
      price: "$450",
    },
    buttonLink: "",
  },
];

function titlePositionStyle(
  alignmentX: "flex-start" | "center" | "flex-end",
  alignmentY: "flex-start" | "center" | "flex-end",
): CSSProperties {
  return {
    position: "absolute",
    top: alignmentY === "flex-start" ? 20 : alignmentY === "center" ? "50%" : "auto",
    bottom: alignmentY === "flex-end" ? 20 : "auto",
    left: alignmentX === "flex-start" ? 20 : alignmentX === "center" ? "50%" : "auto",
    right: alignmentX === "flex-end" ? 20 : "auto",
    transform:
      alignmentX === "center" && alignmentY === "center"
        ? "translate(-50%, -50%)"
        : alignmentX === "center"
          ? "translateX(-50%)"
          : alignmentY === "center"
            ? "translateY(-50%)"
            : "none",
  };
}

function resolveTitleWidth(
  fill: "fit" | "fixed" | "fill" | "relative",
  width: number,
  containerWidth: number | null,
): string {
  if (fill === "fill") {
    if (containerWidth) return `${containerWidth - 40}px`;
    return "100%";
  }
  if (fill === "fixed") return `${width}px`;
  if (fill === "relative") {
    if (containerWidth) return `${(containerWidth * width) / 100}px`;
    return "100%";
  }
  return "fit-content";
}

function resolveContainerWidth(
  fill: "fit" | "fixed" | "fill" | "relative",
  width: number,
  containerWidth: number | null,
  gap: number,
): string {
  if (fill === "fill") {
    if (containerWidth) return `${containerWidth - gap * 2}px`;
    return "100%";
  }
  if (fill === "fixed") return `${width}px`;
  if (fill === "relative") {
    if (containerWidth) return `${(containerWidth * width) / 100}px`;
    return "100%";
  }
  return "fit-content";
}

function formatPriceWithVariants(
  basePrice: string,
  variant1Change: number,
  variant2Change: number,
) {
  const totalChange = variant1Change + variant2Change;
  if (totalChange === 0) return basePrice;

  const priceMatch = basePrice.match(/[\d,.]+/);
  if (!priceMatch) return basePrice;

  const numericPrice = parseFloat(priceMatch[0].replace(/,/g, ""));
  const newPrice = numericPrice + totalChange;
  return basePrice.replace(/[\d,.]+/, newPrice.toFixed(2));
}

export function ProductSlideshow(props: ProductSlideshowProps) {
  const {
    items = DEFAULT_ITEMS,
    settings = {
      gap: 16,
      radius: 8,
      background: "transparent",
      alignmentX: "center",
      alignmentY: "center",
    },
    scaleUp = {
      maxScale: 200,
      time: 0.5,
      easing: "easeInOut",
      sizeDecrement: 15,
    },
    baseSize = { width: 200, height: 250 },
    title = {
      enabled: true,
      text: "YOUR BG TEXT",
      font: {},
      color: "#F0F0F0",
      alignmentX: "center",
      alignmentY: "center",
      fill: "fit",
      width: 300,
    },
    subImages = {
      enabled: true,
      size: 32,
      gap: 8,
      radius: 4,
      position: "bottom",
      alignmentX: "center",
      alignmentY: "flex-end",
      inactiveOpacity: 0.5,
    },
    variants = {
      enabled: true,
      background: "transparent",
      textColor: "#BCB7C9",
      borderWidth: 2,
      borderColor: "#BCB7C9",
      radius: 8,
      padding: 12,
      gap: 8,
      font: {},
      active: {
        background: "transparent",
        textColor: "#FFFFFF",
        borderColor: "#000000",
      },
      hover: {
        background: "transparent",
        textColor: "#000000",
        borderColor: "#000000",
        opacity: 1,
        scale: 0.98,
      },
    },
    description = {
      text: {
        titleFont: {},
        titleColor: "#000000",
        titleAnimation: "fade",
        descriptionFont: {},
        descriptionColor: "#575757",
        priceFont: {},
        priceColor: "#000000",
        textAlign: "left",
        textOrder: ["title", "description", "price", "variants1", "variants2"],
      },
      enabled: true,
      position: "front",
      animation: "fade",
      container: {
        background: "rgba(255, 255, 255, 0)",
        padding: 20,
        gap: 20,
        radius: 8,
        fill: "fixed",
        width: 300,
        borderWidth: 0,
        borderColor: "#000000",
        borderStyle: "solid",
      },
      button: {
        enabled: true,
        type: "primary",
        linkType: "individual",
        globalLink: "https://framer.com",
        label: "Add to Cart",
        background: "#000000",
        textColor: "#FFFFFF",
        font: {},
        radius: 8,
        padding: 12,
        fill: "fill",
        width: 200,
        borderWidth: 2,
        borderColor: "#000000",
        underlineThickness: 2,
        hover: {
          background: "#333333",
          textColor: "#FFFFFF",
          opacity: 1,
          scale: 0.98,
          borderColor: "#333333",
        },
        icon: {
          enabled: false,
          svg:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
          placement: "right",
          size: 16,
          gap: 8,
        },
      },
      alignmentX: "flex-start",
      alignmentY: "flex-start",
    },
    imageFit = "contain",
  } = props;

  const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeSubImageIndex, setActiveSubImageIndex] = useState<number[]>(
    () => displayItems.map(() => 0),
  );
  const [activeVariantIndex, setActiveVariantIndex] = useState<number[]>(
    () => displayItems.map(() => 0),
  );
  const [activeVariant2Index] = useState<number[]>(() => displayItems.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);
  const [descriptionDimensions, setDescriptionDimensions] = useState({
    width: 0,
    height: 0,
  });
  const lastTapTime = useRef(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const instanceId = useRef(instanceCounter++);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDevice = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 1024;
      setIsMobileOrTablet(isTouchDevice && isSmallScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const openSlideshow = (index: number) => {
    startTransition(() => {
      setSelectedIndex(index);
      setIsZoomedIn(true);
      if (description.enabled) setShowProductInfo(true);
    });
  };

  const closeSlideshow = () => {
    startTransition(() => {
      setSelectedIndex(null);
      setIsZoomedIn(false);
      setShowProductInfo(false);
    });
  };

  const handleImageClick = (index: number) => {
    if (isZoomedIn) {
      if (selectedIndex === index) {
        if (isMobileOrTablet) {
          const now = Date.now();
          const timeSinceLastTap = now - lastTapTime.current;
          if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            closeSlideshow();
            lastTapTime.current = 0;
          } else {
            lastTapTime.current = now;
          }
        } else {
          closeSlideshow();
        }
      } else {
        startTransition(() => setSelectedIndex(index));
      }
    } else {
      openSlideshow(index);
    }
  };

  const goToNext = () => {
    startTransition(() => {
      if (selectedIndex !== null && selectedIndex < displayItems.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    });
  };

  const goToPrevious = () => {
    startTransition(() => {
      if (selectedIndex !== null && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === "Escape") closeSlideshow();
    else if (e.key === "ArrowRight") goToNext();
    else if (e.key === "ArrowLeft") goToPrevious();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isZoomedIn || selectedIndex === null) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (scrollCooldown.current) return;

      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 10) return;

      scrollCooldown.current = true;
      if (delta > 0) goToNext();
      else goToPrevious();

      setTimeout(() => {
        scrollCooldown.current = false;
      }, (scaleUp.time ?? 0.5) * 1000);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goToNext/goToPrevious are stable enough for wheel nav
  }, [isZoomedIn, selectedIndex, displayItems.length, scaleUp.time]);

  useEffect(() => {
    if (!showProductInfo || !descriptionRef.current) return;

    const updateDimensions = () => {
      if (descriptionRef.current) {
        setDescriptionDimensions({
          width: descriptionRef.current.offsetWidth,
          height: descriptionRef.current.offsetHeight,
        });
      }
    };

    const timeoutId = setTimeout(updateDimensions, 10);
    return () => clearTimeout(timeoutId);
  }, [showProductInfo, selectedIndex]);

  const cardWidth = baseSize.width ?? 200;
  const cardHeight = baseSize.height ?? 250;
  const maxScale = (scaleUp.maxScale ?? 200) / 100;
  const zoomGap = (settings.gap ?? 16) * 2;
  const sizeDecrement = scaleUp.sizeDecrement ?? 15;

  const renderSubImageStrip = (itemIndex: number, inline = false) => {
    const item = displayItems[itemIndex];
    const hasSubImages = item.subImages && item.subImages.length > 0;
    if (!subImages.enabled || !hasSubImages) return null;

    const currentSubImageIndex = activeSubImageIndex[itemIndex] ?? 0;
    const imageData = item.image;

    const positionStyle: CSSProperties =
      subImages.position === "top"
        ? {
            top: inline ? 10 : 20,
            left:
              subImages.alignmentX === "flex-start"
                ? inline
                  ? 10
                  : 20
                : subImages.alignmentX === "center"
                  ? "50%"
                  : "auto",
            right: subImages.alignmentX === "flex-end" ? (inline ? 10 : 20) : "auto",
            transform:
              subImages.alignmentX === "center" ? "translateX(-50%)" : "none",
            flexDirection: "row",
          }
        : subImages.position === "left"
          ? {
              left: inline ? 10 : 20,
              top:
                subImages.alignmentY === "flex-start"
                  ? inline
                    ? 10
                    : 20
                  : subImages.alignmentY === "center"
                    ? "50%"
                    : "auto",
              bottom: subImages.alignmentY === "flex-end" ? (inline ? 10 : 20) : "auto",
              transform:
                subImages.alignmentY === "center" ? "translateY(-50%)" : "none",
              flexDirection: "column",
            }
          : subImages.position === "right"
            ? {
                right: inline ? 10 : 20,
                top:
                  subImages.alignmentY === "flex-start"
                    ? inline
                      ? 10
                      : 20
                    : subImages.alignmentY === "center"
                      ? "50%"
                      : "auto",
                bottom:
                  subImages.alignmentY === "flex-end" ? (inline ? 10 : 20) : "auto",
                transform:
                  subImages.alignmentY === "center" ? "translateY(-50%)" : "none",
                flexDirection: "column",
              }
            : {
                bottom: inline ? 10 : 20,
                left:
                  subImages.alignmentX === "flex-start"
                    ? inline
                      ? 10
                      : 20
                    : subImages.alignmentX === "center"
                      ? "50%"
                      : "auto",
                right:
                  subImages.alignmentX === "flex-end" ? (inline ? 10 : 20) : "auto",
                transform:
                  subImages.alignmentX === "center" ? "translateX(-50%)" : "none",
                flexDirection: "row",
              };

    return (
      <div
        style={{
          position: inline ? "absolute" : "absolute",
          ...positionStyle,
          display: "flex",
          gap: subImages.gap,
          zIndex: inline ? 20 : 15,
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => {
              setActiveSubImageIndex((prev) => {
                const next = [...prev];
                next[itemIndex] = 0;
                return next;
              });
            });
          }}
          style={{
            width: subImages.size,
            height: subImages.size,
            borderRadius: subImages.radius,
            overflow: "hidden",
            cursor: "pointer",
            opacity: currentSubImageIndex === 0 ? 1 : subImages.inactiveOpacity,
            filter: currentSubImageIndex === 0 ? "none" : "grayscale(100%)",
            transition: "all 0.3s ease",
            flexShrink: 0,
            border: "none",
            padding: 0,
            background: "transparent",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageData.src}
            alt={imageData.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </button>
        {item.subImages?.map((img, subIndex) => {
          const isActive = currentSubImageIndex === subIndex + 1;
          return (
            <button
              key={subIndex}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startTransition(() => {
                  setActiveSubImageIndex((prev) => {
                    const next = [...prev];
                    next[itemIndex] = subIndex + 1;
                    return next;
                  });
                });
              }}
              style={{
                width: subImages.size,
                height: subImages.size,
                borderRadius: subImages.radius,
                overflow: "hidden",
                cursor: "pointer",
                opacity: isActive ? 1 : subImages.inactiveOpacity,
                filter: isActive ? "none" : "grayscale(100%)",
                transition: "all 0.3s ease",
                flexShrink: 0,
                border: "none",
                padding: 0,
                background: "transparent",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          );
        })}
      </div>
    );
  };

  const renderButton = (href: string) => {
    const btn = description.button!;
    const isInternal = href.startsWith("/");

    const style: CSSProperties = {
      backgroundColor:
        btn.type === "primary"
          ? isButtonHovered
            ? btn.hover?.background
            : btn.background
          : "transparent",
      color: isButtonHovered ? btn.hover?.textColor : btn.textColor,
      border:
        btn.type === "secondary"
          ? `${btn.borderWidth}px solid ${
              isButtonHovered ? btn.hover?.borderColor : btn.borderColor
            }`
          : "none",
      borderRadius: btn.radius,
      padding: btn.padding,
      cursor: "pointer",
      width: "100%",
      textDecoration: btn.type === "tertiary" ? "underline" : "none",
      textDecorationThickness:
        btn.type === "tertiary" ? `${btn.underlineThickness}px` : undefined,
      textUnderlineOffset: btn.type === "tertiary" ? "4px" : undefined,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: btn.icon?.enabled ? btn.icon.gap : 0,
      flexDirection: btn.icon?.placement === "left" ? "row" : "row-reverse",
      textAlign: "center",
      opacity: isButtonHovered ? btn.hover?.opacity : 1,
      transform: isButtonHovered ? `scale(${btn.hover?.scale})` : "scale(1)",
      transition: "all 0.2s ease",
      pointerEvents: "auto",
      ...btn.font,
    };

    const content = (
      <>
        {btn.icon?.enabled && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: btn.icon.size,
              height: btn.icon.size,
              flexShrink: 0,
            }}
            dangerouslySetInnerHTML={{ __html: btn.icon.svg ?? "" }}
          />
        )}
        <span>{btn.label}</span>
      </>
    );

    if (isInternal) {
      return (
        <Link
          href={href}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={style}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        style={style}
      >
        {content}
      </a>
    );
  };

  const containerWidth = containerRef.current?.offsetWidth ?? null;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: settings.background,
        overflow: "visible",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {title.enabled && !isZoomedIn && (
        <div
          style={{
            ...titlePositionStyle(
              title.alignmentX ?? "center",
              title.alignmentY ?? "center",
            ),
            zIndex: 1,
            pointerEvents: "none",
            width: resolveTitleWidth(
              title.fill ?? "fit",
              title.width ?? 300,
              containerWidth,
            ),
            ...title.font,
            color: title.color,
            whiteSpace: title.fill === "fit" ? "nowrap" : "normal",
            wordWrap: title.fill !== "fit" ? "break-word" : "normal",
            textAlign: (title.font?.textAlign as CSSProperties["textAlign"]) ?? "center",
          }}
        >
          {title.text}
        </div>
      )}

      <motion.div
        style={{
          display: "flex",
          padding: settings.gap,
          width: "100%",
          height: "100%",
          overflow: "visible",
          flexWrap: "nowrap",
          justifyContent: settings.alignmentX,
          alignItems: settings.alignmentY,
          transformOrigin: "center",
          gap: settings.gap,
          position: "relative",
          zIndex: 5,
        }}
      >
        {displayItems.map((item, index) => {
          const imageData = item.image;
          const hasSubImages = item.subImages && item.subImages.length > 0;
          const currentSubImageIndex = activeSubImageIndex[index] ?? 0;
          const activeImage =
            hasSubImages && currentSubImageIndex > 0
              ? item.subImages![currentSubImageIndex - 1]
              : imageData;

          const scaledWidth = cardWidth * maxScale;
          const offset =
            selectedIndex !== null
              ? (index - selectedIndex) * (scaledWidth + zoomGap)
              : 0;

          return (
            <motion.div
              key={index}
              layoutId={`item-${instanceId.current}-${index}`}
              style={{
                position: isZoomedIn ? "absolute" : "relative",
                borderRadius: settings.radius,
                overflow: "hidden",
                cursor: "pointer",
                width: cardWidth,
                height: cardHeight,
                transformOrigin: "center center",
                flexShrink: 0,
                pointerEvents: "auto",
                background: "transparent",
                ...(isZoomedIn && { left: "50%", top: "50%" }),
              }}
              animate={{
                scale: isZoomedIn
                  ? selectedIndex === index
                    ? maxScale
                    : Math.max(
                        0.1,
                        maxScale *
                          (1 -
                            (Math.abs(selectedIndex! - index) === 1
                              ? (sizeDecrement / 100) * 1.5
                              : Math.abs(selectedIndex! - index) *
                                (sizeDecrement / 100))),
                      )
                  : 1,
                opacity: isZoomedIn
                  ? selectedIndex !== index
                    ? 0.2
                    : 1
                  : hoveredIndex !== null && hoveredIndex !== index
                    ? 0.5
                    : 1,
                x: isZoomedIn ? -cardWidth / 2 + offset : 0,
                y: isZoomedIn ? -cardHeight / 2 : 0,
              }}
              transition={{
                duration: scaleUp.time,
                ease: (scaleUp.easing ?? "easeInOut") as
                  | "linear"
                  | "easeIn"
                  | "easeOut"
                  | "easeInOut"
                  | "circIn"
                  | "circOut"
                  | "circInOut"
                  | "backIn"
                  | "backOut"
                  | "backInOut",
                opacity: isZoomedIn ? { duration: scaleUp.time } : { duration: 0 },
              }}
              drag={isZoomedIn && selectedIndex === index ? "x" : false}
              dragConstraints={{ left: -100, right: 100 }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (!isZoomedIn || selectedIndex !== index) return;
                const swipeThreshold = 30;
                const swipeVelocityThreshold = 300;
                if (
                  Math.abs(info.offset.x) > swipeThreshold ||
                  Math.abs(info.velocity.x) > swipeVelocityThreshold
                ) {
                  if (info.offset.x > 0 || info.velocity.x > 0) goToPrevious();
                  else goToNext();
                }
              }}
              whileHover={!isZoomedIn ? { scale: 1.05 } : undefined}
              whileTap={!isZoomedIn ? { scale: 0.95 } : undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(index);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                srcSet={activeImage.srcSet}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: imageFit,
                  objectPosition: "center bottom",
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
              />
              {subImages.enabled &&
                isZoomedIn &&
                selectedIndex === index &&
                hasSubImages &&
                renderSubImageStrip(index, true)}
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {showProductInfo &&
          selectedIndex !== null &&
          description.enabled &&
          displayItems[selectedIndex]?.productInfo && (
            <motion.div
              ref={descriptionRef}
              initial={
                description.animation === "instant"
                  ? { opacity: 1, y: 0 }
                  : description.animation === "fade"
                    ? { opacity: 0, y: 0 }
                    : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                description.animation === "instant"
                  ? { opacity: 1, y: 0 }
                  : description.animation === "fade"
                    ? { opacity: 0, y: 0 }
                    : { opacity: 0, y: 20 }
              }
              transition={
                description.animation === "instant"
                  ? { duration: 0 }
                  : { duration: 0.3 }
              }
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top:
                  description.alignmentY === "flex-start"
                    ? 20
                    : description.alignmentY === "center"
                      ? descriptionDimensions.height > 0 && containerRef.current
                        ? containerRef.current.getBoundingClientRect().height / 2 -
                          descriptionDimensions.height / 2
                        : "50%"
                      : "auto",
                bottom: description.alignmentY === "flex-end" ? 20 : "auto",
                left:
                  description.alignmentX === "flex-start"
                    ? 20
                    : description.alignmentX === "center"
                      ? descriptionDimensions.width > 0 && containerRef.current
                        ? containerRef.current.getBoundingClientRect().width / 2 -
                          descriptionDimensions.width / 2
                        : "50%"
                      : "auto",
                right: description.alignmentX === "flex-end" ? 20 : "auto",
                transform: "none",
                backgroundColor: description.container?.background,
                padding: description.container?.padding,
                borderRadius: description.container?.radius,
                width: resolveContainerWidth(
                  description.container?.fill ?? "fixed",
                  description.container?.width ?? 300,
                  containerWidth,
                  settings.gap ?? 16,
                ),
                zIndex: description.position === "front" ? 10 : 1,
                display: "flex",
                flexDirection: "column",
                gap: description.container?.gap,
                border:
                  (description.container?.borderWidth ?? 0) > 0
                    ? `${description.container?.borderWidth}px ${description.container?.borderStyle} ${description.container?.borderColor}`
                    : "none",
              }}
            >
              {description.text?.textOrder?.map((element) => {
                const info = displayItems[selectedIndex].productInfo!;

                if (element === "title") {
                  const isShimmer = description.text?.titleAnimation === "shimmer";
                  return (
                    <AnimatePresence mode="wait" key="title-wrapper">
                      <motion.h3
                        key={`title-${selectedIndex}`}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          margin: 0,
                          ...description.text?.titleFont,
                          ...(isShimmer
                            ? {
                                background: `linear-gradient(90deg, ${description.text?.titleColor} 0%, ${description.text?.titleColor} 40%, rgba(255,255,255,0.9) 50%, ${description.text?.titleColor} 60%, ${description.text?.titleColor} 100%)`,
                                backgroundSize: "200% 100%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                color: "transparent",
                              }
                            : { color: description.text?.titleColor }),
                          textAlign: description.text?.textAlign,
                        }}
                      >
                        {info.title}
                      </motion.h3>
                    </AnimatePresence>
                  );
                }

                if (element === "description") {
                  return (
                    <AnimatePresence mode="wait" key="description-wrapper">
                      <motion.div
                        key={`description-${selectedIndex}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          margin: 0,
                          ...description.text?.descriptionFont,
                          color: description.text?.descriptionColor,
                          textAlign: description.text?.textAlign,
                        }}
                      >
                        {info.description}
                      </motion.div>
                    </AnimatePresence>
                  );
                }

                if (element === "price") {
                  const v1 =
                    displayItems[selectedIndex].variants1?.[
                      (activeVariantIndex[selectedIndex] ?? 0) - 1
                    ]?.priceChange ?? 0;
                  const v2 =
                    displayItems[selectedIndex].variants2?.[
                      (activeVariant2Index[selectedIndex] ?? 0) - 1
                    ]?.priceChange ?? 0;

                  return (
                    <AnimatePresence mode="wait" key="price-wrapper">
                      <motion.div
                        key={`price-${selectedIndex}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          margin: 0,
                          ...description.text?.priceFont,
                          color: description.text?.priceColor,
                          textAlign: description.text?.textAlign,
                        }}
                      >
                        {formatPriceWithVariants(info.price, v1, v2)}
                      </motion.div>
                    </AnimatePresence>
                  );
                }

                return null;
              })}

              {variants.enabled &&
                displayItems[selectedIndex]?.variants1 &&
                displayItems[selectedIndex].variants1!.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: variants.gap }}>
                    {displayItems[selectedIndex].variants1!.map((variant, variantIndex) => {
                      const isActive =
                        activeVariantIndex[selectedIndex] === variantIndex + 1;
                      const isHovered = hoveredVariantIndex === variantIndex;
                      return (
                        <button
                          key={variantIndex}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startTransition(() => {
                              setActiveVariantIndex((prev) => {
                                const next = [...prev];
                                next[selectedIndex] = isActive ? 0 : variantIndex + 1;
                                return next;
                              });
                            });
                          }}
                          onMouseEnter={() => setHoveredVariantIndex(variantIndex)}
                          onMouseLeave={() => setHoveredVariantIndex(null)}
                          style={{
                            padding: variants.padding,
                            borderRadius: variants.radius,
                            border: `${variants.borderWidth}px ${isActive ? "solid" : "dotted"} ${
                              isActive
                                ? variants.active?.borderColor
                                : isHovered
                                  ? variants.hover?.borderColor
                                  : variants.borderColor
                            }`,
                            backgroundColor: isActive
                              ? variants.active?.background
                              : isHovered
                                ? variants.hover?.background
                                : variants.background,
                            color: isActive
                              ? variants.active?.textColor
                              : isHovered
                                ? variants.hover?.textColor
                                : variants.textColor,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            ...variants.font,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            opacity: isHovered ? variants.hover?.opacity : 1,
                            transform: isHovered
                              ? `scale(${variants.hover?.scale})`
                              : "scale(1)",
                          }}
                        >
                          {variant.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={variant.image.src}
                              alt={variant.image.alt}
                              style={{
                                width: 20,
                                height: 20,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          )}
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              {description.button?.enabled &&
                ((description.button.linkType === "individual" &&
                  displayItems[selectedIndex]?.buttonLink) ||
                  (description.button.linkType === "global" &&
                    description.button.globalLink)) && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        description.text?.textAlign === "left"
                          ? "flex-start"
                          : description.text?.textAlign === "center"
                            ? "center"
                            : "flex-end",
                      marginTop: (description.container?.gap ?? 20) * 0.5,
                    }}
                  >
                    <div
                      style={{
                        width:
                          description.button.fill === "fill"
                            ? "100%"
                            : description.button.fill === "fixed"
                              ? `${description.button.width}px`
                              : "fit-content",
                      }}
                    >
                      {renderButton(
                        description.button.linkType === "individual"
                          ? displayItems[selectedIndex].buttonLink!
                          : description.button.globalLink!,
                      )}
                    </div>
                  </div>
                )}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export default ProductSlideshow;
