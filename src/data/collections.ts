import { houseCollections } from "./houseCollections";

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  hero: string;
  accent: string;
  season: string;
  setIds: number[];
};

export const collections: Collection[] = houseCollections.map((collection) => ({
  slug: collection.slug,
  title: collection.title,
  subtitle: collection.title,
  description: collection.description,
  cover: collection.cover,
  hero: collection.hero,
  accent: collection.accent,
  season: collection.season,
  setIds: [],
}));

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
