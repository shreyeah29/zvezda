"use client";

import Link from "next/link";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "./HomeCollectionFeature.css";

const STATEMENT_VIDEO = "/assets/videos/products/set-13/OrangeSolo1.mp4";
const STATEMENT_IMAGE = "/assets/images/shop/blush-elan/HSP_1743.jpg";

export function HomeRomanceBespokeSplit() {
  const statementVideoRef = useInlineVideoAutoplay(STATEMENT_VIDEO);

  return (
    <section className="jm-collection-feature" aria-label="The Statement">
      <div className="jm-collection-feature__grid">
        <Link
          href="/collections/statement"
          className="jm-collection-feature__panel jm-collection-feature__panel--video"
        >
          <video
            ref={statementVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            className="jm-collection-feature__media jm-collection-feature__video"
          >
            <Mp4Sources src={STATEMENT_VIDEO} />
          </video>
          <span className="jm-caption">The Statement</span>
        </Link>
        <Link
          href="/collections/statement"
          className="jm-collection-feature__panel jm-collection-feature__panel--image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STATEMENT_IMAGE}
            alt="Blush elan — The Statement"
            className="jm-collection-feature__media"
          />
          <span className="jm-caption">The Statement</span>
        </Link>
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
