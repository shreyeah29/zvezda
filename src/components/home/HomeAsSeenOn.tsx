"use client";

import Link from "next/link";
import { asSeenOnHero, asSeenOnLooks } from "@/data/asSeenOn";
import "./HomeAsSeenOn.css";

export function HomeAsSeenOn() {
  return (
    <section className="as-seen-on" id="as-seen">
      <header>
        <p className="eyebrow">WORN BY</p>
        <h2>
          Her Moment,
          <br />
          <em>Our Atelier</em>
        </h2>
        <span className="rule" aria-hidden="true" />
      </header>

      <figure className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asSeenOnHero.src}
          alt={asSeenOnHero.alt}
          loading="lazy"
          style={asSeenOnHero.position ? { objectPosition: asSeenOnHero.position } : undefined}
        />
        <figcaption>
          <span className="name">{asSeenOnHero.name.toUpperCase()}</span>
          <span className="piece">{asSeenOnHero.piece.toUpperCase()}</span>
        </figcaption>
      </figure>

      <div className="pair">
        {asSeenOnLooks.map((look) => (
          <figure key={look.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={look.src}
              alt={look.alt}
              loading="lazy"
              style={look.position ? { objectPosition: look.position } : undefined}
            />
            <figcaption>
              <span className="name">{look.name.toUpperCase()}</span>
              <span className="meta">{look.piece}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Link className="cta" href="/press">
        SEE EVERY PLACEMENT
      </Link>
    </section>
  );
}
