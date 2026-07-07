"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { TextReveal } from "@/components/ui/TextReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { brand } from "@/data/brand";
import { setVideoPath, getSet } from "@/data/sets";

const aboutVideo = setVideoPath(getSet(3)!)!;

const timeline = [
  { year: "2019", title: "The First Sketch", description: "A single drawing on hotel stationery in Paris." },
  { year: "2021", title: "Atelier Founded", description: "A small studio between Milan and Lake Como." },
  { year: "2024", title: "Garden Collection", description: "The debut — silk among wildflowers." },
  { year: "2026", title: "Zvezda Launch", description: "The house opens to the world." },
];

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          <main>
            <section className="relative h-screen w-full overflow-hidden">
              <video autoPlay muted loop playsInline className="h-full w-full object-cover">
                <source src={aboutVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-ink/40" />
              <div className="absolute inset-0 flex items-end p-6 md:p-12">
                <TextReveal
                  as="h1"
                  className="font-display text-6xl font-light text-cream md:text-8xl"
                >
                  {`The House of ${brand.name}`}
                </TextReveal>
              </div>
            </section>

            <section className="px-6 py-32 md:px-12">
              <div className="mx-auto max-w-3xl text-center">
                <TextReveal
                  as="p"
                  className="font-display text-3xl leading-relaxed font-light text-cream md:text-5xl"
                  split="lines"
                >
                  {brand.philosophy}
                </TextReveal>
              </div>
            </section>

            <section className="px-6 py-32 md:px-12">
              <div className="mx-auto max-w-4xl">
                <p className="editorial-spacing mb-16 text-[10px] text-muted">Timeline</p>
                <div className="space-y-16 border-l border-cream/10 pl-8 md:pl-16">
                  {timeline.map((item) => (
                    <div key={item.year} className="relative">
                      <span className="absolute -left-[37px] h-2 w-2 rounded-full bg-gold md:-left-[69px]" />
                      <p className="editorial-spacing text-[10px] text-gold">{item.year}</p>
                      <h3 className="font-display mt-2 text-3xl text-cream">{item.title}</h3>
                      <p className="mt-2 text-cream/60">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 px-6 pb-32 md:grid-cols-2 md:px-12">
              <MaskReveal
                src="/assets/images/products/set-13/BHA_2011.jpg"
                alt="Ember collection — tailoring detail"
                direction="up"
                accent="#c47a3a"
                className="aspect-[4/5]"
              />
              <MaskReveal
                src="/assets/images/products/set-5/HSP_4393.jpg"
                alt="Peach Silhouette — collection sketch"
                direction="down"
                accent="#d4a088"
                className="aspect-[4/5]"
              />
            </section>
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
