/** Pair the sharp HEVC master with an H.264 fallback for browsers that cannot play HEVC. */
export function videoSourcePair(src: string) {
  const isAmbient = src.includes("/videos/products/ambient/");
  const sharp = isAmbient ? src.replace("/videos/products/ambient/", "/videos/products/") : src;
  const fallback = isAmbient
    ? src
    : src.includes("/videos/products/")
      ? src.replace("/videos/products/", "/videos/products/ambient/")
      : src.includes("RedDressSolo")
        ? "/assets/videos/web/RedDressSolo.mp4"
        : src;

  return { sharp, fallback };
}
