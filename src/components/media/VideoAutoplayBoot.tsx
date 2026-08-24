"use client";

import { useEffect } from "react";
import { playInlineVideo } from "@/hooks/useInlineVideoAutoplay";

function playAllVideos() {
  document.querySelectorAll("video").forEach((video) => playInlineVideo(video));
}

export function VideoAutoplayBoot() {
  useEffect(() => {
    playAllVideos();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playInlineVideo(entry.target as HTMLVideoElement);
        });
      },
      { threshold: 0.01 },
    );

    const watch = () => {
      document.querySelectorAll("video").forEach((video) => observer.observe(video));
    };
    watch();

    const mutations = new MutationObserver(watch);
    mutations.observe(document.body, { childList: true, subtree: true });

    const onFirstGesture = () => playAllVideos();
    document.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
    document.addEventListener("click", onFirstGesture, { once: true, passive: true });

    const onVisibility = () => {
      if (!document.hidden) playAllVideos();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", playAllVideos);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("touchstart", onFirstGesture);
      document.removeEventListener("click", onFirstGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", playAllVideos);
    };
  }, []);

  return null;
}
