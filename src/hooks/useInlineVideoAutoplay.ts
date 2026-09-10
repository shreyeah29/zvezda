import { useEffect, useRef } from "react";

function prepare(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.disablePictureInPicture = true;
  if ("disableRemotePlayback" in video) {
    video.disableRemotePlayback = true;
  }
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("preload", "auto");
  video.removeAttribute("controls");
}

function isActivelyPlaying(video: HTMLVideoElement) {
  return !video.paused && !video.ended && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
}

export function playInlineVideo(video: HTMLVideoElement) {
  if (video.controls) return;
  prepare(video);
  if (isActivelyPlaying(video)) return;
  void video.play().catch(() => undefined);
}

export function useInlineVideoAutoplay(src?: string) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => playInlineVideo(video);

    prepare(video);
    if (video.readyState === 0) {
      try {
        video.load();
      } catch {
        /* ignore */
      }
    }
    playVideo();

    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    video.addEventListener("playing", playVideo);

    const onVisibilityChange = () => {
      if (!document.hidden) playVideo();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", playVideo);
    window.addEventListener("focus", playVideo);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playVideo();
      },
      { threshold: 0, rootMargin: "200px 0px" },
    );
    observer.observe(video);

    return () => {
      video.removeEventListener("loadedmetadata", playVideo);
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("playing", playVideo);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", playVideo);
      window.removeEventListener("focus", playVideo);
      observer.disconnect();
    };
  }, [src]);

  return videoRef;
}
