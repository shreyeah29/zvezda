export type HomeScrollGallerySlide = {
  src: string;
  alt: string;
};

/** Homepage scroll gallery — pink & black editorial stills; repeated in the infinite loop. */
export const homeScrollGallerySlides: HomeScrollGallerySlide[] = [
  { src: "/assets/images/home-gallery/HSP_1864.jpg", alt: "Pink & black editorial — trio portrait" },
  { src: "/assets/images/home-gallery/HSP_1857.jpg", alt: "Pink & black editorial — column pose" },
  { src: "/assets/images/home-gallery/HSP_1935.jpg", alt: "Pink & black editorial — velvet gown" },
  { src: "/assets/images/home-gallery/HSP_2074.jpg", alt: "Pink & black editorial — seated trio" },
  { src: "/assets/images/home-gallery/HSP_2085.jpg", alt: "Pink & black editorial — ballroom scene" },
  { src: "/assets/images/home-gallery/HSP_2011.jpg", alt: "Pink & black editorial — two-tone gown" },
  { src: "/assets/images/home-gallery/HSP_1988.jpg", alt: "Pink & black editorial — velvet close-up" },
  { src: "/assets/images/home-gallery/HSP_1990.jpg", alt: "Pink & black editorial — off-shoulder look" },
];

export function resolveScrollGalleryImages() {
  return homeScrollGallerySlides;
}
