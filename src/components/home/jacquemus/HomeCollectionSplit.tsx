"use client";

import Link from "next/link";
import {
  homeCollectionPanels,
  homeOccasionPanels,
  type HomeCollectionPanel,
} from "@/data/homeCollectionPanels";
import "./HomeCollectionSplit.css";

function CollectionSplit({
  panels,
  ariaLabel,
}: {
  panels: HomeCollectionPanel[];
  ariaLabel: string;
}) {
  return (
    <section className="jm-collection-split" aria-label={ariaLabel}>
      <div className="jm-collection-split__grid">
        {panels.map((panel) => (
          <Link
            key={panel.image}
            href={panel.href}
            className="jm-collection-split__panel"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={panel.image} alt={panel.label} className="jm-collection-split__image" />
            <div className="jm-split-panel__copy">
              <span className="jm-split-panel__title">{panel.label}</span>
              <span className="jm-split-panel__cta">Explore now</span>
            </div>
          </Link>
        ))}
      </div>
      <hr className="jm-section-rule" aria-hidden="true" />
    </section>
  );
}

export function HomeCollectionSplit() {
  return <CollectionSplit panels={homeCollectionPanels} ariaLabel="Romance" />;
}

export function HomeOccasionSplit() {
  return <CollectionSplit panels={homeOccasionPanels} ariaLabel="The Occasion" />;
}
