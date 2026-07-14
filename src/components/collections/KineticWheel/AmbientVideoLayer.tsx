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

function prepVideo(el: HTMLVideoElement) {
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.loop = true;
  el.preload = "auto";
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  el.setAttribute("x-webkit-airplay", "deny");
  el.disablePictureInPicture = true;
}

function tryPlay(el: HTMLVideoElement) {
  el.muted = true;
  const result = el.play();
  if (result && typeof result.catch === "function") {
    result.catch(() => undefined);
  }
}

function warmVideo(url: string) {
  if (!url || typeof document === "undefined") return;
  if (readyUrls.has(url)) return;
  const v = document.createElement("video");
  prepVideo(v);
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

function fileKey(url: string) {
  const parts = url.split("/");
  return parts[parts.length - 1] ?? url;
}

/**
 * Dual-buffer ambient video: keep previous clip visible until the next
 * is ready, and warm neighbor URLs so wheel switches feel instant.
 * Always muted + autoplay — no native play affordance.
 */
export function AmbientVideoLayer({
  src,
  neighborSrcs = [],
  objectPosition,
  variant = "backdrop",
}: AmbientVideoLayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<"a" | "b">("a");
  const [aSrc, setASrc] = useState(src ?? "");
  const [bSrc, setBSrc] = useState("");
  const activeRef = useRef(src ?? "");
  const visibleRef = useRef(true);

  const neighbors = useMemo(
    () => Array.from(new Set(neighborSrcs.filter(Boolean))),
    [neighborSrcs],
  );

  useEffect(() => {
    neighbors.forEach(warmVideo);
  }, [neighbors]);

  // Play once the kinetic section is on screen (page scroll).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const section = root.closest("section") ?? root;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0.2;
        const el = front === "a" ? aRef.current : bRef.current;
        if (!el) return;
        if (visibleRef.current) tryPlay(el);
        else el.pause();
      },
      { threshold: [0, 0.2, 0.5] },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [front]);

  useEffect(() => {
    if (!src) {
      activeRef.current = "";
      return;
    }
    if (src === activeRef.current) {
      const el = front === "a" ? aRef.current : bRef.current;
      if (el && visibleRef.current) tryPlay(el);
      return;
    }

    const nextIsA = front === "b";
    const el = nextIsA ? aRef.current : bRef.current;
    if (!el) return;

    activeRef.current = src;
    if (nextIsA) setASrc(src);
    else setBSrc(src);

    prepVideo(el);
    // Assign src imperatively so load/play aren't waiting on the next React paint.
    if (el.getAttribute("src") !== src) {
      el.src = src;
    }

    let cancelled = false;

    const show = () => {
      if (cancelled) return;
      readyUrls.add(src);
      setFront(nextIsA ? "a" : "b");
      if (visibleRef.current) tryPlay(el);
      const other = nextIsA ? bRef.current : aRef.current;
      other?.pause();
    };

    const onReady = () => {
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("loadeddata", onReady);
      show();
    };

    const already =
      el.readyState >= 2 && el.currentSrc.includes(fileKey(src));

    if (already) {
      show();
    } else {
      el.addEventListener("canplay", onReady);
      el.addEventListener("loadeddata", onReady);
      try {
        el.load();
      } catch {
        /* ignore */
      }
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

  // First mount — start the opening clip immediately.
  useEffect(() => {
    if (!src) return;
    const el = aRef.current;
    if (!el) return;
    prepVideo(el);
    if (!el.src) el.src = src;
    tryPlay(el);
    warmVideo(src);

    const onReady = () => tryPlay(el);
    el.addEventListener("canplay", onReady);
    el.addEventListener("loadeddata", onReady);
    return () => {
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("loadeddata", onReady);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!src && !aSrc && !bSrc) return null;

  const pos = objectPosition ? { objectPosition } : undefined;

  return (
    <div
      ref={rootRef}
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
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
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
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        style={pos}
      />
    </div>
  );
}
