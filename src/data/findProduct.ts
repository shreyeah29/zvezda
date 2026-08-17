import { getProduct, type Product } from "./products";
import { getShopProduct, shopProducts } from "./shopCatalog";

export function findProduct(slug: string): Product | undefined {
  return getProduct(slug) ?? getShopProduct(slug);
}

export function isShopProduct(slug: string) {
  return Boolean(getShopProduct(slug));
}

export { shopProducts };
