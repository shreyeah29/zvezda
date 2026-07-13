"use client";

import Link from "next/link";
import "./JacquemusFooter.css";

const FOOTER_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/returns", label: "Returns" },
  { href: "/shipping", label: "Shipping" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function JacquemusFooter() {
  return (
    <footer className="jm-footer">
      <div className="jm-footer__shell">
        <Link href="/" className="jm-footer__logo">
          ZVEZDA
        </Link>
        <nav className="jm-footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="jm-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
