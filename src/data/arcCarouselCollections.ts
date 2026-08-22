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
  { slug: "set-1", image: "/assets/images/products/set-1/HSP_4590.jpg" },
  { slug: "set-6", image: "/assets/images/products/set-6/HSP_2889.jpg" },
  { slug: "set-12", image: "/assets/images/products/set-12/HSP_5750.jpg" },
  { slug: "set-15", image: "/assets/images/products/set-15/HSP_4946.jpg" },
  { slug: "set-11", image: "/assets/images/products/set-11/HSP_5916.jpg" },
  { slug: "set-9", image: "/assets/images/products/set-9/HSP_3218.jpg" },
  { slug: "set-7", image: "/assets/images/products/set-7/HSP_2254.jpg" },
] as const;

export const arcCarouselCollections: ArcCarouselCollection[] = ARC_SOURCES.map(({ slug, image }) => {
  const product = getProduct(slug);
  const title = product?.name ?? slug;
  const subtitle = product?.description ?? "";

  return {
    title,
    subtitle,
    image,
    imageAlt: title,
    productSlug: slug,
  };
});
