"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CollectionsHero.css";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = "/assets/images/products/set-12/HSP_5750.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

export function CollectionsHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-collections-parallax]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="collections-hero" aria-labelledby="collections-hero-heading">
      <div className="collections-hero__visual" data-collections-parallax>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMAGE} alt="" className="collections-hero__image" />
      </div>

      <div className="editorial-container collections-hero__content">
        <motion.p
          className="editorial-eyebrow collections-hero__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          The House
        </motion.p>
        <motion.h1
          id="collections-hero-heading"
          className="editorial-heading collections-hero__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
        >
          Collections
        </motion.h1>
        <motion.p
          className="editorial-body collections-hero__desc"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.16, ease: EASE }}
        >
          Six distinct worlds — each a study in silhouette, texture, and light. Explore the full
          archive of the atelier.
        </motion.p>
      </div>
    </section>
  );
}
