"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { EditorialCollection } from "@/data/editorialCollections";
import "./CollectionsEditorialBreak.css";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

type CollectionsEditorialBreakProps = {
  collection: EditorialCollection;
  reverse?: boolean;
};

export function CollectionsEditorialBreak({ collection, reverse = false }: CollectionsEditorialBreakProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelector("[data-break-visual]"), {
        scale: 1.06,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`collections-break editorial-section ${reverse ? "collections-break--reverse" : ""}`}
      aria-label={`${collection.title} editorial`}
    >
      <div className="editorial-container collections-break__layout">
        <motion.div
          className="collections-break__copy"
          initial={{ opacity: 0, x: reverse ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <p className="editorial-eyebrow">{collection.title}</p>
          <h2 className="editorial-heading collections-break__title">{collection.description}</h2>
          <Link href={`/collections/${collection.slug}`} className="editorial-link-arrow collections-break__link">
            Explore the Collection
            <span className="editorial-link-arrow__icon" aria-hidden="true">
              →
            </span>
          </Link>
        </motion.div>

        <div className="collections-break__visual" data-break-visual>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image}
            alt={collection.title}
            className="collections-break__image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
