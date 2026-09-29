"use client";

import Link from "next/link";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "./HomeCollectionFeature.css";

const ROMANCE_VIDEO = "/assets/videos/products/set-15/PinkSolo1.mp4";
const BESPOKE_IMAGE = "/assets/images/shop/blooming-rosalia-3d-gown/BHA_4851.jpg";

export function HomeRomanceBespokeSplit() {
  const romanceVideoRef = useInlineVideoAutoplay(ROMANCE_VIDEO);

  return (
    <section className="jm-collection-feature" aria-label="Romance and Bespoke">
      <div className="jm-collection-feature__grid">
        <Link
          href="/collections/romance"
          className="jm-collection-feature__panel jm-collection-feature__panel--video"
        >
          <video
            ref={romanceVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            className="jm-collection-feature__media jm-collection-feature__video"
          >
            <Mp4Sources src={ROMANCE_VIDEO} />
          </video>
          <span className="jm-caption">Romance</span>
        </Link>
        <Link
          href="/collections/bespoke"
          className="jm-collection-feature__panel jm-collection-feature__panel--image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BESPOKE_IMAGE}
            alt="Blooming Rosalia — Bespoke collection"
            className="jm-collection-feature__media jm-collection-feature__media--pink-editorial"
          />
          <span className="jm-caption">Bespoke</span>
        </Link>
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
