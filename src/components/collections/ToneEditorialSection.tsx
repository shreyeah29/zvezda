"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getSet, setPhotoPath } from "@/data/sets";
import { toneSubsections } from "@/data/collectionCategories";
import { GalleryGradientSection } from "@/components/collections/GalleryGradientSection";

const EDITORIAL_NAMES: Record<number, string> = {
  5: "Blush Mirage",
  11: "Solar",
  12: "Crimson",
};

type ToneEditorialSectionProps = {
  textColor?: string;
};

export function ToneEditorialSection({ textColor = "#f5f0e8" }: ToneEditorialSectionProps) {
  return (
    <div>
      {toneSubsections.map((tone, index) => (
        <GalleryGradientSection key={tone.id} gradientId={tone.id} className="border-t border-white/6">
          <ToneBlock tone={tone} index={index} textColor={textColor} />
        </GalleryGradientSection>
      ))}
    </div>
  );
}

function ToneBlock({
  tone,
  index,
  textColor,
}: {
  tone: (typeof toneSubsections)[number];
  index: number;
  textColor: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  const photos = tone.setIds.flatMap((setId) => {
    const set = getSet(setId);
    if (!set) return [];
    return set.photos.map((photo) => ({
      src: setPhotoPath(set, photo),
      alt: EDITORIAL_NAMES[setId] ?? set.slug,
    }));
  });

  const isEven = index % 2 === 0;

  return (
    <section ref={sectionRef} className="py-20 md:py-28">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-20 ${
          isEven ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <motion.div style={{ y: textY }}>
          <p className="editorial-spacing text-[10px]" style={{ color: tone.accentColor }}>
            {tone.subtitle}
          </p>
          <h3 className="font-display mt-5 text-5xl font-light md:text-7xl" style={{ color: textColor }}>
            {tone.title}
          </h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed md:text-base" style={{ color: `${textColor}99` }}>
            {tone.story}
          </p>
          <div className="mt-10 overflow-hidden rounded-xl border border-white/8">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={tone.heroPoster}
              className="aspect-[16/10] w-full object-cover"
            >
              <source src={tone.heroVideo} type="video/mp4" />
            </video>
          </div>
        </motion.div>

        <motion.div style={{ y: imageY }} className="grid grid-cols-2 gap-3 md:gap-4">
          {photos.map((photo, photoIndex) => (
            <motion.div
              key={`${photo.src}-${photoIndex}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.65, delay: photoIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`overflow-hidden rounded-lg border border-white/8 ${
                photoIndex === 0 ? "col-span-2" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full object-cover object-top ${photoIndex === 0 ? "aspect-[16/10]" : "aspect-[3/4]"}`}
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
