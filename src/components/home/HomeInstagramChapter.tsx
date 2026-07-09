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
const SCROLL_DISTANCE_VH = 1.85;

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
  const staticRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const freezeRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [freezeImage, setFreezeImage] = useState(() => ({
    src: products[0]?.hero ?? "",
    alt: products[0]?.name ?? "",
  }));

  useEffect(() => {
    const pill = pillSectionRef.current;
    const staticSection = staticRef.current;
    const overlay = overlayRef.current;
    if (!pill || !staticSection || !overlay) return;

    const words = wordRefs.current.filter(Boolean);
    const zoomRoot = pill.querySelector<HTMLElement>(".pill-carousel__zoom-root");

    if (reduced) {
      overlay.classList.remove("is-active");
      gsap.set(overlay, { display: "none" });
      gsap.set([labelRef.current, ...words, bodyRef.current, galleryRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
        yPercent: 0,
      });
      return;
    }

    setFreezeImage(getCenterCarouselImage());

    const ctx = gsap.context(() => {
      gsap.set(overlay, { visibility: "hidden", opacity: 0 });
      gsap.set(freezeRef.current, { opacity: 1, scale: 1 });
      gsap.set(paperRef.current, { y: 0 });
      if (zoomRoot) gsap.set(zoomRoot, { scale: 1, transformOrigin: "center center" });
      gsap.set(labelRef.current, { opacity: 0, y: 20 });
      gsap.set(words, { yPercent: 115, opacity: 0 });
      gsap.set(bodyRef.current, { opacity: 0, y: 28 });
      gsap.set(galleryRef.current, { opacity: 0, y: 64 });
      gsap.set(ctaRef.current, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pill,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight * SCROLL_DISTANCE_VH}`,
          pin: pill,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            overlay.classList.add("is-active");
            gsap.set(overlay, { visibility: "visible", opacity: 1 });
            setFreezeImage(getCenterCarouselImage());
          },
          onEnterBack: () => {
            overlay.classList.add("is-active");
            gsap.set(overlay, { visibility: "visible", opacity: 1 });
          },
          onLeave: () => {
            overlay.classList.remove("is-active");
            gsap.set(overlay, { visibility: "hidden", opacity: 0 });
            gsap.set([labelRef.current, ...words, bodyRef.current, galleryRef.current, ctaRef.current], {
              opacity: 1,
              y: 0,
              yPercent: 0,
            });
          },
          onLeaveBack: () => {
            overlay.classList.remove("is-active");
            gsap.set(overlay, { visibility: "hidden", opacity: 0 });
          },
        },
      });

      tl.to(zoomRoot, { scale: 1.12, duration: 0.14, ease: "power2.inOut" }, 0)
        .to(zoomRoot, { scale: 1.12, duration: 0.08, ease: "none" }, 0.14)
        .to(
          paperRef.current,
          { y: () => -(window.innerHeight + 88), duration: 0.38, ease: "power2.inOut" },
          0.2,
        )
        .to(freezeRef.current, { opacity: 0, duration: 0.16, ease: "power1.out" }, 0.24)
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.32)
        .to(
          words,
          { yPercent: 0, opacity: 1, duration: 0.1, stagger: 0.05, ease: "power3.out" },
          0.34,
        )
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.09, ease: "power2.out" }, 0.48)
        .to(galleryRef.current, { opacity: 1, y: 0, duration: 0.12, ease: "power3.out" }, 0.54)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.09, ease: "power2.out" }, 0.66);
    }, staticSection);

    return () => ctx.revert();
  }, [pillSectionRef, reduced]);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="instagram-chapter__overlay"
        aria-hidden="true"
      >
        <div ref={freezeRef} className="freeze-frame">
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

      <section
        ref={staticRef}
        className="instagram-chapter__static"
        aria-label="The story continues — Instagram"
      >
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
    </>
  );
}
