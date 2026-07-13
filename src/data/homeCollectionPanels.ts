export type HomeCollectionPanel = {
  label: string;
  image: string;
  productSlug: string;
};

/** Homepage Party / Garden split — each panel links to its hero product */
export const homeCollectionPanels: HomeCollectionPanel[] = [
  {
    label: "Party Collection",
    image: "/assets/images/products/set-11/HSP_5916.jpg",
    productSlug: "set-11",
  },
  {
    label: "Garden Collection",
    image: "/assets/images/products/set-1/HSP_4590.jpg",
    productSlug: "set-1",
  },
];
