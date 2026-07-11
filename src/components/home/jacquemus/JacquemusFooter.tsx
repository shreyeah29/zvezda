"use client";

import Link from "next/link";
import "./JacquemusFooter.css";

export function JacquemusFooter() {
  return (
    <footer className="jm-footer">
      <div className="jm-footer__inner">
        <Link href="/shop" className="jm-footer__logo">
          ZVEZDA
        </Link>
        <nav className="jm-footer__nav" aria-label="Footer">
          <Link href="/collections">Collections</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
