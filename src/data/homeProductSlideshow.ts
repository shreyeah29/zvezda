import { formatPrice, getProduct } from "@/data/products";
import type { SlideItem } from "@/components/home/ProductSlideshow/types";

const SLIDESHOW_PIECES = [
  {
    slug: "set-12",
    image: "/assets/images/home/slideshow/crimson.png",
    blendMode: "normal" as const,
  },
  {
    slug: "set-13",
    image: "/assets/images/home/slideshow/ember.png",
    blendMode: "normal" as const,
  },
  {
    slug: "set-8",
    image: "/assets/images/home/slideshow/eclipse-royale.jpg",
    blendMode: "screen" as const,
  },
  {
    slug: "set-15",
    image: "/assets/images/home/slideshow/rose-cascade.jpg",
    blendMode: "screen" as const,
  },
  {
    slug: "set-2",
    image: "/assets/images/home/slideshow/garden.png",
    blendMode: "normal" as const,
  },
];

export function getHomeProductSlideshowItems(): SlideItem[] {
  return SLIDESHOW_PIECES.flatMap((piece) => {
    const product = getProduct(piece.slug);
    if (!product) return [];

    return [
      {
        image: {
          src: piece.image,
          alt: product.name,
        },
        imageBlendMode: piece.blendMode,
        productInfo: {
          title: product.name,
          description: product.story,
          price: formatPrice(product.price, product.currency),
        },
        buttonLink: `/products/${piece.slug}`,
      },
    ];
  });
}
