"use client";

import { useMemo, useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { LogoRotator } from "@/components/home/LogoRotator";
import { TornPaperEdge } from "@/components/home/TornPaperEdge";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./HomeInstagramChapter.css";

gsap.registerPlugin(ScrollTrigger);

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;
const HEADING_WORDS = ["THE", "STORY", "CONTINUES."] as const;

type HomeInstagramChapterProps = {
  pillSectionRef: RefObject<HTMLElement | null>;
};

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

function getCenterCarouselImage() {
  if (typeof document === "undefined") {
    return { src: products[0]?.hero ?? "", alt: products[0]?.name ?? "" };
  }
  const centerImg = document.querySelector<HTMLImageElement>(
    ".pill-carousel__card.is-center img",
  );
  if (centerImg?.src) {
    return { src: centerImg.src, alt: centerImg.alt || products[0]?.name || "" };
  }
  return { src: products[0]?.hero ?? "", alt: products[0]?.name ?? "" };
}

export function HomeInstagramChapter({ pillSectionRef }: HomeInstagramChapterProps) {
  const images = useMemo(() => buildRotatorImages(), []);
  const chapterRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const freezeRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const ivoryRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [freezeImage, setFreezeImage] = useState(() => ({
    src: products[0]?.hero ?? "",
    alt: products[0]?.name ?? "",
  }));
  const [ivoryInteractive, setIvoryInteractive] = useState(false);

  useEffect(() => {
    const pill = pillSectionRef.current;
    const pin = pinRef.current;
    const chapter = chapterRef.current;
    if (!pill || !pin || !chapter) return;

    if (reduced) {
      setIvoryInteractive(true);
      gsap.set([freezeRef.current, paperRef.current], { display: "none" });
      gsap.set(ivoryRef.current, { opacity: 1 });
      gsap.set([labelRef.current, ...wordRefs.current, bodyRef.current, galleryRef.current, footerRef.current], {
        opacity: 1,
        y: 0,
        yPercent: 0,
      });
      return;
    }

    setFreezeImage(getCenterCarouselImage());

    const words = wordRefs.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.set(freezeRef.current, { scale: 1, transformOrigin: "center center" });
      gsap.set(paperRef.current, { y: 0, rotation: 0 });
      gsap.set(ivoryRef.current, { opacity: 1 });
      gsap.set(labelRef.current, { opacity: 0, y: 16 });
      gsap.set(words, { yPercent: 120, opacity: 0 });
      gsap.set(bodyRef.current, { opacity: 0, y: 24 });
      gsap.set(galleryRef.current, { opacity: 0, y: 72 });
      gsap.set(footerRef.current, { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pill,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight * 2.85}`,
          pin: pin,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            setIvoryInteractive(true);
            gsap.set(pin, { height: "auto", minHeight: "100vh" });
          },
          onEnterBack: () => {
            setIvoryInteractive(false);
            gsap.set(pin, { height: "100vh", minHeight: "auto" });
          },
        },
      });

      // Phase 1 — zoom into collection frame
      tl.to(freezeRef.current, { scale: 1.14, duration: 0.18, ease: "power2.inOut" }, 0)
        // Phase 2 — brief freeze
        .to(freezeRef.current, { scale: 1.14, duration: 0.1, ease: "none" }, 0.18)
        // Phase 3 — torn paper rises, revealing ivory
        .to(
          paperRef.current,
          { y: () => -window.innerHeight * 1.05, rotation: -0.35, duration: 0.44, ease: "power2.inOut" },
          0.28,
        )
        .to(freezeRef.current, { opacity: 0, duration: 0.22, ease: "power1.out" }, 0.34)
        // Phase 4 — editorial typography (per word)
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.4)
        .to(
          words,
          { yPercent: 0, opacity: 1, duration: 0.12, stagger: 0.06, ease: "power3.out" },
          0.42,
        )
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.58)
        // Phase 5 — gallery rises in
        .to(
          galleryRef.current,
          { opacity: 1, y: 0, duration: 0.14, ease: "power3.out" },
          0.62,
        )
        .to(footerRef.current, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.76);
    }, chapter);

    return () => ctx.revert();
  }, [pillSectionRef, reduced]);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={chapterRef} className="instagram-chapter" aria-label="The story continues — Instagram">
      <div ref={pinRef} className="instagram-chapter__pin">
        <div
          ref={ivoryRef}
          className={`instagram-chapter__ivory${ivoryInteractive ? " is-interactive" : ""}`}
        >
          <div className="instagram-chapter__ivory-inner">
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
              From behind-the-scenes moments to new collections, discover the stories that never
              make it to the runway.
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

            <div ref={footerRef} className="instagram-chapter__footer">
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
          <div className="instagram-chapter__fade-footer" aria-hidden="true" />
        </div>

        <div ref={freezeRef} className="freeze-frame" aria-hidden="true">
          <div className="freeze-frame__ambient" />
          <div className="freeze-frame__stage">
            <div className="freeze-frame__card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={freezeImage.src} alt={freezeImage.alt} draggable={false} />
            </div>
          </div>
        </div>

        <div ref={paperRef} className="instagram-chapter__paper">
          <div className="instagram-chapter__paper-fill" />
          <TornPaperEdge className="instagram-chapter__paper-edge" />
        </div>
      </div>
    </div>
  );
}
