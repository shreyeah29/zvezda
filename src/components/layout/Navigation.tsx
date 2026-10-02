"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiniCart } from "@/components/commerce/MiniCart";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { FlyToCartLayer, FlyToWishlistLayer } from "@/components/commerce/CommerceAnimations";
import { HouseMenu } from "@/components/layout/HouseMenu";
import { useCommerce } from "@/context/CommerceContext";
import { findProduct } from "@/data/findProduct";
import { getLenisInstance } from "@/lib/lenisInstance";
import { brand } from "@/data/brand";
import { cn } from "@/lib/utils";
import "./JacquemusNav.css";

const HEART_PATH =
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

const JM_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
];

const ABOUT_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

/** Keep header visible only near the very top of the page. */
const TOP_VISIBLE_PX = 24;

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const productSlug = pathname.match(/^\/products\/([^/]+)/)?.[1];
  const productHasVideo = Boolean(productSlug && findProduct(productSlug)?.video);
  const isCollectionDetail = pathname.startsWith("/collections/") && pathname !== "/collections";
  const hasHeroOverlay = isHome || productHasVideo || isCollectionDetail;
  const { cartCount, cartPulse } = useCommerce();
  const [cartOpen, setCartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(cartCount);
  const [heroOverlayNav, setHeroOverlayNav] = useState(hasHeroOverlay);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBurst, setCartBurst] = useState(false);
  const [pageProgress, setPageProgress] = useState(0);

  useEffect(() => {
    setDisplayCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    if (cartPulse) setCartBurst(true);
  }, [cartPulse]);

  useEffect(() => {
    setHeaderVisible(true);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const getScrollY = () => {
      const lenis = getLenisInstance();
      if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
      return window.scrollY || document.documentElement.scrollTop || 0;
    };

    const updateFromScroll = () => {
      const y = getScrollY();
      setHeaderVisible(isAbout || y <= TOP_VISIBLE_PX);

      if (hasHeroOverlay) {
        setHeroOverlayNav(y < window.innerHeight * 0.85);
      } else {
        setHeroOverlayNav(false);
      }

      if (isAbout) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPageProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
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
  }, [hasHeroOverlay, isAbout, pathname]);

  if (pathname.startsWith("/atelier")) return null;

  const showHeader = isAbout || headerVisible || cartOpen || searchOpen || menuOpen;
  const heroOverlay = hasHeroOverlay && heroOverlayNav;
  const mutedClass = heroOverlay ? "text-white/80 hover:text-white" : "text-black/70 hover:text-black";
  const centreLinks = isAbout ? ABOUT_LINKS : JM_LINKS;
  const linkIsActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <FlyToCartLayer />
      <FlyToWishlistLayer />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {isAbout ? (
        <div className="about-nav-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${pageProgress})` }} />
        </div>
      ) : null}

      <header
        className={cn(
          "pointer-events-none fixed top-0 right-0 left-0 z-50 bg-transparent px-4 md:px-6",
          "jm-nav-header",
          showHeader ? "jm-nav-header--visible" : "jm-nav-header--hidden",
          heroOverlay && "jm-nav-header--on-hero",
          isAbout && "jm-nav-header--about",
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
            {centreLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn(
                  "jm-nav__link jm-nav__shop",
                  mutedClass,
                  isAbout && linkIsActive(link.href) && "is-active",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-4">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className={cn("jm-nav__icon", mutedClass)}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M16.2 16.2 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
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
            <HouseMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              onOpenCart={() => setCartOpen(true)}
              onOpenSearch={() => setSearchOpen(true)}
              lineClass={heroOverlay ? "bg-white/85" : "bg-black/80"}
            />
          </div>
        </div>
      </header>
    </>
  );
}
