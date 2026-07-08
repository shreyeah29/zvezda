"use client";

import { forwardRef } from "react";

export const ShopNav = forwardRef<HTMLElement>(function ShopNav(_, ref) {
  return (
    <header
      ref={ref}
      className="absolute top-0 right-0 left-0 z-50 flex items-center justify-end px-6 py-6 text-cream md:px-10 md:py-8"
    >
      <nav className="flex items-center gap-4 md:gap-8">
        <button
          type="button"
          className="editorial-spacing text-[9px] text-cream/50 transition-colors hover:text-cream md:text-[10px]"
        >
          Search
        </button>
        <button
          type="button"
          className="editorial-spacing hidden text-[9px] text-cream/50 transition-colors hover:text-cream md:block md:text-[10px]"
        >
          Wishlist
        </button>
        <button
          type="button"
          className="editorial-spacing hidden text-[9px] text-cream/50 transition-colors hover:text-cream sm:block md:text-[10px]"
        >
          Cart
        </button>
        <button
          type="button"
          className="editorial-spacing rounded-full border border-cream/20 px-4 py-2 text-[9px] text-cream transition-colors hover:bg-cream hover:text-ink md:px-5 md:text-[10px]"
        >
          Contact
        </button>
      </nav>
    </header>
  );
});
