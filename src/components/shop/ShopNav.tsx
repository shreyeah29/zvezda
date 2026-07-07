"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { brand } from "@/data/brand";

type ShopNavProps = {
  light?: boolean;
};

export const ShopNav = forwardRef<HTMLElement, ShopNavProps>(function ShopNav(
  { light = false },
  ref
) {
  const text = light ? "text-ink" : "text-cream";
  const muted = light ? "text-ink/50 hover:text-ink" : "text-cream/50 hover:text-cream";
  const btn = light
    ? "border-ink/20 text-ink hover:bg-ink hover:text-cream"
    : "border-cream/20 text-cream hover:bg-cream hover:text-ink";

  return (
    <header
      ref={ref}
      className={`absolute top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 ${text}`}
    >
      <Link href="/" className="font-display text-lg tracking-[0.35em] md:text-xl">
        {brand.name}
      </Link>

      <nav className="flex items-center gap-4 md:gap-8">
        <button type="button" className={`editorial-spacing hidden text-[9px] md:block ${muted}`}>
          Search
        </button>
        <button type="button" className={`editorial-spacing hidden text-[9px] md:block ${muted}`}>
          Wishlist
        </button>
        <button type="button" className={`editorial-spacing hidden text-[9px] sm:block ${muted}`}>
          Cart
        </button>
        <button
          type="button"
          className={`editorial-spacing rounded-full border px-4 py-2 text-[9px] transition-colors md:px-5 ${btn}`}
        >
          Contact
        </button>
      </nav>
    </header>
  );
});
