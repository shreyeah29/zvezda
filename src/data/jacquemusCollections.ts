import { houseCollections } from "./houseCollections";
import { getShopProduct } from "./shopCatalog";

export type JacquemusCollectionMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  href?: string;
  poster?: string;
};

export type JacquemusCollection = {
  id: string;
  name: string;
  season: string;
  media: JacquemusCollectionMedia[];
};

export const jacquemusCollections: JacquemusCollection[] = houseCollections.map((collection) => ({
  id: collection.slug,
  name: collection.title,
  season: collection.season,
  media: collection.productSlugs.flatMap((slug) => {
    const product = getShopProduct(slug);
    if (!product) return [];
    return [
      {
        type: "image" as const,
        src: product.hero,
        alt: product.name,
        href: `/products/${product.slug}`,
      },
    ];
  }),
}));
