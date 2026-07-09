"use client";

import { useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import { LogoRotator } from "@/components/home/LogoRotator";
import { ChiffonVeil } from "@/components/home/ChiffonVeil";
import { ScrollVelocity } from "@/components/ui/ScrollVelocity";
import { LightRays } from "@/components/ui/LightRays";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./HomeInstagramChapter.css";

gsap.registerPlugin(ScrollTrigger);

const INSTAGRAM_URL = "https://www.instagram.com/zvezda_atelier/" as const;

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
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const chapter = chapterRef.current;
    const veil = veilRef.current;
    if (!chapter || !veil) return;

    if (reduced) {
      gsap.set(veil, { display: "none" });
      return;
    }

    gsap.set(veil, { yPercent: 92, opacity: 0, visibility: "hidden" });

    const trigger = ScrollTrigger.create({
      trigger: chapter,
      start: "top bottom",
      end: "top 18%",
      scrub: 0.55,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress;
        const fadeIn = Math.min(p / 0.22, 1);
        const fadeOut = p > 0.78 ? 1 - (p - 0.78) / 0.22 : 1;
        const opacity = fadeIn * fadeOut;
        const yPercent = gsap.utils.interpolate(92, -112, p);

        gsap.set(veil, {
          yPercent,
          opacity,
          visibility: opacity > 0.02 ? "visible" : "hidden",
        });
      },
      onLeave() {
        gsap.set(veil, { opacity: 0, visibility: "hidden" });
      },
      onLeaveBack() {
        gsap.set(veil, { opacity: 0, visibility: "hidden" });
      },
      onEnterBack() {
        gsap.set(veil, { visibility: "visible" });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reduced]);

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={chapterRef} className="instagram-chapter" aria-label="Instagram">
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

      <section className="instagram-chapter__static">
        <div className="instagram-chapter__rays" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#c4a574"
            raysSpeed={0.75}
            lightSpread={1.35}
            rayLength={1.15}
            followMouse
            mouseInfluence={0.08}
            noiseAmount={0.06}
            distortion={0.04}
            fadeDistance={1.8}
            saturation={0.85}
            className="instagram-chapter__rays-canvas"
          />
        </div>

        <div className="instagram-chapter__static-inner">
          <p className="instagram-chapter__label editorial-spacing">Instagram</p>

          <h2 className="instagram-chapter__heading">The Story Continues.</h2>

          <p className="instagram-chapter__body">
            Behind-the-scenes moments and new collections from the atelier.
          </p>

          <div className="instagram-chapter__gallery">
            <LogoRotator
              images={images}
              speed={12}
              imageWidth={200}
              aspectRatio={0.75}
              imageRadius={10}
              onImageClick={openInstagram}
              premium
            />
          </div>

          <div className="instagram-chapter__velocity">
            <ScrollVelocity
              texts={["@zvezdaatelier", "@zvezdaatelier"]}
              velocity={36}
              numCopies={8}
              className="instagram-chapter__scroll-handle"
              parallaxClassName="instagram-chapter__velocity-track"
              scrollerClassName="instagram-chapter__velocity-scroller"
              velocityMapping={{ input: [0, 1200], output: [0, 4] }}
            />
          </div>

          <button type="button" onClick={openInstagram} className="instagram-chapter__follow">
            <span>Follow the Story</span>
            <span className="instagram-chapter__follow-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
