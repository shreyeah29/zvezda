"use client";

import type { ReactNode } from "react";
import {
  SHOP_AVAILABILITY,
  SHOP_COLOURS,
  SHOP_PRICE_BANDS,
  SHOP_SIZES,
  SHOP_SORTS,
  SHOP_TYPES,
} from "@/data/shopCatalog";

type ShopFiltersProps = {
  colours: string[];
  types: string[];
  prices: string[];
  sizes: string[];
  availability: string[];
  sort: string;
  resultCount: number;
  onToggleColour: (id: string) => void;
  onToggleType: (id: string) => void;
  onTogglePrice: (id: string) => void;
  onToggleSize: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onSort: (id: string) => void;
  onClear: () => void;
};

export function ShopFilters({
  colours,
  types,
  prices,
  sizes,
  availability,
  sort,
  resultCount,
  onToggleColour,
  onToggleType,
  onTogglePrice,
  onToggleSize,
  onToggleAvailability,
  onSort,
  onClear,
}: ShopFiltersProps) {
  const hasFilters =
    colours.length > 0 ||
    types.length > 0 ||
    prices.length > 0 ||
    sizes.length > 0 ||
    availability.length > 0 ||
    sort !== "featured";

  return (
    <div className="shop-filters">
      <FilterRow label="Colour" ariaLabel="Filter by colour">
        {SHOP_COLOURS.map((colour) => {
          const active = colours.includes(colour.id);
          return (
            <button
              key={colour.id}
              type="button"
              className={`shop-filters__chip${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onToggleColour(colour.id)}
            >
              <span
                className="shop-filters__swatch"
                style={{ backgroundColor: colour.swatch }}
                aria-hidden
              />
              {colour.label}
            </button>
          );
        })}
      </FilterRow>

      <FilterRow label="Type" ariaLabel="Filter by type">
        {SHOP_TYPES.map((type) => {
          const active = types.includes(type.id);
          return (
            <Chip key={type.id} active={active} onClick={() => onToggleType(type.id)}>
              {type.label}
            </Chip>
          );
        })}
      </FilterRow>

      <FilterRow label="Price" ariaLabel="Filter by price">
        {SHOP_PRICE_BANDS.map((band) => {
          const active = prices.includes(band.id);
          return (
            <Chip key={band.id} active={active} onClick={() => onTogglePrice(band.id)}>
              {band.label}
            </Chip>
          );
        })}
      </FilterRow>

      <FilterRow label="Size" ariaLabel="Filter by size">
        {SHOP_SIZES.map((size) => {
          const active = sizes.includes(size);
          return (
            <Chip key={size} active={active} onClick={() => onToggleSize(size)}>
              {size}
            </Chip>
          );
        })}
      </FilterRow>

      <FilterRow label="Availability" ariaLabel="Filter by availability">
        {SHOP_AVAILABILITY.map((item) => {
          const active = availability.includes(item.id);
          return (
            <Chip key={item.id} active={active} onClick={() => onToggleAvailability(item.id)}>
              {item.label}
            </Chip>
          );
        })}
      </FilterRow>

      <FilterRow label="Sort" ariaLabel="Sort pieces">
        {SHOP_SORTS.map((item) => (
          <Chip key={item.id} active={sort === item.id} onClick={() => onSort(item.id)}>
            {item.label}
          </Chip>
        ))}
      </FilterRow>

      <div className="shop-filters__meta">
        <p>
          {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </p>
        {hasFilters && (
          <button type="button" className="shop-filters__clear" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  ariaLabel,
  children,
}: {
  label: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="shop-filters__row">
      <p className="shop-filters__label">{label}</p>
      <div className="shop-filters__chips" role="group" aria-label={ariaLabel}>
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`shop-filters__chip${active ? " is-active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
