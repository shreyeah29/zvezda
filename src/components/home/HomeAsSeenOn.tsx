"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { asSeenOnLooks } from "@/data/asSeenOn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./HomeAsSeenOn.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeAsSeenOn() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState(0);

  const look = asSeenOnLooks[active] ?? asSeenOnLooks[0];
  const photos = look.images;
  const photo = photos[frame % photos.length] ?? photos[0];

  useEffect(() => {
    setFrame(0);
  }, [active]);

  useEffect(() => {
    if (reduced || photos.length < 2) return;
    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % photos.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [photos.length, reduced, look.id]);

  return (
    <section id="as-seen" className="as-seen" aria-labelledby="as-seen-heading">
      <div className="as-seen__intro">
        <p className="as-seen__label">As seen on</p>
        <div className="as-seen__intro-copy">
          <h2 id="as-seen-heading" className="as-seen__heading">
            Worn in the world.
          </h2>
          <p className="as-seen__lede">
            The atelier, carried onto red carpets, private hours, and nights that asked for a little more.
          </p>
        </div>
      </div>

      <div className="as-seen__stage">
        <Link href={look.href} className="as-seen__feature" aria-label={`Shop ${look.piece} as worn by ${look.name}`}>
          <div className="as-seen__feature-media">
            <AnimatePresence mode="wait" initial={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                className="as-seen__feature-image"
                style={{ objectPosition: photo.position ?? "center 20%" }}
                initial={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
              />
            </AnimatePresence>
          </div>
          <div className="as-seen__feature-copy">
            <p className="as-seen__name">{look.name}</p>
            <p className="as-seen__piece">{look.piece}</p>
            <span className="as-seen__cta">
              Shop the look
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        <div className="as-seen__rail" role="list">
          {asSeenOnLooks.map((item, index) => {
            const thumb = item.images[0];
            const selected = index === active;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`as-seen__thumb ${selected ? "as-seen__thumb--active" : ""}`}
                onClick={() => setActive(index)}
                aria-pressed={selected}
                aria-label={`${item.name}, ${item.piece}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.src}
                  alt=""
                  className="as-seen__thumb-image"
                  style={{ objectPosition: thumb.position ?? "center 18%" }}
                />
                <span className="as-seen__thumb-meta">
                  <span className="as-seen__thumb-name">{item.name}</span>
                  <span className="as-seen__thumb-piece">{item.piece}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="as-seen__ticker" aria-hidden="true">
        <span>
          {asSeenOnLooks.map((item) => item.name).join("  ·  ")}
          {"  ·  "}
          {asSeenOnLooks.map((item) => item.name).join("  ·  ")}
        </span>
      </p>
    </section>
  );
}
