import { houseCollections } from "./houseCollections";
import { getCollectionFilm, getShopProduct } from "./shopCatalog";

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

export const jacquemusCollections: JacquemusCollection[] = houseCollections.map((collection) => {
  const images = collection.productSlugs.flatMap((slug) => {
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
  });

  const film = getCollectionFilm(collection.slug);
  if (!film) return { id: collection.slug, name: collection.title, season: collection.season, media: images };

  return {
    id: collection.slug,
    name: collection.title,
    season: collection.season,
    media: [
      {
        type: "video" as const,
        src: film.src,
        poster: film.poster,
        alt: `${collection.title} film`,
        href: film.href,
      },
      ...images,
    ],
  };
});
