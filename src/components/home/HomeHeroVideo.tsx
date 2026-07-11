"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { videos } from "@/data/brand";

const HERO_POSTER = "/assets/images/products/set-12/HSP_5750.jpg";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      if (video.paused) {
        void video.play().catch(() => undefined);
      }
    };

    playVideo();

    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadeddata", playVideo);

    const onVisibilityChange = () => {
      if (!document.hidden) playVideo();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playVideo();
      },
      { threshold: 0.2 }
    );

    observer.observe(video);

    return () => {
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", playVideo);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-screen relative isolate w-full bg-ink"
      aria-label="Hero"
    >
      <div className="absolute inset-0 h-full w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src={videos.hero} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
      </div>

      <motion.button
        type="button"
        onClick={() =>
          sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" })
        }
        className="group pointer-events-auto absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        aria-label="Scroll to explore"
      >
        <span className="editorial-spacing text-[11px] text-white/90 transition-colors group-hover:text-white">
          Scroll to explore
        </span>
        <motion.span
          className="flex h-11 w-6 items-start justify-center rounded-full border border-white/45 p-1.5"
          aria-hidden="true"
        >
          <motion.span
            className="block h-2 w-1 rounded-full bg-white/95"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </motion.button>
    </section>
  );
}
