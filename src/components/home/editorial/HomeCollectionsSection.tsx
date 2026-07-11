"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { editorialCollections } from "@/data/editorialCollections";
import "./HomeCollectionsSection.css";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeCollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-collection-reveal]", {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="home-collections editorial-section" aria-labelledby="home-collections-heading">
      <div className="editorial-container home-collections__inner">
        <header className="home-collections__header">
          <motion.h2
            id="home-collections-heading"
            className="editorial-heading home-collections__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Collections
          </motion.h2>
          <motion.p
            className="editorial-body home-collections__subtitle"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          >
            Discover every story crafted inside the atelier.
          </motion.p>
        </header>

        <div className="home-collections__grid">
          {editorialCollections.map((collection, index) => (
            <article
              key={collection.id}
              data-collection-reveal
              className={`home-collections__card ${index === 0 ? "home-collections__card--featured" : ""}`}
            >
              <Link href={`/collections/${collection.slug}`} className="home-collections__card-link">
                <div className="home-collections__image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="home-collections__image"
                    loading="lazy"
                  />
                </div>
                <div className="home-collections__card-body">
                  <h3 className="home-collections__card-title">{collection.title}</h3>
                  <p className="home-collections__card-desc">{collection.description}</p>
                  <span className="editorial-link-arrow home-collections__card-cta">
                    View Collection
                    <span className="editorial-link-arrow__icon" aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
