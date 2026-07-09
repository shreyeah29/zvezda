"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GalleryMediaItem } from "@/data/collectionCategories";
import "./AsymmetricGrid.css";

const SIZE_PATTERN = [1, 0.6, 1.4, 0.75, 1.2, 0.55, 1.1, 0.85, 1.35, 0.65, 1.15, 0.7, 1.05, 1.3, 0.6, 0.9];

function seed(n: number) {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
}

function isVideoUrl(url?: string) {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg)$/i.test(url) || url.includes("video");
}

type ResolvedItem = GalleryMediaItem & {
  resolvedUrl: string;
  resolvedType: "foto" | "video";
};

type LayoutCell = {
  item: ResolvedItem;
  idx: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type AsymmetricGridProps = {
  images?: GalleryMediaItem[];
  columns?: number;
  gap?: number;
  borderRadius?: number;
  chaos?: number;
  parallaxStrength?: number;
  backgroundColor?: string;
  showFilters?: boolean;
};

const ratioCache: Record<string, number> = {};

export function AsymmetricGrid({
  images = [],
  columns = 4,
  gap = 20,
  borderRadius = 6,
  chaos = 80,
  parallaxStrength = 8,
  backgroundColor = "#0a0a0a",
  showFilters = true,
}: AsymmetricGridProps) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [containerWidth, setContainerWidth] = useState(900);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgVisible, setImgVisible] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<"todos" | "fotos" | "videos">("todos");
  const [filterTransition, setFilterTransition] = useState(true);

  const allItems = useMemo<ResolvedItem[]>(
    () =>
      images.map((item) => {
        const hasVideo = !!(item.videoFile || item.videoUrl);
        const videoSrc = item.videoFile || item.videoUrl || "";
        const isVideoType =
          item.type === "video" ||
          (item.type === "auto" && (hasVideo || isVideoUrl(item.image)));
        return {
          ...item,
          resolvedUrl: isVideoType && hasVideo ? videoSrc : item.image || "",
          resolvedType: isVideoType ? "video" : "foto",
        };
      }),
    [images]
  );

  const filteredItems = useMemo(() => {
    if (filter === "todos") return allItems;
    if (filter === "fotos") return allItems.filter((item) => item.resolvedType === "foto");
    return allItems.filter((item) => item.resolvedType === "video");
  }, [allItems, filter]);

  const cols =
    containerWidth < 480 ? 1 : containerWidth < 768 ? Math.min(2, columns) : Math.max(2, columns);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(w);
    });
    ro.observe(wrapRef.current);
    setContainerWidth(wrapRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    allItems.forEach((item, i) => {
      if (!item.image || isVideoUrl(item.image)) return;
      const cached = ratioCache[item.image];
      if (cached !== undefined) {
        setRatios((prev) => ({ ...prev, [i]: cached }));
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        const r = img.naturalHeight / img.naturalWidth;
        ratioCache[item.image!] = r;
        setRatios((prev) => ({ ...prev, [i]: r }));
      };
      img.src = item.image;
    });
  }, [allItems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number(entry.target.getAttribute("data-idx"));
              setVisibleItems((prev) => new Set([...prev, idx]));
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "0px 0px 100px 0px" }
      );
      cardRefs.current.forEach((el) => {
        if (el) obs.observe(el);
      });
      return () => obs.disconnect();
    }, 250);
    return () => clearTimeout(timer);
  }, [filter, filteredItems.length, containerWidth]);

  useEffect(() => {
    if (!wrapRef.current || !innerRef.current || parallaxStrength <= 0) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    let curX = 0;
    let curY = 0;
    let rafId = 0;
    const m = { x: 0.5, y: 0.5 };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      m.x = (e.clientX - rect.left) / rect.width;
      m.y = (e.clientY - rect.top) / rect.height;
    };
    const onLeave = () => {
      m.x = 0.5;
      m.y = 0.5;
    };
    const raf = () => {
      const tx = (m.x - 0.5) * parallaxStrength * 2;
      const ty = (m.y - 0.5) * parallaxStrength;
      curX += (tx - curX) * 0.04;
      curY += (ty - curY) * 0.04;
      inner.style.transform = `translate(${curX}px, ${curY}px)`;
      inner.querySelectorAll<HTMLElement>(".ag-img").forEach((img) => {
        const imgX = (m.x - 0.5) * parallaxStrength * -0.6;
        const imgY = (m.y - 0.5) * parallaxStrength * -0.6;
        img.style.transform = `scale(1.12) translate(${imgX}px, ${imgY}px)`;
      });
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [parallaxStrength]);

  const { layouts, totalHeight } = useMemo(() => {
    const colW = Math.floor((containerWidth - gap * (cols + 1)) / cols);
    const colCursors = new Array(cols).fill(gap);
    for (let c = 0; c < cols; c++) {
      colCursors[c] = gap + seed(c * 13) * Math.min(chaos * 0.5, 80);
    }

    const result: LayoutCell[] = [];
    filteredItems.forEach((item, i) => {
      const sizeVar = SIZE_PATTERN[i % SIZE_PATTERN.length];
      const w = Math.round(colW * Math.min(sizeVar, 1));
      const ratio =
        item.resolvedType === "video"
          ? 9 / 16
          : (ratios[allItems.indexOf(item)] ?? 0.9 + seed(i * 7) * 1.2);
      const h = Math.round(w * ratio);
      const minHeight = Math.min(...colCursors);
      const shortestCols = colCursors
        .map((ch, c) => (ch === minHeight ? c : -1))
        .filter((c) => c >= 0);
      const col = shortestCols[Math.floor(seed(i * 31) * shortestCols.length)] ?? 0;
      const colX = gap + col * (colW + gap);
      const xOffset = (seed(i * 3) - 0.5) * Math.min(chaos * 0.25, colW * 0.1);
      const x = Math.max(gap / 2, Math.min(colX + xOffset, containerWidth - w - gap / 2));
      const extraGap = seed(i * 11) * Math.min(chaos * 0.3, 40);
      const y = colCursors[col] + extraGap;
      result.push({ item, idx: i, x, y, w, h });
      colCursors[col] = y + h + gap;
    });

    return { layouts: result, totalHeight: Math.max(...colCursors, 0) + gap * 2 };
  }, [allItems, chaos, cols, containerWidth, filteredItems, gap, ratios]);

  const handleFilterChange = (next: typeof filter) => {
    if (next === filter) return;
    setFilterTransition(false);
    setVisibleItems(new Set());
    setTimeout(() => {
      setFilter(next);
      setFilterTransition(true);
      setTimeout(() => {
        setVisibleItems((prev) => {
          const merged = new Set(prev);
          for (let i = 0; i < 200; i++) merged.add(i);
          return merged;
        });
      }, 600);
    }, 220);
  };

  const openLightbox = (idx: number) => {
    setLightbox(idx);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  };

  const closeLightbox = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setLightbox(null), 260);
  }, []);

  const handleCardClick = (item: ResolvedItem, idx: number) => {
    if (item.resolvedType === "foto" && item.href) {
      router.push(item.href);
      return;
    }
    openLightbox(idx);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        setImgVisible(false);
        setTimeout(() => {
          setLightbox((prev) =>
            prev === null ? null : (prev + 1) % filteredItems.length
          );
          setImgVisible(true);
        }, 180);
      }
      if (e.key === "ArrowLeft") {
        setImgVisible(false);
        setTimeout(() => {
          setLightbox((prev) =>
            prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
          );
          setImgVisible(true);
        }, 180);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox, filteredItems.length, lightbox]);

  const filters = [
    { key: "todos" as const, label: "All" },
    { key: "fotos" as const, label: "Photos" },
    { key: "videos" as const, label: "Videos" },
  ];

  return (
    <div ref={wrapRef} className="ag-wrap" style={{ background: backgroundColor }}>
      <div
        className="ag-vignette"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${backgroundColor} 100%)`,
        }}
      />

      {showFilters && (
        <div className="ag-filters" style={{ padding: `${gap}px ${gap}px 0` }}>
          {filters.map(({ key, label }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                className="ag-pill"
                onClick={() => handleFilterChange(key)}
                style={{
                  background: isActive ? "#ffffff" : "transparent",
                  color: isActive ? "#000000" : "rgba(255,255,255,0.55)",
                  borderColor: isActive ? "transparent" : "rgba(255,255,255,0.15)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div
        ref={innerRef}
        className="ag-inner"
        style={{
          height: filteredItems.length === 0 ? 0 : totalHeight,
          marginTop: gap,
          opacity: filterTransition ? 1 : 0,
          transform: filterTransition ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {layouts.map(({ item, idx, x, y, w, h }) => {
          const isVid = item.resolvedType === "video";
          const isVisible = visibleItems.has(idx);
          const delay = Math.round(seed(idx * 3) * 300);

          return (
            <div
              key={`${filter}-${item.resolvedUrl}-${idx}`}
              data-idx={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="ag-card-wrap"
              style={{
                left: x,
                top: y,
                width: w,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
                zIndex: hoveredIdx === idx ? 10 : 1,
              }}
              onClick={() => handleCardClick(item, idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className="ag-card"
                style={{
                  height: h,
                  borderRadius,
                  transform: hoveredIdx === idx ? "scale(1.03)" : "scale(1)",
                  boxShadow:
                    hoveredIdx === idx
                      ? "0 20px 60px rgba(0,0,0,0.7)"
                      : "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {isVid ? (
                  <>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="ag-img" />
                    ) : (
                      <video
                        src={item.resolvedUrl}
                        muted
                        playsInline
                        className="ag-img"
                      />
                    )}
                    <div className="ag-play">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M5 3L13 8L5 13V3Z" fill="white" />
                      </svg>
                    </div>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.resolvedUrl}
                    alt={item.title || ""}
                    loading="lazy"
                    decoding="async"
                    className="ag-img"
                  />
                )}
                <div className="ag-overlay" />
              </div>
            </div>
          );
        })}
      </div>

      {lightbox !== null && filteredItems[lightbox] && (
        <div
          className="ag-lightbox"
          style={{ opacity: modalVisible ? 1 : 0, transform: modalVisible ? "scale(1)" : "scale(1.02)" }}
          onClick={closeLightbox}
        >
          <button type="button" className="ag-lb-close" onClick={closeLightbox} aria-label="Close">
            ×
          </button>
          <div
            className="ag-lb-content"
            onClick={(e) => e.stopPropagation()}
            style={{ opacity: imgVisible ? 1 : 0 }}
          >
            {filteredItems[lightbox].resolvedType === "video" ? (
              <video
                key={filteredItems[lightbox].resolvedUrl}
                src={filteredItems[lightbox].resolvedUrl}
                controls
                autoPlay
                className="ag-lb-media"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={filteredItems[lightbox].resolvedUrl}
                alt={filteredItems[lightbox].title || ""}
                className="ag-lb-media"
              />
            )}
            {filteredItems[lightbox].title && (
              <p className="ag-lb-title">{filteredItems[lightbox].title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
