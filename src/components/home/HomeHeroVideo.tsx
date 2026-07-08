"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { videos } from "@/data/brand";
import "./HomeHeroVideo.css";

const HERO_POSTER = "/assets/images/products/set-12/HSP_5750.jpg";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className="hero-section viewport-fill h-screen w-full snap-start snap-always overflow-visible bg-ink"
      aria-label="Hero"
    >
      <div className="hero-section__media">
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
        <div className="hero-section__fade-top" aria-hidden="true" />
        <div className="hero-section__fade-bottom" aria-hidden="true" />
      </div>

      <div className="hero-section__curve" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroCurveFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
              <stop offset="55%" stopColor="#0a0a0a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 L1440,120 L1440,52 C1080,118 360,8 0,52 Z"
            fill="url(#heroCurveFade)"
          />
        </svg>
      </div>

      <header className="absolute top-0 right-0 left-0 z-20 flex items-start justify-end px-6 py-8 md:px-12">
        <Link
          href="/shop"
          className="editorial-spacing text-[10px] text-cream/70 transition-colors hover:text-cream"
        >
          Shop
        </Link>
      </header>

      <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-20">
        <span className="editorial-spacing text-[9px] text-cream/45">Scroll</span>
        <motion.span
          className="block h-10 w-px origin-top bg-cream/35"
          animate={{ scaleY: [1, 0.45, 1], opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
