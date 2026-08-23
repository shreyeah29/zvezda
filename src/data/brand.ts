export const brand = {
  name: "Zvezda",
  tagline: "Where light becomes garment",
  philosophy:
    "Born from the belief that clothing should feel like a memory — fleeting, luminous, and impossibly intimate. Each piece is sculpted by hand, worn like a second skin.",
  statement: "Fall in love before you see the price.",
  logo: {
    champagne: "/assets/brand/zvezda-logo-champagne.png",
    white: "/assets/brand/zvezda-logo-white.png",
    dark: "/assets/brand/zvezda-logo-dark.png",
  },
  colors: {
    black: "#0a0a0a",
    cream: "#f5f0e8",
    crimson: "#8b1a2b",
    olive: "#4a5240",
    gold: "#c4a574",
  },
} as const;

export const videos = {
  /** Homepage hero — 1080p master; H.264 fallback is chosen in the player */
  hero: "/assets/videos/products/set-12/RedDressSolo.mp4",
  heroMobile: "/assets/videos/products/set-12/RedDressSolo.mp4",
  garden: "/assets/videos/GardenSolo3.mp4",
} as const;
