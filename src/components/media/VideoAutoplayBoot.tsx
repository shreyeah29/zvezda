"use client";

import { useEffect } from "react";
import { playInlineVideo } from "@/hooks/useInlineVideoAutoplay";

function playAllVideos() {
  document.querySelectorAll("video").forEach((video) => playInlineVideo(video));
}

export function VideoAutoplayBoot() {
  useEffect(() => {
    playAllVideos();
    const kick = window.requestAnimationFrame(() => {
      playAllVideos();
      window.requestAnimationFrame(playAllVideos);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playInlineVideo(entry.target as HTMLVideoElement);
        });
      },
      { threshold: 0, rootMargin: "240px 0px" },
    );

    const watch = () => {
      document.querySelectorAll("video").forEach((video) => observer.observe(video));
    };
    watch();

    const mutations = new MutationObserver(() => {
      watch();
      playAllVideos();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const onFirstGesture = () => playAllVideos();
    document.addEventListener("touchstart", onFirstGesture, { passive: true });
    document.addEventListener("pointerdown", onFirstGesture, { passive: true });
    document.addEventListener("click", onFirstGesture, { passive: true });

    const onVisibility = () => {
      if (!document.hidden) playAllVideos();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", playAllVideos);
    window.addEventListener("focus", playAllVideos);

    const keepAlive = window.setInterval(() => {
      document.querySelectorAll("video").forEach((video) => {
        if (!video.controls && video.paused) playInlineVideo(video);
      });
    }, 2000);

    return () => {
      window.cancelAnimationFrame(kick);
      window.clearInterval(keepAlive);
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("touchstart", onFirstGesture);
      document.removeEventListener("pointerdown", onFirstGesture);
      document.removeEventListener("click", onFirstGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", playAllVideos);
      window.removeEventListener("focus", playAllVideos);
    };
  }, []);

  return null;
}
