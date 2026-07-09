"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NavLink } from "@/components/layout/NavLink";
import { MiniCart } from "@/components/commerce/MiniCart";
import { FlyToCartLayer } from "@/components/commerce/CommerceAnimations";
import { useCommerce } from "@/context/CommerceContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

export function Navigation() {
  const pathname = usePathname();
  const { cartCount, cartPulse } = useCommerce();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(cartCount);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDisplayCount(cartCount);
  }, [cartCount]);

  return (
    <>
      <FlyToCartLayer />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />

      <motion.header
        className="fixed top-0 right-0 left-0 z-50 px-4 md:px-10"
        initial={false}
        animate={{
          backgroundColor: solid ? "rgba(10,10,10,0.82)" : "rgba(10,10,10,0)",
          backdropFilter: solid ? "blur(12px)" : "blur(0px)",
          borderBottomColor: solid ? "rgba(245,240,232,0.08)" : "rgba(245,240,232,0)",
        }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between py-5 md:py-6">
          <BrandLogo variant="nav" />

          <nav className="hidden items-center gap-6 lg:gap-9 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.href === "/cart" ? (
                <button
                  key={link.href}
                  type="button"
                  data-cart-target
                  onClick={() => setCartOpen(true)}
                  className="group relative inline-flex flex-col items-center py-1"
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <motion.span
                    className="editorial-spacing text-[9px] text-cream/55 transition-colors duration-500 group-hover:text-cream md:text-[10px]"
                    style={{ letterSpacing: "0.32em" }}
                    whileHover={{ y: -2, letterSpacing: "0.42em" }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    animate={cartPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  >
                    Cart
                  </motion.span>
                  <motion.span
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold/90"
                    initial={false}
                    animate={{ scaleX: pathname === "/cart" ? 1 : 0, opacity: pathname === "/cart" ? 1 : 0.6 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <AnimatePresence mode="popLayout">
                    {displayCount > 0 && (
                      <motion.span
                        key={displayCount}
                        initial={{ scale: 0.6, opacity: 0, y: 4 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="absolute -top-1.5 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[8px] font-medium text-ink"
                      >
                        {displayCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <NavLink key={link.href} href={link.href} label={link.label} />
              )
            )}
          </nav>

          {/* Mobile: cart + menu toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              data-cart-target
              onClick={() => setCartOpen(true)}
              className="relative editorial-spacing text-[9px] text-cream/70"
              aria-label={`Cart, ${cartCount} items`}
            >
              Cart
              {displayCount > 0 && (
                <span className="ml-1 text-gold">({displayCount})</span>
              )}
            </button>
            <MobileNav />
          </div>
        </div>
      </motion.header>
    </>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col gap-1.5 p-1"
        aria-label="Open menu"
      >
        <span className="block h-px w-6 bg-cream/80" />
        <span className="block h-px w-4 bg-cream/80" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/96 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="editorial-spacing text-[9px] text-cream/50"
                >
                  Close
                </button>
              </div>
              <nav className="mt-12 flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-4xl font-light text-cream"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
