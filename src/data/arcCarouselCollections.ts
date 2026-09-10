import { getProduct } from "./products";

export type ArcCarouselCollection = {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /** Product page slug under /products/[slug] */
  productSlug: string;
};

const ARC_SOURCES = [
  {
    slug: "set-1",
    image: "/assets/images/products/set-1/HSP_4590.jpg",
    subtitle: "Moss-olive silk with a floor-length fall and hand-placed florals.",
  },
  {
    slug: "set-6",
    image: "/assets/images/products/set-6/HSP_2889.jpg",
    subtitle: "Black couture cut with hand-sculpted crimson florals.",
  },
  {
    slug: "set-12",
    image: "/assets/images/products/set-12/HSP_5750.jpg",
    subtitle: "A sculpted crimson gown, open at the back, falling into a generous train.",
  },
  {
    slug: "set-15",
    image: "/assets/images/products/set-15/HSP_4946.jpg",
    subtitle: "Lustrous pink satin with crystal at the neckline and an asymmetric skirt.",
  },
  {
    slug: "set-11",
    image: "/assets/images/products/set-11/HSP_5916.jpg",
    subtitle: "Golden satin in a halter silhouette that catches the light as she moves.",
  },
  {
    slug: "set-9",
    image: "/assets/images/products/set-9/HSP_3218.jpg",
    subtitle: "A black strapless bodice falling into layered ivory drapes.",
  },
  {
    slug: "set-7",
    image: "/assets/images/products/set-7/HSP_2254.jpg",
    subtitle: "Off-shoulder midnight blush — a two-piece set for twilight.",
  },
] as const;

export const arcCarouselCollections: ArcCarouselCollection[] = ARC_SOURCES.map(({ slug, image, subtitle }) => {
  const product = getProduct(slug);
  const title = product?.name ?? slug;

  return {
    title,
    subtitle,
    image,
    imageAlt: title,
    productSlug: slug,
  };
});
