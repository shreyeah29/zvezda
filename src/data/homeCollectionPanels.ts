export type HomeCollectionPanel = {
  label: string;
  image: string;
  productSlug: string;
};

/** Homepage Party / Garden split — each panel links to its hero product */
export const homeCollectionPanels: HomeCollectionPanel[] = [
  {
    label: "Party Collection",
    image: "/assets/images/home/collection-split/HSP_3336.jpg",
    productSlug: "set-12",
  },
  {
    label: "Garden Collection",
    image: "/assets/images/products/set-1/HSP_4590.jpg",
    productSlug: "set-1",
  },
];
