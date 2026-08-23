"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { videos } from "@/data/brand";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import "./HomeHeroVideo.css";

const HERO_POSTER = "/assets/images/products/set-12/HSP_5750.jpg";

export function HomeHeroVideo() {
  const videoRef = useInlineVideoAutoplay(videos.hero);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useMaxWidth(768);

  return (
    <section
      ref={sectionRef}
      className="hero-screen relative isolate w-full bg-ink"
      aria-label="Hero"
    >
      <div className="absolute inset-0 h-full w-full">
        <div
          className={`hero-screen__poster absolute inset-0 bg-cover bg-center${isPlaying ? " hero-screen__poster--hidden" : ""}`}
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className={`hero-screen__video absolute inset-0 h-full w-full object-cover${
            isMobile ? " hero-screen__video--mobile" : ""
          }`}
          style={{ objectPosition: isMobile ? "center 22%" : "center 28%" }}
          onPlaying={() => setIsPlaying(true)}
        >
          <Mp4Sources src={videos.hero} />
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
        <span className="hero-screen__scroll-label">Scroll to explore</span>
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
