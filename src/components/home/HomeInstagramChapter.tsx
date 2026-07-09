"use client";

import { useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { LogoRotator } from "@/components/home/LogoRotator";
import { ChiffonVeil } from "@/components/home/ChiffonVeil";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./HomeInstagramChapter.css";

gsap.registerPlugin(ScrollTrigger);

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;
const HEADING_WORDS = ["THE", "STORY", "CONTINUES."] as const;

function buildRotatorImages() {
  const picks = [
    products.find((p) => p.slug === "set-12"),
    products.find((p) => p.slug === "set-8"),
    products.find((p) => p.slug === "set-1"),
    products.find((p) => p.slug === "set-13"),
    products.find((p) => p.slug === "set-5"),
    products.find((p) => p.slug === "set-11"),
  ].filter(Boolean);

  return picks.map((product) => ({
    src: product!.hero,
    alt: product!.name,
  }));
}

export function HomeInstagramChapter() {
  const images = useMemo(() => buildRotatorImages(), []);
  const chapterRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const chapter = chapterRef.current;
    const veil = veilRef.current;
    const staticSection = staticRef.current;
    if (!chapter || !veil || !staticSection) return;

    const words = wordRefs.current.filter(Boolean);
    const contentTargets = [
      labelRef.current,
      ...words,
      bodyRef.current,
      galleryRef.current,
      ctaRef.current,
    ];

    if (reduced) {
      gsap.set(veil, { display: "none" });
      gsap.set(contentTargets, { opacity: 1, y: 0, yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(veil, { yPercent: 108, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: staticSection,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(veil, { opacity: 1, duration: 0.18, ease: "power1.out" }, 0)
        .to(veil, { yPercent: -118, duration: 1, ease: "none" }, 0)
        .to(veil, { opacity: 0, duration: 0.32, ease: "power1.in" }, 0.68);

      gsap.set(labelRef.current, { opacity: 0, y: 20 });
      gsap.set(words, { yPercent: 118, opacity: 0 });
      gsap.set(bodyRef.current, { opacity: 0, y: 28 });
      gsap.set(galleryRef.current, { opacity: 0, y: 60 });
      gsap.set(ctaRef.current, { opacity: 0, y: 24 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: staticSection,
            start: "top 72%",
            once: true,
          },
        })
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(
          words,
          { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.09, ease: "power3.out" },
          "-=0.35",
        )
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.45")
        .to(galleryRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.4")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");
    }, chapter);

    return () => ctx.revert();
  }, [reduced]);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={chapterRef} className="instagram-chapter" aria-label="The story continues — Instagram">
      <div ref={veilRef} className="chiffon-veil" aria-hidden="true">
        <div className="chiffon-veil__layer chiffon-veil__layer--back">
          <ChiffonVeil variant="c" className="chiffon-veil__sheet" />
        </div>
        <div className="chiffon-veil__layer chiffon-veil__layer--mid">
          <ChiffonVeil variant="b" className="chiffon-veil__sheet" />
        </div>
        <div className="chiffon-veil__layer chiffon-veil__layer--front">
          <ChiffonVeil variant="a" className="chiffon-veil__sheet" />
        </div>
      </div>

      <section ref={staticRef} className="instagram-chapter__static">
        <div className="instagram-chapter__static-inner">
          <p ref={labelRef} className="instagram-chapter__label editorial-spacing">
            Instagram
          </p>

          <h2 className="instagram-chapter__heading" aria-label="The Story Continues">
            <span className="instagram-chapter__heading-line">
              {HEADING_WORDS.slice(0, 2).map((word, index) => (
                <span key={word} className="instagram-chapter__word-mask">
                  <span
                    ref={(el) => {
                      wordRefs.current[index] = el;
                    }}
                    className="instagram-chapter__word"
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
            <span className="instagram-chapter__heading-line">
              <span className="instagram-chapter__word-mask">
                <span
                  ref={(el) => {
                    wordRefs.current[2] = el;
                  }}
                  className="instagram-chapter__word"
                >
                  {HEADING_WORDS[2]}
                </span>
              </span>
            </span>
          </h2>

          <p ref={bodyRef} className="instagram-chapter__body">
            From behind-the-scenes moments to new collections, discover the stories that never make
            it to the runway.
          </p>

          <div ref={galleryRef} className="instagram-chapter__gallery">
            <LogoRotator
              images={images}
              speed={14}
              imageWidth={300}
              aspectRatio={0.75}
              imageRadius={12}
              onImageClick={openInstagram}
              premium
            />
          </div>

          <div ref={ctaRef} className="instagram-chapter__cta">
            <p className="instagram-chapter__handle">@zvezdaatelier</p>
            <motion.button
              type="button"
              onClick={openInstagram}
              className="instagram-chapter__follow"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              <span>Follow the Story</span>
              <span className="instagram-chapter__follow-arrow" aria-hidden="true">
                →
              </span>
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
