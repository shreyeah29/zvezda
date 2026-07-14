export type ArcCarouselCollection = {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /** Product page slug under /products/[slug] */
  productSlug: string;
};

export const arcCarouselCollections: ArcCarouselCollection[] = [
  {
    title: "Emerald Reverie",
    subtitle: "Fluid silhouettes inspired by nature's elegance.",
    image: "/assets/images/products/set-1/HSP_4590.jpg",
    imageAlt: "Emerald Reverie — garden green gown",
    productSlug: "set-1",
  },
  {
    title: "Amber Solstice",
    subtitle: "Warm amber silhouettes in golden Provençal light.",
    image: "/assets/images/products/set-6/HSP_2889.jpg",
    imageAlt: "Amber Solstice — black gown with amber wrap",
    productSlug: "set-6",
  },
  {
    title: "Crimson Muse",
    subtitle: "Statement pieces crafted for unforgettable evenings.",
    image: "/assets/images/products/set-12/HSP_5750.jpg",
    imageAlt: "Crimson Muse — red evening gown",
    productSlug: "set-12",
  },
  {
    title: "Rose Cascade",
    subtitle: "Soft romantic silhouettes with couture detailing.",
    image: "/assets/images/products/set-15/HSP_4946.jpg",
    imageAlt: "Rose Cascade — pink floral gown",
    productSlug: "set-15",
  },
  {
    title: "Golden Solstice",
    subtitle: "Radiant designs inspired by warm golden light.",
    image: "/assets/images/products/set-11/HSP_5916.jpg",
    imageAlt: "Golden Solstice — yellow architectural gown",
    productSlug: "set-11",
  },
  {
    title: "Ivory Noir",
    subtitle: "A balance of monochrome elegance and modern glamour.",
    image: "/assets/images/products/set-9/HSP_3218.jpg",
    imageAlt: "Ivory Noir — ivory and black gown",
    productSlug: "set-9",
  },
  {
    title: "Midnight Bloom",
    subtitle: "Nocturnal florals woven through sculptural black silk.",
    image: "/assets/images/products/set-7/HSP_2254.jpg",
    imageAlt: "Midnight Bloom — black evening gown",
    productSlug: "set-7",
  },
];
