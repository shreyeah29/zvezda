/** Editorial product stills for the showcase cursor trail — one image per set. */
export const SHOWCASE_IMAGE_TRAIL = [
  "/assets/images/products/set-1/HSP_4510.jpg",
  "/assets/images/products/set-8/HSP_3076.jpg",
  "/assets/images/products/set-9/HSP_3194.jpg",
  "/assets/images/products/set-11/HSP_5916.jpg",
  "/assets/images/products/set-12/HSP_5635.jpg",
  "/assets/images/products/set-13/HSP_2603.jpg",
  "/assets/images/products/set-14/HSP_2498.jpg",
  "/assets/images/products/set-15/HSP_4946.jpg",
  "/assets/images/products/set-17/HSP_5292.jpg",
  "/assets/images/products/set-18/HSP_5186.jpg",
] as const;

export function getShowcaseImageTrailItems(): string[] {
  return [...SHOWCASE_IMAGE_TRAIL];
}
