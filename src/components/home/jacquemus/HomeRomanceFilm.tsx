"use client";

import Link from "next/link";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "./HomeRomanceFilm.css";

const BESPOKE_FILM = "/assets/videos/products/set-6/OrangeSolo2.mp4";
const BESPOKE_POSTER = "/assets/images/shop/rosa-imperiale/HSP_2850.jpg";

export function HomeRomanceFilm() {
  const filmRef = useInlineVideoAutoplay(BESPOKE_FILM);

  return (
    <section className="jm-home-film" aria-label="Bespoke collection film">
      <Link href="/products/rosa-imperiale" className="jm-home-film__hit">
        <video
          ref={filmRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={BESPOKE_POSTER}
          controls={false}
          disablePictureInPicture
          className="jm-home-film__video"
        >
          <Mp4Sources src={BESPOKE_FILM} />
        </video>
        <span className="jm-caption">Bespoke</span>
      </Link>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
