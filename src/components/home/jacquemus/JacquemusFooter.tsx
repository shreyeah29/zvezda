"use client";

import Link from "next/link";
import "./JacquemusFooter.css";

const PRIMARY_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const POLICY_LINKS = [
  { href: "/returns", label: "Returns" },
  { href: "/shipping", label: "Shipping" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function JacquemusFooter() {
  return (
    <footer className="jm-footer">
      <div className="jm-footer__mobile">
        <Link href="/" className="jm-footer__mobile-logo">
          ZVEZDA
        </Link>
        <nav className="jm-footer__mobile-nav" aria-label="Footer">
          {PRIMARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="jm-footer__mobile-link">
              <span>{link.label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          ))}
          {POLICY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="jm-footer__mobile-link">
              <span>{link.label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="jm-footer__inner jm-footer__desktop">
        <Link href="/" className="jm-footer__logo">
          ZVEZDA
        </Link>
        <nav className="jm-footer__nav" aria-label="Footer">
          {[...PRIMARY_LINKS, ...POLICY_LINKS].map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
