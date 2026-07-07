"use client";

import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { brand } from "@/data/brand";

export function TypographyScene() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <p className="editorial-spacing mb-8 text-[10px] text-muted">The House</p>
        <TextReveal
          as="h2"
          className="font-display text-6xl leading-[0.95] font-light text-cream md:text-8xl lg:text-[10rem]"
          split="words"
        >
          Where light becomes garment
        </TextReveal>
        <div className="mt-16 max-w-xl">
          <TextReveal
            as="p"
            className="text-base leading-relaxed text-cream/60 md:text-lg"
            split="lines"
            delay={0.3}
          >
            {brand.philosophy}
          </TextReveal>
        </div>
      </div>
    </section>
  );
}

export function FabricScene() {
  return (
    <section className="relative min-h-screen px-6 py-32 md:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <MaskReveal
          src="/assets/images/products/set-12/HSP_5635.jpg"
          alt="Crimson couture detail — hand-finished silk"
          direction="up"
          accent="#8b1a2b"
          className="aspect-[3/4] w-full"
        />
        <div className="lg:pl-12">
          <p className="editorial-spacing mb-6 text-[10px] text-muted">The Craft</p>
          <TextReveal
            as="h2"
            className="font-display text-5xl leading-tight font-light text-cream md:text-6xl"
          >
            Every thread, intentional
          </TextReveal>
          <TextReveal
            as="p"
            className="mt-8 text-base leading-relaxed text-cream/60"
            split="lines"
            delay={0.2}
          >
            Hours of atelier work in every piece. Hand-placed detail, French lace corsetry, silk organza sculpted into form. This is not fashion — this is sculpture you can wear.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
