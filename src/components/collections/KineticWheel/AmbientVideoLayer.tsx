"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AmbientVideoLayerProps = {
  src?: string;
  neighborSrcs?: string[];
  objectPosition?: string;
  /** Full-bleed section layer (default). */
  variant?: "backdrop" | "feature";
};

const readyUrls = new Set<string>();

function warmVideo(url: string) {
  if (!url || typeof document === "undefined") return;
  if (readyUrls.has(url)) return;
  const v = document.createElement("video");
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  v.src = url;
  const mark = () => {
    readyUrls.add(url);
    v.removeEventListener("canplay", mark);
    v.removeEventListener("loadeddata", mark);
  };
  v.addEventListener("canplay", mark);
  v.addEventListener("loadeddata", mark);
  try {
    v.load();
  } catch {
    /* ignore */
  }
}

/**
 * Dual-buffer ambient video: keep previous clip visible until the next
 * is ready, and warm neighbor URLs so wheel switches feel instant.
 */
export function AmbientVideoLayer({
  src,
  neighborSrcs = [],
  objectPosition,
  variant = "backdrop",
}: AmbientVideoLayerProps) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<"a" | "b">("a");
  const [aSrc, setASrc] = useState(src ?? "");
  const [bSrc, setBSrc] = useState("");
  const activeRef = useRef(src ?? "");

  const neighbors = useMemo(
    () => Array.from(new Set(neighborSrcs.filter(Boolean))),
    [neighborSrcs],
  );

  useEffect(() => {
    neighbors.forEach(warmVideo);
  }, [neighbors]);

  useEffect(() => {
    if (!src) {
      activeRef.current = "";
      return;
    }
    if (src === activeRef.current) return;

    const nextIsA = front === "b";
    const el = nextIsA ? aRef.current : bRef.current;
    if (!el) return;

    activeRef.current = src;
    if (nextIsA) setASrc(src);
    else setBSrc(src);

    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    el.preload = "auto";

    let cancelled = false;

    const show = () => {
      if (cancelled) return;
      readyUrls.add(src);
      setFront(nextIsA ? "a" : "b");
      const play = el.play();
      if (play && typeof play.catch === "function") play.catch(() => undefined);
      // pause the other buffer to free decoder
      const other = nextIsA ? bRef.current : aRef.current;
      other?.pause();
    };

    const onReady = () => {
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("loadeddata", onReady);
      show();
    };

    if (el.readyState >= 2 && el.currentSrc.includes(encodeURI(src).split("/").pop() ?? src)) {
      show();
    } else {
      el.addEventListener("canplay", onReady);
      el.addEventListener("loadeddata", onReady);
      try {
        el.load();
      } catch {
        /* ignore */
      }
      // If already warm in cache, browsers often fire quickly
      if (readyUrls.has(src)) {
        requestAnimationFrame(show);
      }
    }

    return () => {
      cancelled = true;
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("loadeddata", onReady);
    };
  }, [src, front]);

  // First mount
  useEffect(() => {
    if (!src) return;
    const el = aRef.current;
    if (!el) return;
    el.muted = true;
    const play = el.play();
    if (play && typeof play.catch === "function") play.catch(() => undefined);
    warmVideo(src);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!src && !aSrc && !bSrc) return null;

  const pos = objectPosition ? { objectPosition } : undefined;

  return (
    <div
      className={`kw__video-layer kw__video-layer--${variant}`}
      aria-hidden={variant === "backdrop" ? true : undefined}
    >
      <video
        ref={aRef}
        className={`kw__video${front === "a" ? " is-front" : ""}`}
        src={aSrc || undefined}
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
        style={pos}
      />
      <video
        ref={bRef}
        className={`kw__video${front === "b" ? " is-front" : ""}`}
        src={bSrc || undefined}
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
        style={pos}
      />
    </div>
  );
}
