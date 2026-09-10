import { houseCollections } from "./houseCollections";

export type ArcCarouselCollection = {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  productSlug: string;
  href: string;
};

export const arcCarouselCollections: ArcCarouselCollection[] = houseCollections.map((collection) => ({
  title: collection.title,
  subtitle: collection.description,
  image: collection.cover,
  imageAlt: collection.title,
  productSlug: collection.slug,
  href: `/collections/${collection.slug}`,
}));
