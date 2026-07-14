"use client";

import Link from "next/link";
import { brand } from "@/data/brand";
import "./JacquemusFooter.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const CARE_LINKS = [
  { href: "/returns", label: "Returns" },
  { href: "/shipping", label: "Shipping" },
  { href: "/faq", label: "FAQ" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/";

export function JacquemusFooter() {
  return (
    <footer className="jm-footer">
      <div className="jm-footer__top">
        <div className="jm-footer__col jm-footer__col--brand">
          <p className="jm-footer__heading">The House</p>
          <p className="jm-footer__statement">{brand.philosophy}</p>
          <div className="jm-footer__social">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="jm-footer__social-link"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <rect
                  x="3.5"
                  y="3.5"
                  width="17"
                  height="17"
                  rx="4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <div className="jm-footer__col">
          <p className="jm-footer__heading">Navigation</p>
          <nav className="jm-footer__list" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="jm-footer__link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="jm-footer__col">
          <p className="jm-footer__heading">Client Care</p>
          <nav className="jm-footer__list" aria-label="Client care">
            {CARE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="jm-footer__link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="jm-footer__col">
          <p className="jm-footer__heading">Legal</p>
          <nav className="jm-footer__list" aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="jm-footer__link">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="jm-footer__note">{brand.tagline}</p>
        </div>
      </div>

      <div className="jm-footer__brandmark">
        <Link href="/" className="jm-footer__logo" aria-label="ZVEZDA Atelier home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.logo.dark}
            alt="ZVEZDA Atelier"
            className="jm-footer__logo-img"
            draggable={false}
          />
        </Link>
      </div>

      <p className="jm-footer__copy">
        © {new Date().getFullYear()} ZVEZDA Atelier · {brand.statement}
      </p>
    </footer>
  );
}
