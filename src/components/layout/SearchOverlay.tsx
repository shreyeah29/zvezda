"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatProductPrice } from "@/data/products";
import { searchProducts } from "@/data/searchProducts";
import { getLenisInstance } from "@/lib/lenisInstance";
import "./SearchOverlay.css";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const previousPathname = useRef(pathname);
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchProducts(query), [query]);

  useEffect(() => {
    if (open) return;
    setQuery("");
  }, [open]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const lenis = getLenisInstance();
    lenis?.stop();

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }
    body.classList.add("dg-scroll-lock");

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevPaddingRight;
      body.classList.remove("dg-scroll-lock");
      getLenisInstance()?.start();
    };
  }, [open]);

  const trimmed = query.trim();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="jm-search"
          className="jm-search"
          role="dialog"
          aria-modal="true"
          aria-label="Search the atelier"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          data-lenis-prevent
        >
          <div className="jm-search__bar">
            <label className="jm-search__field">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M16.2 16.2 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pieces, pearls, pants…"
                aria-label="Search pieces"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </label>
            <button type="button" className="jm-search__close" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="jm-search__body">
            {!trimmed ? (
              <p className="jm-search__hint">Type a name, colour, or garment — pearl, pants, gown.</p>
            ) : results.length === 0 ? (
              <p className="jm-search__hint">No pieces match “{trimmed}”.</p>
            ) : (
              <ul className="jm-search__results">
                {results.map((product) => (
                  <li key={product.slug}>
                    <Link href={`/products/${product.slug}`} className="jm-search__result" onClick={onClose}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.hero} alt="" />
                      <span className="jm-search__result-copy">
                        <span className="jm-search__result-name">{product.name}</span>
                        <span className="jm-search__result-meta">
                          {product.collectionLabel}
                          {" · "}
                          {formatProductPrice(product)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
