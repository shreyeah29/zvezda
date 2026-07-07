"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setVideoPath, getSet, setHeroPhoto } from "@/data/sets";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const heroSet = getSet(3)!;
const stillSet = getSet(1)!;

export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const heroVideo = setVideoPath(heroSet)!;
  const heroStill = setHeroPhoto(stillSet);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const still = stillRef.current;
    if (!section || !video || !still || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.5) {
            gsap.set(video, { scale: 1 + p * 0.08, opacity: 1 });
            gsap.set(still, { opacity: 0 });
          } else {
            const fadeP = (p - 0.5) * 2;
            gsap.set(video, { opacity: 1 - fadeP, scale: 1.04 + fadeP * 0.02 });
            gsap.set(still, { opacity: fadeP, scale: 1 + fadeP * 0.05 });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/60" />
      </div>

      <div
        ref={stillRef}
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: `url(${heroStill})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-ink/30" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24">
        <p className="editorial-spacing text-[10px] text-cream/50">Scroll to enter</p>
      </div>
    </section>
  );
}
