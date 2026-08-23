import { useEffect, useRef } from "react";

function prepare(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");
}

export function playInlineVideo(video: HTMLVideoElement) {
  prepare(video);
  void video.play().catch(() => undefined);
}

export function useInlineVideoAutoplay(src?: string) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => playInlineVideo(video);

    playVideo();
    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    video.addEventListener("canplaythrough", playVideo);
    video.addEventListener("suspend", playVideo);

    const onVisibilityChange = () => {
      if (!document.hidden) playVideo();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", playVideo);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playVideo();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);

    return () => {
      video.removeEventListener("loadedmetadata", playVideo);
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("canplaythrough", playVideo);
      video.removeEventListener("suspend", playVideo);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", playVideo);
      observer.disconnect();
    };
  }, [src]);

  return videoRef;
}
