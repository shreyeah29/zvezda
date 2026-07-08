"use client";

import Link from "next/link";
import { brand } from "@/data/brand";

export function ShopNavigation() {
  return (
    <header className="relative z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="font-display text-lg tracking-[0.35em] text-cream md:text-xl">
        {brand.name}
      </Link>

      <nav className="flex items-center gap-4 md:gap-8">
        <button type="button" className="editorial-spacing hidden text-[9px] text-cream/45 transition-colors hover:text-cream md:block">
          Search
        </button>
        <button type="button" className="editorial-spacing hidden text-[9px] text-cream/45 transition-colors hover:text-cream md:block">
          Wishlist
        </button>
        <button type="button" className="editorial-spacing hidden text-[9px] text-cream/45 transition-colors hover:text-cream sm:block">
          Cart
        </button>
        <button
          type="button"
          className="editorial-spacing rounded-full border border-cream/20 px-4 py-2 text-[9px] text-cream transition-colors hover:border-cream/50 md:px-5"
        >
          Contact
        </button>
      </nav>
    </header>
  );
}
