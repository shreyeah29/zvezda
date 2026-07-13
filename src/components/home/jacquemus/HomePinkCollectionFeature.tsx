"use client";

import Link from "next/link";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "./HomeCollectionFeature.css";

const FEATURE_IMAGE = "/assets/images/home-feature/HSP_6032.jpg";
const FEATURE_VIDEO = "/assets/videos/products/set-15/PinkSolo1.mp4";

export function HomePinkCollectionFeature() {
  const featureVideoRef = useInlineVideoAutoplay();

  return (
    <section className="jm-collection-feature" aria-label="Pink collection">
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
            <source src={FEATURE_VIDEO} type="video/mp4" />
          </video>
          <Link href="/products/set-15" className="jm-caption">
            Pink Collection
          </Link>
        </div>
        <div className="jm-collection-feature__panel jm-collection-feature__panel--image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FEATURE_IMAGE}
            alt="Pink collection editorial"
            className="jm-collection-feature__media jm-collection-feature__media--pink-editorial"
          />
        </div>
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
