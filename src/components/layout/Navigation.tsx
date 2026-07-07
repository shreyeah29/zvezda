"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "@/data/brand";
import { collections } from "@/data/collections";

const links = [
  { href: "/", label: "Home" },
  { href: "/film", label: "Film" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-8 md:px-12">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.4em] text-cream md:text-2xl"
          data-cursor="HOME"
        >
          {brand.name}
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="group flex flex-col gap-2"
          aria-label="Open menu"
          data-cursor="MENU"
        >
          <span className="block h-px w-8 bg-cream transition-transform group-hover:scale-x-110" />
          <span className="block h-px w-5 bg-cream transition-transform group-hover:scale-x-110" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex h-full flex-col justify-between p-6 md:p-12">
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="editorial-spacing text-[10px] text-cream/60 hover:text-cream"
                  data-cursor="CLOSE"
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-col gap-4 md:gap-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-5xl font-light text-cream transition-colors hover:text-gold md:text-7xl"
                      data-cursor="EXPLORE"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-8 border-t border-cream/10 pt-8">
                  <p className="editorial-spacing mb-4 text-[10px] text-muted">Collections</p>
                  <div className="flex flex-col gap-2">
                    {collections.map((col) => (
                      <Link
                        key={col.slug}
                        href={`/collections/${col.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-display text-2xl text-cream/70 transition-colors hover:text-cream md:text-3xl"
                        data-cursor="VIEW"
                      >
                        {col.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              <p className="editorial-spacing text-[10px] text-muted">
                {brand.tagline}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
