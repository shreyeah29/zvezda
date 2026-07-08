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
    let mounted = true;
    let tickerCallback: ((time: number) => void) | undefined;
    let onResize: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
      });

      setLenisInstance(lenis);

      lenis.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && value !== undefined) {
            lenis?.scrollTo(value, { immediate: true });
          }
          return lenis?.scroll ?? window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: document.documentElement.style.transform ? "transform" : "fixed",
      });

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      onResize = () => {
        lenis?.resize();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);
      ScrollTrigger.refresh();
    })();

    return () => {
      mounted = false;
      setLenisInstance(null);

      if (onResize) {
        window.removeEventListener("resize", onResize);
      }

      void import("gsap").then(({ gsap }) => {
        if (tickerCallback) gsap.ticker.remove(tickerCallback);
      });

      lenis?.destroy();
    };
  }, [reduced]);
}
