export type HomeCollectionPanel = {
  label: string;
  image: string;
  href: string;
};

/** Desktop home split under the hero — both open the Romance catalogue */
export const homeCollectionPanels: HomeCollectionPanel[] = [
  {
    label: "Romance",
    image: "/assets/images/shop/olive-tiered-zephyr-mini-dress/HSP_3876.jpg",
    href: "/collections/romance",
  },
  {
    label: "Romance",
    image: "/assets/images/shop/jardin-elegance-dress/HSP_4590.jpg",
    href: "/collections/romance",
  },
];

/** Desktop home — The Occasion, under the Bespoke film */
export const homeOccasionPanels: HomeCollectionPanel[] = [
  {
    label: "Occasion",
    image: "/assets/images/shop/molten-muse/HSP_5858.jpg",
    href: "/collections/occasion",
  },
  {
    label: "Occasion",
    image: "/assets/images/products/set-12/HSP_5635.jpg",
    href: "/collections/occasion",
  },
];
