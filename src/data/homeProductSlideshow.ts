import { formatPrice, getProduct } from "@/data/products";
import type { SlideshowProduct } from "@/components/home/ProductSlideshow/types";

const SLIDESHOW_PIECES = [
  { slug: "set-12", image: "/assets/images/home/slideshow/crimson.png" },
  {
    slug: "set-13",
    image: "/assets/images/home/slideshow/DE28B8E0-FF52-4278-BA81-4E1F918BCCBD.png",
  },
  {
    slug: "set-11",
    image: "/assets/images/home/slideshow/011DE4DF-2671-47B6-B3F0-2ED4B2A07269.png",
  },
  { slug: "set-15", image: "/assets/images/home/slideshow/rose-cascade.png" },
  { slug: "set-2", image: "/assets/images/home/slideshow/garden.png" },
] as const;

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

const COLOR_OPTIONS: Record<string, { name: string }[]> = {
  "set-12": [{ name: "Crimson" }, { name: "Noir" }],
  "set-13": [{ name: "Ember" }, { name: "Copper" }],
  "set-11": [{ name: "Solar" }, { name: "Gold" }],
  "set-15": [{ name: "Rose" }, { name: "Blush" }],
  "set-2": [{ name: "Garden" }, { name: "Olive" }],
};

export function getHomeProductSlideshowItems(): SlideshowProduct[] {
  return SLIDESHOW_PIECES.flatMap((piece) => {
    const product = getProduct(piece.slug);
    if (!product) return [];

    return [
      {
        slug: piece.slug,
        image: piece.image,
        alt: product.name,
        title: product.name,
        description: product.story,
        price: formatPrice(product.price, product.currency),
        sizes: SIZE_OPTIONS,
        colors: COLOR_OPTIONS[piece.slug] ?? [{ name: "Default" }],
        href: `/products/${piece.slug}`,
      },
    ];
  });
}
