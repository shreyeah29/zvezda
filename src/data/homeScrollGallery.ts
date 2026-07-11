import { getSet, setPhotoPath } from "./sets";

export type HomeScrollGallerySlide = {
  setId: number;
  photo: string;
  alt: string;
};

/**
 * Homepage scroll gallery — set 1 + set 2 only.
 * Exact photos provided by the brand; these repeat in the infinite loop.
 */
export const homeScrollGallerySlides: HomeScrollGallerySlide[] = [
  { setId: 1, photo: "HSP_4607.jpg", alt: "Garden set 1 — seated portrait" },
  { setId: 1, photo: "HSP_4590.jpg", alt: "Garden set 1 — full look" },
  { setId: 1, photo: "HSP_4510.jpg", alt: "Garden set 1 — standing look" },
  { setId: 1, photo: "HSP_4327.jpg", alt: "Garden set 1 — detail" },
  { setId: 2, photo: "HSP_4810.jpg", alt: "Garden set 2 — bodice detail" },
  { setId: 2, photo: "HSP_4797.jpg", alt: "Garden set 2 — garden pose" },
  { setId: 2, photo: "HSP_4828.jpg", alt: "Garden set 2 — full look" },
  { setId: 2, photo: "HSP_4791.jpg", alt: "Garden set 2 — front look" },
  { setId: 2, photo: "HSP_4819.jpg", alt: "Garden set 2 — skirt detail" },
];

export function resolveScrollGalleryImages() {
  return homeScrollGallerySlides.flatMap(({ setId, photo, alt }) => {
    const set = getSet(setId);
    if (!set) return [];
    return [{ src: setPhotoPath(set, photo), alt }];
  });
}
