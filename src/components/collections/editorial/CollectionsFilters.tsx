"use client";

import { motion } from "framer-motion";
import type { EditorialFilterKey } from "@/data/editorialCollections";
import { EDITORIAL_FILTERS } from "@/data/editorialCollections";
import "./CollectionsFilters.css";

type CollectionsFiltersProps = {
  active: EditorialFilterKey;
  onChange: (filter: EditorialFilterKey) => void;
};

export function CollectionsFilters({ active, onChange }: CollectionsFiltersProps) {
  return (
    <div className="collections-filters editorial-container" role="tablist" aria-label="Filter collections">
      {EDITORIAL_FILTERS.map((filter) => {
        const isActive = active === filter.key;
        return (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.key)}
            className={`collections-filters__pill ${isActive ? "collections-filters__pill--active" : ""}`}
          >
            {isActive && (
              <motion.span
                layoutId="collections-filter-active"
                className="collections-filters__pill-bg"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="collections-filters__pill-label">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
