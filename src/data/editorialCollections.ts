import { collections, type Collection } from "./collections";

export type EditorialCollection = {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  filterKey: EditorialFilterKey;
};

export type EditorialFilterKey =
  | "all"
  | "black"
  | "garden"
  | "bridal"
  | "evening"
  | "editorial";

export const EDITORIAL_FILTERS: { key: EditorialFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "black", label: "Black" },
  { key: "garden", label: "Garden" },
  { key: "bridal", label: "Bridal" },
  { key: "evening", label: "Evening" },
  { key: "editorial", label: "Editorial" },
];

function fromCollection(
  slug: string,
  title: string,
  description: string,
  filterKey: EditorialFilterKey,
): EditorialCollection | null {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return null;
  return {
    id: filterKey,
    title,
    description,
    image: collection.cover,
    slug: collection.slug,
    filterKey,
  };
}

export const editorialCollections: EditorialCollection[] = [
  fromCollection(
    "noir",
    "Black Collection",
    "Monochrome as emotion — sculptural silhouettes stripped to essence, presence in shadow.",
    "black",
  )!,
  fromCollection(
    "garden",
    "Garden Collection",
    "Silk caught between petals and conservatory light — olive, moss, and glasshouse shadow.",
    "garden",
  )!,
  fromCollection(
    "peach",
    "Bridal Collection",
    "Soft warmth against pale stone — intimate, luminous, impossibly tender.",
    "bridal",
  )!,
  fromCollection(
    "red",
    "Evening Collection",
    "Crimson as declaration — deep, saturated, cinematic evening wear.",
    "evening",
  )!,
  fromCollection(
    "orange",
    "Editorial Collection",
    "Burnt satin in candlelight — warmth, movement, and editorial gesture.",
    "editorial",
  )!,
  fromCollection(
    "yellow",
    "Solar Collection",
    "Sunlight made garment — bold, architectural, unapologetically bright.",
    "editorial",
  )!,
].filter(Boolean);

export function getEditorialCollection(slug: string) {
  return editorialCollections.find((c) => c.slug === slug);
}

export function filterEditorialCollections(filter: EditorialFilterKey) {
  if (filter === "all") return editorialCollections;
  return editorialCollections.filter((c) => c.filterKey === filter);
}

export function collectionToEditorial(collection: Collection): EditorialCollection | undefined {
  return editorialCollections.find((c) => c.slug === collection.slug);
}
