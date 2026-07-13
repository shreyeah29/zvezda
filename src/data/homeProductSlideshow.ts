import { formatPrice, getProduct } from "@/data/products";
import type { SlideshowProduct } from "@/components/home/ProductSlideshow/types";

const SLIDESHOW_PIECES = [
  { slug: "set-12", image: "/assets/images/home/slideshow/crimson.png" },
  { slug: "set-13", image: "/assets/images/home/slideshow/ember.png" },
  { slug: "set-8", image: "/assets/images/home/slideshow/eclipse-royale.png" },
  { slug: "set-15", image: "/assets/images/home/slideshow/rose-cascade.png" },
  { slug: "set-2", image: "/assets/images/home/slideshow/garden.png" },
] as const;

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

const COLOR_OPTIONS: Record<string, { name: string }[]> = {
  "set-12": [{ name: "Crimson" }, { name: "Noir" }],
  "set-13": [{ name: "Ember" }, { name: "Copper" }],
  "set-8": [{ name: "Noir" }, { name: "Ivoire" }],
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
