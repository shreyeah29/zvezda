"use client";

import Link from "next/link";
import { homeCollectionPanels } from "@/data/homeCollectionPanels";
import "./HomeCollectionSplit.css";

export function HomeCollectionSplit() {
  return (
    <section className="jm-collection-split" aria-label="Featured collections">
      <div className="jm-collection-split__grid">
        {homeCollectionPanels.map((panel) => (
          <Link
            key={panel.label}
            href={`/products/${panel.productSlug}`}
            className="jm-collection-split__panel"
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
