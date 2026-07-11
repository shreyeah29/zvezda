"use client";

import { useMemo, useState } from "react";
import {
  editorialCollections,
  filterEditorialCollections,
  type EditorialFilterKey,
} from "@/data/editorialCollections";
import { CollectionsHero } from "./CollectionsHero";
import { CollectionsFilters } from "./CollectionsFilters";
import { CollectionsMasonryGrid } from "./CollectionsMasonryGrid";
import { CollectionsEditorialBreak } from "./CollectionsEditorialBreak";
import "@/components/home/editorial/editorial-theme.css";

export function CollectionsPageContent() {
  const [filter, setFilter] = useState<EditorialFilterKey>("all");

  const filtered = useMemo(() => filterEditorialCollections(filter), [filter]);

  const breakCollections = useMemo(
    () => editorialCollections.filter((c) => ["garden", "noir", "red"].includes(c.slug)),
    [],
  );

  return (
    <div className="editorial-page">
      <CollectionsHero />
      <CollectionsFilters active={filter} onChange={setFilter} />
      <CollectionsMasonryGrid collections={filtered} />

      {filter === "all" &&
        breakCollections.map((collection, index) => (
          <CollectionsEditorialBreak
            key={collection.id}
            collection={collection}
            reverse={index % 2 === 1}
          />
        ))}
    </div>
  );
}
