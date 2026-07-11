"use client";

import Link from "next/link";
import "./HomeCollectionSplit.css";

const PANELS = [
  {
    label: "Party Collection",
    image: "/assets/images/products/set-12/HSP_5750.jpg",
    href: "/shop",
  },
  {
    label: "Garden Collection",
    image: "/assets/images/film/HSP_4702.jpg",
    href: "/shop",
  },
];

export function HomeCollectionSplit() {
  return (
    <section className="jm-collection-split" aria-label="Featured collections">
      <div className="jm-collection-split__grid">
        {PANELS.map((panel, index) => (
          <Link
            key={panel.label}
            href={panel.href}
            className="jm-collection-split__panel"
            style={{ borderRight: index === 0 ? "1px solid rgba(0,0,0,0.12)" : undefined }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={panel.image} alt={panel.label} className="jm-collection-split__image" />
            <span className="jm-caption">{panel.label}</span>
          </Link>
        ))}
      </div>
      <hr className="jm-divider" />
    </section>
  );
}
