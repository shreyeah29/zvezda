"use client";

import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { products } from "@/data/products";

const galleryImages = products.flatMap((p) => [
  { src: p.hero, alt: p.name },
  ...p.gallery.slice(0, 1).map((src) => ({ src, alt: p.name })),
]);

export default function GalleryPage() {
  return (
    <SessionLoadGate>
        <SmoothScroll>
          <CustomCursor />
          <main id="main-content" className="px-6 pt-32 pb-16 md:px-12">
            <div className="mx-auto max-w-7xl">
              <p className="editorial-spacing mb-4 text-[10px] text-muted">Archive</p>
              <TextReveal
                as="h1"
                className="font-display mb-24 text-6xl font-light text-cream md:text-8xl"
              >
                Gallery
              </TextReveal>

              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {galleryImages.map((img, i) => (
                  <div
                    key={`${img.src}-${i}`}
                    className="group mb-4 break-inside-avoid"
                    data-cursor="VIEW"
                  >
                    <MaskReveal
                      src={img.src}
                      alt={img.alt}
                      direction={i % 3 === 0 ? "up" : i % 3 === 1 ? "left" : "right"}
                      className="w-full transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </SmoothScroll>
    </SessionLoadGate>
  );
}
