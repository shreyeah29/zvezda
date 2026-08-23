"use client";

import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import "./HomeMobilePinkVideo.css";

const PINK_VIDEO_SRC = "/assets/videos/products/set-15/PinkSolo1.mp4";

function MobilePinkFilm() {
  const videoRef = useInlineVideoAutoplay(PINK_VIDEO_SRC);

  return (
    <section className="hm-pink-video" aria-label="Pink collection film">
      <div className="hm-pink-video__frame">
        <video
          ref={videoRef}
          className="hm-pink-video__media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
        >
          <Mp4Sources src={PINK_VIDEO_SRC} />
        </video>
      </div>
    </section>
  );
}

export function HomeMobilePinkVideo() {
  const isMobile = useMaxWidth(768);
  if (!isMobile) return null;
  return <MobilePinkFilm />;
}
