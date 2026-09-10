import { houseCollections } from "./houseCollections";

export type HomeCollectionPanel = {
  label: string;
  image: string;
  href: string;
};

export const homeCollectionPanels: HomeCollectionPanel[] = houseCollections.map((collection) => ({
  label: `${collection.title} Collection`,
  image: collection.cover,
  href: `/collections/${collection.slug}`,
}));
