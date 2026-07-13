"use client";

import { useMaxWidth } from "@/hooks/useMaxWidth";
import "./HomeMobilePinkVideo.css";

const PINK_VIDEO_SRC = "/assets/videos/products/set-15/PinkSolo1.mp4";

export function HomeMobilePinkVideo() {
  const isMobile = useMaxWidth(768);

  if (!isMobile) return null;

  return (
    <section className="hm-pink-video" aria-label="Pink collection film">
      <div className="hm-pink-video__frame">
        <video
          className="hm-pink-video__media"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={PINK_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
