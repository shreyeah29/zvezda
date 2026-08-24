/** Pair the sharp HEVC master with a 1080p H.264 fallback for browsers that cannot play HEVC. */

const PRODUCT_PREFIX = "/assets/videos/products/";

function productRelativePath(src: string): string | null {
  const markers = [
    "/assets/videos/products/ambient/",
    "/assets/videos/products/desktop/",
    "/assets/videos/products/",
  ];
  for (const marker of markers) {
    const index = src.indexOf(marker);
    if (index !== -1) {
      return src.slice(index + marker.length);
    }
  }
  return null;
}

export function videoSourcePair(src: string) {
  const rel = productRelativePath(src);
  if (rel) {
    return {
      sharp: `${PRODUCT_PREFIX}${rel}`,
      fallback: `${PRODUCT_PREFIX}desktop/${rel}`,
    };
  }

  if (src.includes("RedDressSolo")) {
    return {
      sharp: `${PRODUCT_PREFIX}set-12/RedDressSolo.mp4`,
      fallback: `${PRODUCT_PREFIX}desktop/set-12/RedDressSolo.mp4`,
    };
  }

  return { sharp: src, fallback: src };
}
