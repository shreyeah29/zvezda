export type ShopHighlightCard = {
  setId: number;
  slug: string;
  title: string;
  image: string;
};

/** Individual hero shots — green, black & white, red, orange */
export const shopHighlightCards: ShopHighlightCard[] = [
  {
    setId: 1,
    slug: "set-1",
    title: "Fardin Elegance",
    image: "/assets/images/products/set-1/HSP_4327.jpg",
  },
  {
    setId: 8,
    slug: "set-8",
    title: "Eclipse Royale",
    image: "/assets/images/products/set-8/HSP_2981.jpg",
  },
  {
    setId: 12,
    slug: "set-12",
    title: "Crimson",
    image: "/assets/images/products/set-12/HSP_5750.jpg",
  },
  {
    setId: 13,
    slug: "set-13",
    title: "Ember",
    image: "/assets/images/products/set-13/BHA_2011.jpg",
  },
];

/** Pink collection row — sets 15–18 */
export const pinkHighlightCards: ShopHighlightCard[] = [
  {
    setId: 15,
    slug: "set-15",
    title: "Rose Cascade",
    image: "/assets/images/products/set-15/HSP_4946.jpg",
  },
  {
    setId: 16,
    slug: "set-16",
    title: "Blush Coordination",
    image: "/assets/images/products/set-16/HSP_5981.JPG",
  },
  {
    setId: 17,
    slug: "set-17",
    title: "Petal Garden",
    image: "/assets/images/products/set-17/HSP_5291.jpg",
  },
  {
    setId: 18,
    slug: "set-18",
    title: "Rose Mirage",
    image: "/assets/images/products/set-18/HSP_5080.jpg",
  },
];
