"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NavLink } from "@/components/layout/NavLink";
import { MiniCart } from "@/components/commerce/MiniCart";
import { FlyToCartLayer, FlyToWishlistLayer, WishlistNavButton } from "@/components/commerce/CommerceAnimations";
import { useCommerce } from "@/context/CommerceContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

const navButtonClass =
  "group relative inline-flex min-h-11 min-w-11 flex-col items-center justify-center px-2";

export function Navigation() {
  const pathname = usePathname();
  const { cartCount, cartPulse } = useCommerce();
  const [cartOpen, setCartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(cartCount);
  const [homeHeroNav, setHomeHeroNav] = useState(pathname === "/");

  useEffect(() => {
    setDisplayCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    if (pathname !== "/") {
      setHomeHeroNav(false);
      return;
    }

    const updateHeroNav = () => {
      setHomeHeroNav(window.scrollY < window.innerHeight * 0.85);
    };

    updateHeroNav();
    window.addEventListener("scroll", updateHeroNav, { passive: true });
    return () => window.removeEventListener("scroll", updateHeroNav);
  }, [pathname]);

  const navTone = homeHeroNav ? "light" : "dark";
  const headerClass = homeHeroNav
    ? "pointer-events-none fixed top-0 right-0 left-0 z-50 border-b border-transparent bg-transparent px-4 md:px-10"
    : "pointer-events-none fixed top-0 right-0 left-0 z-50 border-b border-subtle bg-white/92 px-4 backdrop-blur-md md:px-10";

  return (
    <>
      <FlyToCartLayer />
      <FlyToWishlistLayer />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />

      <header className={headerClass}>
        <div className="pointer-events-auto mx-auto flex max-w-[1200px] items-center justify-between py-4 md:py-5">
          <BrandLogo variant="nav" tone={navTone} />

          <nav className="hidden items-center gap-2 md:flex lg:gap-4" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.href === "/cart" ? (
                <button
                  key={link.href}
                  type="button"
                  data-cart-target
                  onClick={() => setCartOpen(true)}
                  className={navButtonClass}
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <motion.span
                    className={cn(
                      "editorial-spacing text-[9px] transition-colors duration-300 md:text-[10px]",
                      navTone === "light"
                        ? "text-white/75 group-hover:text-white"
                        : "text-cream/70 group-hover:text-cream",
                    )}
                    style={{ letterSpacing: "0.32em" }}
                    whileHover={{ y: -2, letterSpacing: "0.42em" }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    animate={cartPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  >
                    Cart
                  </motion.span>
                  <motion.span
                    className="absolute -bottom-0.5 left-2 right-2 h-px origin-left bg-gold/90"
                    initial={false}
                    animate={{ scaleX: pathname === "/cart" ? 1 : 0, opacity: pathname === "/cart" ? 1 : 0.6 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <AnimatePresence mode="popLayout">
                    {displayCount > 0 && (
                      <motion.span
                        key={displayCount}
                        initial={{ scale: 0.6, opacity: 0, y: 4 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[8px] font-medium text-ink"
                      >
                        {displayCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ) : link.href === "/wishlist" ? (
                <WishlistNavButton key={link.href} href={link.href} />
              ) : (
                <NavLink key={link.href} href={link.href} label={link.label} tone={navTone} />
              ),
            )}
          </nav>

          <div className="pointer-events-auto flex items-center gap-1 md:hidden">
            <Link
              href="/wishlist"
              data-wishlist-target
              className={cn(
                "relative inline-flex min-h-11 min-w-11 items-center justify-center transition-colors",
                navTone === "light"
                  ? "text-white/80 hover:text-white"
                  : "text-cream/75 hover:text-cream",
              )}
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M12 20.5s-7.2-4.74-9.6-8.64C.62 8.74 2.24 5.5 5.7 5.5c1.92 0 3.18 1.02 4.3 2.34C11.12 6.52 12.38 5.5 14.3 5.5c3.46 0 5.08 3.24 3.3 6.36C19.2 15.76 12 20.5 12 20.5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <button
              type="button"
              data-cart-target
              onClick={() => setCartOpen(true)}
              className={cn(
                "editorial-spacing relative inline-flex min-h-11 min-w-11 items-center justify-center text-[9px] transition-colors",
                navTone === "light"
                  ? "text-white/80 hover:text-white"
                  : "text-cream/75 hover:text-cream",
              )}
              aria-label={`Cart, ${cartCount} items`}
            >
              Cart
              {displayCount > 0 && <span className="ml-1 text-gold">({displayCount})</span>}
            </button>
            <MobileNav navTone={navTone} />
          </div>
        </div>
      </header>
    </>
  );
}

function MobileNav({ navTone }: { navTone: "light" | "dark" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.classList.add("dg-scroll-lock");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("dg-scroll-lock");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        <span className={cn("block h-px w-6", navTone === "light" ? "bg-white/85" : "bg-cream/80")} />
        <span className={cn("block h-px w-4", navTone === "light" ? "bg-white/85" : "bg-cream/80")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] bg-white/98 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="editorial-spacing inline-flex min-h-11 min-w-11 items-center justify-center text-[9px] text-cream/70 transition-colors hover:text-cream"
                >
                  Close
                </button>
              </div>
              <nav id="mobile-nav" className="mt-8 flex flex-col gap-4" aria-label="Mobile">
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
                      className="inline-flex min-h-11 items-center font-display text-3xl font-light text-cream transition-opacity hover:opacity-70"
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
