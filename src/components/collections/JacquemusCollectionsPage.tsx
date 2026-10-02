"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { jacquemusCollections } from "@/data/jacquemusCollections";
import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./JacquemusCollectionsPage.css";

function CollectionMedia({ item }: { item: (typeof jacquemusCollections)[0]["media"][0] }) {
  const videoRef = useInlineVideoAutoplay(item.type === "video" ? item.src : undefined);
  const content =
    item.type === "video" ? (
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={item.poster}
        controls={false}
        disablePictureInPicture
        className="jm-collections__media"
      >
        <Mp4Sources src={item.src} />
      </video>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.src} alt={item.alt} className="jm-collections__media" draggable={false} />
    );

  if (item.href) {
    return (
      <Link href={item.href} className="jm-collections__cell">
        {content}
      </Link>
    );
  }

  return <div className="jm-collections__cell">{content}</div>;
}

function CollectionTrack({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div className="jm-collections__rail">
      <div ref={trackRef} className="jm-collections__track">
        {children}
      </div>
      {canScrollRight ? (
        <button
          type="button"
          className="jm-collections__scroll"
          onClick={() => {
            const track = trackRef.current;
            if (!track) return;
            track.scrollBy({ left: track.clientWidth * 0.72, behavior: "smooth" });
          }}
          aria-label="Scroll right"
        >
          <span>Scroll</span>
          <span aria-hidden="true">→</span>
        </button>
      ) : null}
    </div>
  );
}

export function JacquemusCollectionsPage() {
  return (
    <div className="jm-collections jacquemus-home">
      {jacquemusCollections.map((collection) => (
        <section key={collection.id} className="jm-collections__section" aria-label={collection.name}>
          <div className="jm-collections__layout">
            <header className="jm-collections__info">
              <h2 className="jm-collections__title">&ldquo;{collection.name}&rdquo;</h2>
              <p className="jm-collections__season">{collection.season}</p>
            </header>

            <CollectionTrack>
              {collection.media.map((item, index) => (
                <CollectionMedia key={`${collection.id}-${item.src}-${index}`} item={item} />
              ))}
            </CollectionTrack>
          </div>
        </section>
      ))}
    </div>
  );
}
