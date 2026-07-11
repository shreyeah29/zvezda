import { getSet, setPhotoPath } from "./sets";

export type HomeScrollGallerySlide = {
  setId: number;
  photo: string;
  alt: string;
};

/** Ten editorial portrait shots (4:5) — repeated in the infinite scroll gallery */
export const homeScrollGallerySlides: HomeScrollGallerySlide[] = [
  { setId: 1, photo: "HSP_4327.jpg", alt: "Garden green — full look" },
  { setId: 1, photo: "HSP_4607.jpg", alt: "Garden green — portrait" },
  { setId: 2, photo: "HSP_4819.jpg", alt: "Garden green — editorial" },
  { setId: 3, photo: "HSP_3971.jpg", alt: "Garden green — detail" },
  { setId: 8, photo: "HSP_2981.jpg", alt: "Noir — full look" },
  { setId: 8, photo: "HSP_3056.jpg", alt: "Noir — portrait" },
  { setId: 12, photo: "HSP_5750.jpg", alt: "Red — full look" },
  { setId: 12, photo: "HSP_5571.jpg", alt: "Red — editorial" },
  { setId: 13, photo: "BHA_2011.jpg", alt: "Orange — full look" },
  { setId: 11, photo: "HSP_5875.jpg", alt: "Yellow — portrait" },
];

export function resolveScrollGalleryImages() {
  return homeScrollGallerySlides.flatMap(({ setId, photo, alt }) => {
    const set = getSet(setId);
    if (!set) return [];
    return [{ src: setPhotoPath(set, photo), alt }];
  });
}
