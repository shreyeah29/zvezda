import { houseCollections } from "./houseCollections";

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
  media: collection.photos.map((src) => ({
    type: "image" as const,
    src,
    alt: collection.title,
    href: `/collections/${collection.slug}`,
  })),
}));
