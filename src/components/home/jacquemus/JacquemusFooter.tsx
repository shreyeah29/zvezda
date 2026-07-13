"use client";

import Link from "next/link";
import "./JacquemusFooter.css";

const FOOTER_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function JacquemusFooter() {
  return (
    <footer className="jm-footer">
      <div className="jm-footer__mobile">
        <Link href="/" className="jm-footer__mobile-logo">
          ZVEZDA
        </Link>
        <nav className="jm-footer__mobile-nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="jm-footer__mobile-link">
              <span>{link.label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          ))}
        </nav>
        <div className="jm-footer__social" aria-label="Social media">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            IG
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            FB
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
            PT
          </a>
        </div>
      </div>

      <div className="jm-footer__inner jm-footer__desktop">
        <Link href="/shop" className="jm-footer__logo">
          ZVEZDA
        </Link>
        <nav className="jm-footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
