"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { getGridMotionSlots, type GridMotionItem } from "@/components/GridMotionReveal/gridMotionData";
import { initGridMotionAnimation } from "@/components/GridMotionReveal/gridMotionAnimation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./GridMotionReveal.css";

function GridCell({ item }: { item: GridMotionItem }) {
  if (!item.src) return <div />;

  return (
    <div>
      <Link href={`/products/${item.slug}`} className="grid-cell-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} draggable={false} />
      </Link>
    </div>
  );
}

export function GridMotionReveal() {
  const reducedMotion = usePrefersReducedMotion();
  const slots = useMemo(() => getGridMotionSlots(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const scalerImageRef = useRef<HTMLImageElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    const image = scalerImageRef.current;
    const firstSection = sectionRef.current;
    const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!image || !firstSection || layers.length === 0) return;

    const onLoad = () => {
      const cleanup = initGridMotionAnimation({ image, firstSection, layers });

      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
      void import("@/lib/lenisInstance").then(({ getLenisInstance }) => getLenisInstance()?.resize());

      return cleanup;
    };

    let cleanup: (() => void) | undefined;

    if (image.complete) {
      cleanup = onLoad();
    } else {
      const handleLoad = () => {
        cleanup = onLoad();
      };
      image.addEventListener("load", handleLoad, { once: true });
      return () => {
        image.removeEventListener("load", handleLoad);
        cleanup?.();
      };
    }

    return () => {
      cleanup?.();
    };
  }, [reducedMotion, slots]);

  return (
    <div className="grid-motion-wrap" aria-label="Collection grid motion gallery">
      <div className="content-wrap">
        <header>
          <h1 className="fluid">COLLECTION 2026</h1>
        </header>
        <main>
          <section ref={sectionRef}>
            <div className="content">
              <div className="grid">
                <div
                  className="layer"
                  ref={(node) => {
                    layerRefs.current[0] = node;
                  }}
                >
                  {slots.layer1.map((item, index) => (
                    <GridCell key={`l1-${item.src}-${index}`} item={item} />
                  ))}
                </div>
                <div
                  className="layer"
                  ref={(node) => {
                    layerRefs.current[1] = node;
                  }}
                >
                  {slots.layer2.map((item, index) => (
                    <GridCell key={`l2-${item.src}-${index}`} item={item} />
                  ))}
                </div>
                <div
                  className="layer"
                  ref={(node) => {
                    layerRefs.current[2] = node;
                  }}
                >
                  {slots.layer3.map((item, index) => (
                    <GridCell key={`l3-${item.src}-${index}`} item={item} />
                  ))}
                </div>
                <div className="scaler">
                  {slots.scaler.src ? (
                    <Link href={`/products/${slots.scaler.slug}`} className="grid-cell-link">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={scalerImageRef}
                        src={slots.scaler.src}
                        alt={slots.scaler.alt}
                        draggable={false}
                      />
                    </Link>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img ref={scalerImageRef} src="" alt="" />
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
