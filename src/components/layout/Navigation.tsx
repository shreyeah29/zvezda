"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiniCart } from "@/components/commerce/MiniCart";
import { FlyToCartLayer, FlyToWishlistLayer } from "@/components/commerce/CommerceAnimations";
import { useCommerce } from "@/context/CommerceContext";
import { getLenisInstance } from "@/lib/lenisInstance";
import { cn } from "@/lib/utils";
import "./JacquemusNav.css";

const JM_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
];

/** Keep header visible only near the very top of the page. */
const TOP_VISIBLE_PX = 24;

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProductPage = pathname.startsWith("/products/");
  const hasHeroOverlay = isHome || isProductPage;
  const { cartCount } = useCommerce();
  const [cartOpen, setCartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(cartCount);
  const [heroOverlayNav, setHeroOverlayNav] = useState(hasHeroOverlay);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDisplayCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    setHeaderVisible(true);
  }, [pathname]);

  useEffect(() => {
    const getScrollY = () => {
      const lenis = getLenisInstance();
      if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
      return window.scrollY || document.documentElement.scrollTop || 0;
    };

    const updateFromScroll = () => {
      const y = getScrollY();
      setHeaderVisible(y <= TOP_VISIBLE_PX);

      if (hasHeroOverlay) {
        setHeroOverlayNav(y < window.innerHeight * 0.85);
      } else {
        setHeroOverlayNav(false);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("wheel", updateFromScroll, { passive: true });
    window.addEventListener("touchmove", updateFromScroll, { passive: true });

    let lenisCleanup: (() => void) | undefined;
    let retryId = 0;
    const onLenisScroll = () => updateFromScroll();

    const attachLenis = () => {
      const lenis = getLenisInstance();
      if (!lenis || lenisCleanup) return Boolean(lenisCleanup);
      lenis.on("scroll", onLenisScroll);
      lenisCleanup = () => lenis.off("scroll", onLenisScroll);
      updateFromScroll();
      return true;
    };

    if (!attachLenis()) {
      retryId = window.setInterval(() => {
        if (attachLenis()) window.clearInterval(retryId);
      }, 100);
    }

    return () => {
      window.clearInterval(retryId);
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("wheel", updateFromScroll);
      window.removeEventListener("touchmove", updateFromScroll);
      lenisCleanup?.();
    };
  }, [hasHeroOverlay, pathname]);

  const showHeader = headerVisible || menuOpen || cartOpen;
  const heroOverlay = hasHeroOverlay && heroOverlayNav;
  const textClass = heroOverlay ? "text-white" : "text-black";
  const mutedClass = heroOverlay ? "text-white/80 hover:text-white" : "text-black/70 hover:text-black";

  return (
    <>
      <FlyToCartLayer />
      <FlyToWishlistLayer />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />

      <header
        className={cn(
          "pointer-events-none fixed top-0 right-0 left-0 z-50 bg-transparent px-4 md:px-6",
          "jm-nav-header",
          showHeader ? "jm-nav-header--visible" : "jm-nav-header--hidden",
        )}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-[100%] items-center justify-between py-2.5">
          <Link href="/" className={cn("jm-nav__logo", textClass)}>
            ZVEZDA
          </Link>

          <nav className="jm-nav__links hidden lg:flex" aria-label="Primary">
            {JM_LINKS.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn("jm-nav__link", mutedClass)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-4">
            <Link
              href="/shop"
              className={cn("jm-nav__link jm-nav__shop", mutedClass)}
            >
              Shop
            </Link>
            <Link
              href="/wishlist"
              data-wishlist-target
              className={cn("jm-nav__icon", mutedClass)}
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
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
              className={cn("jm-nav__icon jm-nav__cart", mutedClass)}
              aria-label={`Cart, ${cartCount} items`}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M7.2 7.25h12.1l-1.15 9.1a1.6 1.6 0 0 1-1.58 1.4H9.55a1.6 1.6 0 0 1-1.58-1.35L6.35 4.75H3.75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10.2" cy="19.35" r="1.05" fill="currentColor" />
                <circle cx="16.55" cy="19.35" r="1.05" fill="currentColor" />
              </svg>
              {displayCount > 0 && <span className="jm-nav__cart-dot" aria-hidden="true" />}
            </button>
            <JacquemusMobileNav
              heroOverlay={heroOverlay}
              onOpenCart={() => setCartOpen(true)}
              open={menuOpen}
              onOpenChange={setMenuOpen}
            />
          </div>
        </div>
      </header>
    </>
  );
}

function JacquemusMobileNav({
  heroOverlay,
  onOpenCart,
  open,
  onOpenChange,
}: {
  heroOverlay: boolean;
  onOpenCart: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lineClass = heroOverlay ? "bg-white/85" : "bg-black/80";

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("dg-scroll-lock");
    return () => document.body.classList.remove("dg-scroll-lock");
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
        aria-label="Open menu"
      >
        <span className={cn("block h-px w-5", lineClass)} />
        <span className={cn("block h-px w-3.5", lineClass)} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex justify-end">
                <button type="button" onClick={() => onOpenChange(false)} className="jm-nav__link text-black">
                  Close
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                {[...JM_LINKS, { href: "/wishlist", label: "Wishlist" }].map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className="jm-nav__link text-lg text-black"
                  >
                    {link.label}
                  </Link>
                ))}
                <button type="button" onClick={onOpenCart} className="jm-nav__link text-left text-lg text-black">
                  Cart
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
