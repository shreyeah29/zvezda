import { useEffect, useRef } from "react";

export function useInlineVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playVideo = () => {
      video.muted = true;
      void video.play().catch(() => undefined);
    };

    playVideo();
    video.load();

    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadeddata", playVideo);

    return () => {
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", playVideo);
    };
  }, []);

  return videoRef;
}
