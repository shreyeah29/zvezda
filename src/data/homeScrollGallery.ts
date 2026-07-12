export type HomeScrollGallerySlide = {
  src: string;
  alt: string;
};

/** Homepage scroll gallery — curated editorial stills; repeated in the infinite loop. */
export const homeScrollGallerySlides: HomeScrollGallerySlide[] = [
  { src: "/assets/images/home-gallery/HSP_6126.jpg", alt: "Peach editorial — floral duo" },
  { src: "/assets/images/home-gallery/HSP_6089.jpg", alt: "Peach editorial — garden walk" },
  { src: "/assets/images/home-gallery/HSP_6101.jpg", alt: "Peach editorial — mint gown portrait" },
  { src: "/assets/images/home-gallery/HSP_6032.jpg", alt: "Peach editorial — mirrored florals" },
];

export function resolveScrollGalleryImages() {
  return homeScrollGallerySlides;
}
