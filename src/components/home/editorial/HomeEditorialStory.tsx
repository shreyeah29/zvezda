"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "@/data/brand";
import "./HomeEditorialStory.css";

gsap.registerPlugin(ScrollTrigger);

const STORY_IMAGE = "/assets/images/products/set-3/HSP_3971.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeEditorialStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-story-image]", {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="home-story editorial-section" aria-labelledby="home-story-heading">
      <div className="editorial-container home-story__layout">
        <motion.div
          className="home-story__copy"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="editorial-eyebrow">The Atelier</p>
          <h2 id="home-story-heading" className="editorial-heading home-story__title">
            Where light becomes garment.
          </h2>
          <p className="editorial-body home-story__text">{brand.philosophy}</p>
          <p className="editorial-body home-story__text home-story__text--secondary">
            Each collection is a chapter — sculpted by hand, worn like memory, revealed in motion.
          </p>
        </motion.div>

        <div className="home-story__visual" data-story-image>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STORY_IMAGE}
            alt="Editorial atelier photography"
            className="home-story__image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
