export type SlideshowColor = {
  name: string;
};

export type SlideshowProduct = {
  slug: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  price: string;
  sizes: string[];
  colors: SlideshowColor[];
  href: string;
};
