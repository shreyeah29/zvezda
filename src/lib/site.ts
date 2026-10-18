export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zvezdaatelier.com"
).replace(/\/$/, "");

export function canonicalUrl(pathname = "/") {
  if (!pathname || pathname === "/") return `${SITE_URL}/`;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

export const SITE_NAME = "Zvezda Atelier";
export const SITE_TAGLINE = "Where light becomes garment";
export const SITE_DESCRIPTION =
  "Zvezda Atelier is a luxury fashion house in Hyderabad, founded by Bindu Reddy. Made-to-order gowns, couture craftsmanship, and cinematic collections.";

export const SITE_OG_IMAGE = "/assets/images/products/set-15/HSP_4946.jpg";
