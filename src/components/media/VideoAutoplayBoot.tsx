"use client";

import { useEffect } from "react";
import { playInlineVideo } from "@/hooks/useInlineVideoAutoplay";

function playAllVideos() {
  document.querySelectorAll("video").forEach((video) => playInlineVideo(video));
}

export function VideoAutoplayBoot() {
  useEffect(() => {
    playAllVideos();

    const onFirstGesture = () => playAllVideos();
    document.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
    document.addEventListener("click", onFirstGesture, { once: true, passive: true });

    const onVisibility = () => {
      if (!document.hidden) playAllVideos();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", playAllVideos);

    return () => {
      document.removeEventListener("touchstart", onFirstGesture);
      document.removeEventListener("click", onFirstGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", playAllVideos);
    };
  }, []);

  return null;
}
