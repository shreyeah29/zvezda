"use client";

import Link from "next/link";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "./HomeRomanceFilm.css";

const ROMANCE_FILM = "/assets/videos/products/set-1/GardenSolo3.mp4";
const ROMANCE_POSTER = "/assets/images/shop/jardin-elegance-dress/HSP_4309.jpg";

export function HomeRomanceFilm() {
  const filmRef = useInlineVideoAutoplay(ROMANCE_FILM);

  return (
    <section className="jm-home-film" aria-label="Romance collection film">
      <Link href="/collections/romance" className="jm-home-film__hit">
        <video
          ref={filmRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={ROMANCE_POSTER}
          controls={false}
          disablePictureInPicture
          className="jm-home-film__video"
        >
          <Mp4Sources src={ROMANCE_FILM} />
        </video>
        <span className="jm-caption">Romance</span>
      </Link>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
