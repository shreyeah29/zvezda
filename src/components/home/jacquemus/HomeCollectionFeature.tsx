"use client";

import Link from "next/link";
import "./HomeCollectionFeature.css";

const FEATURE_IMAGE = "/assets/images/home-gallery/HSP_2085.jpg";
const FEATURE_VIDEO = "/assets/videos/film/White&BlackTrio.mp4";

export function HomeCollectionFeature() {
  return (
    <section className="jm-collection-feature" aria-label="New collection">
      <div className="jm-collection-feature__grid">
        <div className="jm-collection-feature__panel jm-collection-feature__panel--image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FEATURE_IMAGE} alt="New collection editorial" className="jm-collection-feature__media" />
        </div>
        <div className="jm-collection-feature__panel jm-collection-feature__panel--video">
          <video autoPlay muted loop playsInline className="jm-collection-feature__media">
            <source src={FEATURE_VIDEO} type="video/mp4" />
          </video>
          <Link href="/collections/garden" className="jm-caption">
            New Collection
          </Link>
        </div>
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}
