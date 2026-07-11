"use client";

import Link from "next/link";
import { brand } from "@/data/brand";
import "./EditorialFooter.css";

const NAV_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
];

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/zvezda_atelier/", label: "Instagram" },
  { href: "/contact", label: "Contact" },
];

export function EditorialFooter() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-container editorial-footer__inner">
        <div className="editorial-footer__brand-block">
          <Link href="/" className="editorial-footer__logo" aria-label={`${brand.name} Atelier home`}>
            <span className="editorial-footer__logo-text">ZVEZDA</span>
            <span className="editorial-footer__logo-sub">Atelier</span>
          </Link>
          <p className="editorial-footer__tagline">{brand.tagline}</p>
        </div>

        <nav className="editorial-footer__nav" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="editorial-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="editorial-footer__social" aria-label="Social">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="editorial-footer__link"
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="editorial-footer__bottom">
          <span className="editorial-footer__copy">© 2026 {brand.name} Atelier</span>
          <div className="editorial-footer__legal">
            <Link href="/privacy" className="editorial-footer__link editorial-footer__link--muted">
              Privacy
            </Link>
            <Link href="/terms" className="editorial-footer__link editorial-footer__link--muted">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
