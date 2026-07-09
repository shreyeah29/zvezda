"use client";

import Link from "next/link";
import { brand } from "@/data/brand";
import "./Footer.css";

const FOOTER_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__media" aria-hidden="true">
        <video autoPlay muted loop playsInline className="site-footer__video">
          <source src="/assets/videos/products/set-1/GardenSolo3.mp4" type="video/mp4" />
        </video>
        <div className="site-footer__scrim" />
      </div>

      <div className="site-footer__inner">
        <h2 className="site-footer__statement font-display">{brand.statement}</h2>

        <nav className="site-footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__bottom">
          <span className="site-footer__brand font-display">{brand.name}</span>
          <span className="site-footer__copy editorial-spacing">© 2026</span>
        </div>
      </div>
    </footer>
  );
}
