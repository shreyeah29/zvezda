export type HomeCollectionPanel = {
  label: string;
  image: string;
  href: string;
};

/** Desktop home split under the hero — both Romance, product pages */
export const homeCollectionPanels: HomeCollectionPanel[] = [
  {
    label: "Romance",
    image: "/assets/images/shop/olive-tiered-zephyr-mini-dress/HSP_3876.jpg",
    href: "/products/olive-tiered-zephyr-mini-dress",
  },
  {
    label: "Romance",
    image: "/assets/images/products/set-1/HSP_4590.jpg",
    href: "/products/daughters-of-spring-green",
  },
];

/** Desktop home — The Occasion, under the Bespoke film */
export const homeOccasionPanels: HomeCollectionPanel[] = [
  {
    label: "Occasion",
    image: "/assets/images/shop/molten-muse/HSP_5858.jpg",
    href: "/products/molten-muse",
  },
  {
    label: "Occasion",
    image: "/assets/images/products/set-12/HSP_5635.jpg",
    href: "/products/carmine-ascend",
  },
];
