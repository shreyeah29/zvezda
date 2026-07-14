"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiniCart } from "@/components/commerce/MiniCart";
import { FlyToCartLayer, FlyToWishlistLayer } from "@/components/commerce/CommerceAnimations";
import { useCommerce } from "@/context/CommerceContext";
import { getLenisInstance } from "@/lib/lenisInstance";
import { brand } from "@/data/brand";
import { cn } from "@/lib/utils";
import "./JacquemusNav.css";

const HEART_PATH =
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

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
  const { cartCount, cartPulse } = useCommerce();
  const [cartOpen, setCartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(cartCount);
  const [heroOverlayNav, setHeroOverlayNav] = useState(hasHeroOverlay);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBurst, setCartBurst] = useState(false);

  useEffect(() => {
    setDisplayCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    if (cartPulse) setCartBurst(true);
  }, [cartPulse]);

  useEffect(() => {
    setHeaderVisible(true);
    setMenuOpen(false);
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

  const showHeader = headerVisible || cartOpen;
  const heroOverlay = hasHeroOverlay && heroOverlayNav;
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
          heroOverlay && "jm-nav-header--on-hero",
        )}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-[100%] items-center justify-between py-2.5">
          <Link href="/" className="jm-nav__logo" aria-label="ZVEZDA Atelier home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroOverlay ? brand.logo.white : brand.logo.dark}
              alt="ZVEZDA Atelier"
              className="jm-nav__logo-img"
              draggable={false}
            />
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
            <Link href="/shop" className={cn("jm-nav__link jm-nav__shop", mutedClass)}>
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
                  d={HEART_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <motion.button
              type="button"
              data-cart-target
              onClick={() => setCartOpen(true)}
              className={cn("jm-nav__icon jm-nav__cart", mutedClass)}
              aria-label={`Cart, ${cartCount} items`}
              animate={
                cartBurst || cartPulse
                  ? { scale: [1, 1.28, 1] }
                  : { scale: 1 }
              }
              transition={{ type: "spring", stiffness: 520, damping: 18 }}
              onAnimationComplete={() => {
                if (cartBurst) setCartBurst(false);
              }}
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
            </motion.button>
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
  const [mounted, setMounted] = useState(false);
  const lineClass = heroOverlay ? "bg-white/85" : "bg-black/80";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("dg-scroll-lock");
    return () => document.body.classList.remove("dg-scroll-lock");
  }, [open]);

  const menuOverlay =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            key="jm-mobile-menu"
            className="jm-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="jm-mobile-menu__inner">
              <div className="jm-mobile-menu__top">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="jm-nav__link jm-mobile-menu__close"
                >
                  Close
                </button>
              </div>
              <nav className="jm-mobile-menu__nav" aria-label="Mobile">
                {[
                  ...JM_LINKS,
                  { href: "/shop", label: "Shop" },
                  { href: "/wishlist", label: "Wishlist" },
                ].map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className="jm-mobile-menu__link"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenCart();
                  }}
                  className="jm-mobile-menu__link jm-mobile-menu__link--button"
                >
                  Cart
                </button>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

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
      {menuOverlay}
    </>
  );
}
