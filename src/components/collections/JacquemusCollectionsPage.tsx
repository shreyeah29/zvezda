"use client";

import Link from "next/link";
import { jacquemusCollections } from "@/data/jacquemusCollections";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./JacquemusCollectionsPage.css";

function CollectionMedia({ item }: { item: (typeof jacquemusCollections)[0]["media"][0] }) {
  const content =
    item.type === "video" ? (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={item.poster}
        className="jm-collections__media"
      >
        <source src={item.src} type="video/mp4" />
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
              <p className="jm-collections__detail">{collection.detail}</p>
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
