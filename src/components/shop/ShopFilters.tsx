"use client";

import { useEffect, useId, type ReactNode } from "react";
import {
  SHOP_AVAILABILITY,
  SHOP_COLOURS,
  SHOP_PRICE_BANDS,
  SHOP_SIZES,
  SHOP_SORTS,
  SHOP_TYPES,
} from "@/data/shopCatalog";

type ShopFiltersProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
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
  open,
  onOpen,
  onClose,
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
  const titleId = useId();
  const activeCount =
    colours.length +
    types.length +
    prices.length +
    sizes.length +
    availability.length +
    (sort !== "featured" ? 1 : 0);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  return (
    <div className="shop-filters">
      <div className="shop-filters__bar">
        <button type="button" className="shop-filters__trigger" onClick={onOpen}>
          Filter
          {activeCount > 0 ? <span className="shop-filters__count">{activeCount}</span> : null}
        </button>
        <div className="shop-filters__meta">
          <p>
            {resultCount} {resultCount === 1 ? "piece" : "pieces"}
          </p>
          {activeCount > 0 && (
            <button type="button" className="shop-filters__clear" onClick={onClear}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="shop-filters__page" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <div className="shop-filters__page-inner">
            <header className="shop-filters__page-head">
              <div>
                <p className="shop-filters__page-eyebrow">The Atelier</p>
                <h2 id={titleId} className="shop-filters__page-title">
                  Filter
                </h2>
              </div>
              <button type="button" className="shop-filters__close" onClick={onClose}>
                Close
              </button>
            </header>

            <div className="shop-filters__page-body">
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
                {SHOP_TYPES.map((type) => (
                  <Chip
                    key={type.id}
                    active={types.includes(type.id)}
                    onClick={() => onToggleType(type.id)}
                  >
                    {type.label}
                  </Chip>
                ))}
              </FilterRow>

              <FilterRow label="Price" ariaLabel="Filter by price">
                {SHOP_PRICE_BANDS.map((band) => (
                  <Chip
                    key={band.id}
                    active={prices.includes(band.id)}
                    onClick={() => onTogglePrice(band.id)}
                  >
                    {band.label}
                  </Chip>
                ))}
              </FilterRow>

              <FilterRow label="Size" ariaLabel="Filter by size">
                {SHOP_SIZES.map((size) => (
                  <Chip key={size} active={sizes.includes(size)} onClick={() => onToggleSize(size)}>
                    {size}
                  </Chip>
                ))}
              </FilterRow>

              <FilterRow label="Availability" ariaLabel="Filter by availability">
                {SHOP_AVAILABILITY.map((item) => (
                  <Chip
                    key={item.id}
                    active={availability.includes(item.id)}
                    onClick={() => onToggleAvailability(item.id)}
                  >
                    {item.label}
                  </Chip>
                ))}
              </FilterRow>

              <FilterRow label="Sort" ariaLabel="Sort pieces">
                {SHOP_SORTS.map((item) => (
                  <Chip key={item.id} active={sort === item.id} onClick={() => onSort(item.id)}>
                    {item.label}
                  </Chip>
                ))}
              </FilterRow>
            </div>

            <footer className="shop-filters__page-foot">
              {activeCount > 0 && (
                <button type="button" className="shop-filters__clear" onClick={onClear}>
                  Clear all
                </button>
              )}
              <button type="button" className="shop-filters__apply" onClick={onClose}>
                View {resultCount} {resultCount === 1 ? "piece" : "pieces"}
              </button>
            </footer>
          </div>
        </div>
      )}
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
