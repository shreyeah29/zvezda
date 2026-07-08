import type { Collection } from "@/data/collections";

export type CollectionSlide = {
  index: number;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  season: string;
  image: string;
  href: string;
};

export function buildCollectionSlides(data: Collection[]): CollectionSlide[] {
  return data.map((collection, index) => ({
    index,
    slug: collection.slug,
    number: String(index + 1).padStart(2, "0"),
    title: collection.title,
    subtitle: collection.subtitle,
    description: collection.description,
    season: collection.season,
    image: collection.hero,
    href: `/collections/${collection.slug}`,
  }));
}
