"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { getGridMotionSlots, type GridMotionItem } from "@/components/GridMotionReveal/gridMotionData";
import { initGridMotionAnimation } from "@/components/GridMotionReveal/gridMotionAnimation";
import TextVideoMask from "@/components/TextVideoMask/TextVideoMask";
import { videos } from "@/data/brand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "./GridMotionReveal.css";

function GridCell({ item }: { item: GridMotionItem }) {
  const router = useRouter();

  if (!item.src) return <div />;

  return (
    <div
      className="grid-cell"
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/products/${item.slug}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/products/${item.slug}`);
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} draggable={false} />
    </div>
  );
}

export function GridMotionReveal() {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const slots = useMemo(() => getGridMotionSlots(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const scalerImageRef = useRef<HTMLImageElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    const firstSection = sectionRef.current;
    const image = scalerImageRef.current;
    const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!image || !firstSection || layers.length === 0) return;

    let cleanup: (() => void) | undefined;
    let frameId = 0;

    const setup = () => {
      cleanup?.();
      cleanup = initGridMotionAnimation({ image, firstSection, layers });
    };

    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(setup);
    });

    return () => {
      cancelAnimationFrame(frameId);
      cleanup?.();
    };
  }, [reducedMotion, slots]);

  return (
    <div className="grid-motion-wrap snap-none" aria-label="Collection grid motion gallery">
      <div className="content-wrap">
        <header className="collection-header">
          <TextVideoMask
            text={"COLLECTION\n2026"}
            videoFile={videos.hero}
            videoUrl={videos.hero}
            textAlign="left"
            backgroundColor="#000000"
            font={{
              fontSize: "clamp(4rem, 12vw, 12rem)",
              fontFamily:
                '"SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif, system-ui',
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: "0.85",
            }}
          />
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
                <div
                  className="scaler"
                  role="link"
                  tabIndex={0}
                  onClick={() => {
                    if (slots.scaler.slug) router.push(`/products/${slots.scaler.slug}`);
                  }}
                  onKeyDown={(event) => {
                    if (!slots.scaler.slug) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/products/${slots.scaler.slug}`);
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={scalerImageRef}
                    src={slots.scaler.src}
                    alt={slots.scaler.alt}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
