"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/data/brand";
import { MENU_ITEMS, getMenuActiveIndex } from "@/data/menuItems";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMaxWidth } from "@/hooks/useMaxWidth";
import { cn } from "@/lib/utils";
import "./HouseMenu.css";

type HouseMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  triggerClassName?: string;
  lineClass: string;
};

export function preloadMenuImages() {
  MENU_ITEMS.forEach((item) => {
    const image = new window.Image();
    image.src = item.image;
  });
}

function routeIndex(pathname: string) {
  const index = getMenuActiveIndex(pathname);
  return index >= 0 ? index : 0;
}

function RollingWord({ text, rowIndex }: { text: string; rowIndex: number }) {
  return (
    <span className="zvezda-roll__word" aria-hidden="true">
      {Array.from(text).map((char, letterIndex) => {
        const glyph = char === " " ? "\u00a0" : char;
        return (
          <span className="zvezda-roll__mask" key={`${glyph}-${letterIndex}`}>
            <span
              className="zvezda-roll"
              style={
                {
                  "--i": letterIndex,
                  "--row": rowIndex,
                } as CSSProperties
              }
            >
              <span>{glyph}</span>
              <span className="zvezda-roll__dup">{glyph}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function HouseMenu({
  open,
  onOpenChange,
  onOpenSearch,
  onOpenCart,
  triggerClassName,
  lineClass,
}: HouseMenuProps) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const isMobile = useMaxWidth(1023);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [active, setActive] = useState(0);
  const [phoneActive, setPhoneActive] = useState<number | null>(null);
  const phoneArmedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const next = routeIndex(pathname);
    setActive(next);
    setPhoneActive(next);
    setClosing(false);
    setEntered(false);
    setVisible(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setEntered(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, pathname]);

  useEffect(() => {
    if (open || !visible) return;
    setClosing(true);
    const wait = reduced ? 200 : isMobile ? 500 : 600;
    const id = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      triggerRef.current?.focus();
    }, wait);
    return () => window.clearTimeout(id);
  }, [isMobile, open, reduced, visible]);

  useEffect(() => {
    if (!visible || closing) return;
    document.body.classList.add("dg-scroll-lock");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("dg-scroll-lock");
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, closing, onOpenChange]);

  const utilityLinks = (
    <>
      <button
        type="button"
        onClick={() => {
          onOpenChange(false);
          onOpenSearch();
        }}
      >
        Search
      </button>
      <Link href="/wishlist" onClick={() => onOpenChange(false)}>
        Wishlist
      </Link>
      <button
        type="button"
        onClick={() => {
          onOpenChange(false);
          onOpenCart();
        }}
      >
        Cart
      </button>
    </>
  );

  const overlay =
    mounted &&
    visible &&
    createPortal(
      <div
        className={cn(
          "zvezda-menu",
          isMobile ? "zvezda-menu--phone" : "zvezda-menu--desktop",
          entered && !closing && "zvezda-menu--open",
          closing && "zvezda-menu--closing",
          reduced && "zvezda-menu--reduced",
          isMobile && phoneActive != null && "zvezda-menu--lit",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="House menu"
      >
        {isMobile ? (
          <div
            className={cn("zvezda-menu__backdrop", phoneActive != null && "is-on")}
            aria-hidden="true"
          >
            {MENU_ITEMS.map((item, index) => (
              <div
                key={item.href}
                className={cn("zvezda-menu__backdrop-frame", phoneActive === index && "is-active")}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="zvezda-menu__backdrop-img"
                />
              </div>
            ))}
            <span className="zvezda-menu__backdrop-veil" />
          </div>
        ) : null}

        <div className="zvezda-menu__top">
          <Link
            href="/"
            className={cn("zvezda-menu__logo", isMobile && "zvezda-menu__logo--stack")}
            onClick={() => onOpenChange(false)}
          >
            {isMobile ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="zvezda-menu__logo-ink" src={brand.logo.dark} alt="ZVEZDA Atelier" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="zvezda-menu__logo-paper" src={brand.logo.white} alt="" />
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo.dark} alt="ZVEZDA Atelier" />
            )}
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="zvezda-menu__close"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>

        {isMobile ? (
          <nav className="zvezda-menu__letters" aria-label="Primary">
            {MENU_ITEMS.map((item, index) => {
              const isActive = phoneActive === index;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn("zvezda-menu__letter-link", isActive && "is-active")}
                  onMouseEnter={() => setPhoneActive(index)}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) setPhoneActive(index);
                  }}
                  onPointerDown={() => {
                    phoneArmedRef.current = phoneActive === index;
                  }}
                  onClick={(event) => {
                    const fromKeyboard = event.detail === 0;
                    if (!fromKeyboard && !phoneArmedRef.current) {
                      event.preventDefault();
                      setPhoneActive(index);
                      return;
                    }
                    onOpenChange(false);
                  }}
                >
                  <span className="zvezda-menu__letter-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <RollingWord text={item.label} rowIndex={index} />
                  <span className="zvezda-menu__letter-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="zvezda-menu__row" aria-label="Primary">
            {MENU_ITEMS.map((item, index) => {
              const isActive = active === index;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("zvezda-menu__col", isActive && "is-active")}
                  style={{ transitionDelay: closing || reduced ? "0s" : `${index * 0.08}s` }}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => onOpenChange(false)}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 60vw, 100vw"
                    className="zvezda-menu__image"
                  />
                  <span className="zvezda-menu__shade" aria-hidden="true" />
                  <span className="zvezda-menu__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="zvezda-menu__label-collapsed">{item.label}</span>
                  <span className="zvezda-menu__label-expanded">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="zvezda-menu__tools">
          {isMobile ? <div className="zvezda-menu__utils">{utilityLinks}</div> : utilityLinks}
          {isMobile ? (
            <p className="zvezda-menu__caption">
              {phoneActive != null ? MENU_ITEMS[phoneActive].caption : "\u00a0"}
            </p>
          ) : null}
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn("jm-nav__menu-btn", triggerClassName)}
        aria-label="Open menu"
        aria-expanded={open || visible}
        onClick={() => onOpenChange(true)}
        onMouseEnter={preloadMenuImages}
        onFocus={preloadMenuImages}
      >
        <span className={cn("block h-px w-5", lineClass)} />
        <span className={cn("block h-px w-5", lineClass)} />
        <span className={cn("block h-px w-5", lineClass)} />
      </button>
      {overlay}
    </>
  );
}
