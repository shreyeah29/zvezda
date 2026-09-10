"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ScrollerItem, ScrollerVisualState } from "@/components/ImageScroller/types";
import { playInlineVideo } from "@/hooks/useInlineVideoAutoplay";

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

    if (visualState.isActive && visualState.opacity > 0.55) {
      wasActiveRef.current = true;
      playInlineVideo(video);
      return;
    }

    wasActiveRef.current = false;
  }, [visualState.isActive, visualState.opacity]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        zIndex: visualState.zIndex,
        opacity: visualState.opacity,
        scale: visualState.scale,
        filter: `blur(${visualState.blur}px) brightness(${visualState.brightness})`,
        willChange: "transform, opacity, filter",
      }}
    >
      <video
        ref={videoRef}
        src={item.video}
        muted
        loop
        playsInline
        autoPlay
        controls={false}
        disablePictureInPicture
        preload="auto"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/30" />
    </motion.div>
  );
}
