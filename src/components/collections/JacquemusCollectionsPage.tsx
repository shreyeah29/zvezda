"use client";

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

            <div className="jm-collections__track">
              {collection.media.map((item, index) => (
                <CollectionMedia key={`${collection.id}-${item.src}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
