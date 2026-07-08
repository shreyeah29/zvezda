"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenisInstance";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useLenis() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let lenis: Lenis | undefined;
    let rafId = 0;
    let mounted = true;

    const onResize = () => {
      lenis?.resize();
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    };

    void (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!mounted) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      setLenisInstance(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      window.addEventListener("resize", onResize);
      ScrollTrigger.refresh();
    })();

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      setLenisInstance(null);
      lenis?.destroy();
    };
  }, [reduced]);
}
