"use client";

import Link from "next/link";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "./HomeCollectionFeature.css";

const FEATURE_IMAGE = "/assets/images/home-feature/HSP_6032.jpg";
const FEATURE_VIDEO = "/assets/videos/products/set-15/PinkSolo1.mp4";

export function HomePinkCollectionFeature() {
  const featureVideoRef = useInlineVideoAutoplay(FEATURE_VIDEO);

  return (
    <section className="jm-collection-feature jm-collection-feature--pink" aria-label="Romance collection">
      <div className="jm-collection-feature__grid">
        <div className="jm-collection-feature__panel jm-collection-feature__panel--video">
          <video
            ref={featureVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            className="jm-collection-feature__media jm-collection-feature__video"
          >
            <Mp4Sources src={FEATURE_VIDEO} />
          </video>
          <span className="jm-feature-play" aria-hidden="true" />
          <span className="jm-feature-mobile-label">Romance Collection</span>
          <Link href="/collections/romance" className="jm-caption">
            Romance Collection
          </Link>
        </div>
        <div className="jm-collection-feature__panel jm-collection-feature__panel--image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FEATURE_IMAGE}
            alt="Romance collection editorial"
            className="jm-collection-feature__media jm-collection-feature__media--pink-editorial"
          />
        </div>
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
