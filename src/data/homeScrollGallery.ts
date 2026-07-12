export type HomeScrollGallerySlide = {
  src: string;
  alt: string;
};

/** Homepage scroll gallery — curated editorial stills; repeated in the infinite loop. */
export const homeScrollGallerySlides: HomeScrollGallerySlide[] = [
  { src: "/assets/images/film/HSP_6126.JPG", alt: "Peach editorial — floral duo" },
  { src: "/assets/images/film/HSP_6089.JPG", alt: "Peach editorial — garden walk" },
  { src: "/assets/images/film/HSP_6101.JPG", alt: "Peach editorial — mint gown portrait" },
  { src: "/assets/images/film/HSP_6032.JPG", alt: "Peach editorial — mirrored florals" },
];

export function resolveScrollGalleryImages() {
  return homeScrollGallerySlides;
}
