"use client";

import { useEffect, useRef } from "react";
import type { ScrollerItem, ScrollerVisualState } from "@/components/ImageScroller/types";

type ScrollerImageProps = {
  item: ScrollerItem;
  visualState: ScrollerVisualState;
  shouldPreload: boolean;
};

/** Full-screen video layer — plays only while active */
export function ScrollerImage({ item, visualState, shouldPreload }: ScrollerImageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visualState.isActive && visualState.opacity > 0.5) {
      if (!wasActiveRef.current) {
        video.currentTime = 0;
        wasActiveRef.current = true;
      }
      void video.play().catch(() => undefined);
      return;
    }

    wasActiveRef.current = false;
    video.pause();
  }, [visualState.isActive, visualState.opacity]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        zIndex: visualState.zIndex,
        opacity: visualState.opacity,
        transform: `translate3d(0, ${visualState.translateY}px, 0) scale(${visualState.scale})`,
        filter: `blur(${visualState.blur}px) brightness(${visualState.brightness})`,
        willChange: "transform, opacity, filter",
        pointerEvents: visualState.opacity < 0.05 ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        src={item.video}
        muted
        loop
        playsInline
        preload={shouldPreload ? "auto" : "metadata"}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/30" />
    </div>
  );
}
