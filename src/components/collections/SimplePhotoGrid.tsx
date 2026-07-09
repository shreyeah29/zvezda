"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { GalleryImage } from "@/data/collectionCategories";

type SimplePhotoGridProps = {
  images: GalleryImage[];
  backgroundColor?: string;
};

export function SimplePhotoGrid({
  images,
  backgroundColor = "#08120d",
}: SimplePhotoGridProps) {
  return (
    <section className="px-4 py-14 md:px-8 md:py-20" style={{ backgroundColor }}>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {images.map((image, index) => {
          const content = (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.55, delay: (index % 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-md border border-white/6 bg-black/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </motion.div>
          );

          return image.href ? (
            <Link key={`${image.src}-${index}`} href={image.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={`${image.src}-${index}`}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
