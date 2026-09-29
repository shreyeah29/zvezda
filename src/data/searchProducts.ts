import type { Product } from "./products";
import { shopProducts } from "./shopCatalog";

const SYNONYMS: Record<string, string[]> = {
  pants: ["pants", "pant", "trousers", "trouser", "jumpsuit"],
  pant: ["pants", "pant", "trousers", "trouser", "jumpsuit"],
  trousers: ["pants", "pant", "trousers", "trouser", "jumpsuit"],
  trouser: ["pants", "pant", "trousers", "trouser", "jumpsuit"],
  jumpsuit: ["jumpsuit", "jumpsuits", "pants"],
  jumpsuits: ["jumpsuit", "jumpsuits", "pants"],
  gown: ["gown", "gowns"],
  gowns: ["gown", "gowns"],
  dress: ["dress", "dresses"],
  dresses: ["dress", "dresses"],
  mini: ["mini", "minis"],
  minis: ["mini", "minis"],
  set: ["set", "sets"],
  sets: ["set", "sets"],
  pearl: ["pearl", "pearls"],
  pearls: ["pearl", "pearls"],
  jacket: ["jacket", "jackets", "cape"],
  jackets: ["jacket", "jackets"],
  tweed: ["tweed"],
  silk: ["silk", "silken"],
  silken: ["silk", "silken"],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function productText(product: Product) {
  return normalize(
    [
      product.name,
      product.slug.replace(/-/g, " "),
      product.collection,
      product.collectionLabel,
      product.garmentType ?? "",
      ...(product.colours ?? []),
      ...(product.priceOptions?.map((option) => option.label) ?? []),
      product.sizeNote ?? "",
      product.description,
      product.fabric,
      ...(product.craft ?? []),
    ].join(" "),
  );
}

export function searchProducts(query: string, limit = 24): Product[] {
  const q = normalize(query);
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = shopProducts.map((product) => {
    const text = productText(product);
    const name = normalize(product.name);
    const slug = normalize(product.slug.replace(/-/g, " "));
    const type = normalize(product.garmentType ?? "");
    let score = 0;

    const allTokensHit = tokens.every((token) => {
      const aliases = SYNONYMS[token] ?? [token];
      return aliases.some((alias) => text.includes(alias));
    });

    if (!allTokensHit) return { product, score: 0 };

    for (const token of tokens) {
      const aliases = SYNONYMS[token] ?? [token];
      for (const term of aliases) {
        const weight = term === token ? 1 : 0.4;
        if (name === term) score += 120 * weight;
        else if (name.startsWith(term) || name.includes(` ${term}`)) score += 90 * weight;
        else if (name.includes(term)) score += 70 * weight;
        if (slug.includes(term)) score += 50 * weight;
        if (type === term) score += 55 * weight;
        if (normalize(product.collectionLabel).includes(term)) score += 35 * weight;
        if (product.priceOptions?.some((option) => normalize(option.label).includes(term))) {
          score += 80 * weight;
        }
        if (text.includes(term)) score += 10 * weight;
      }
    }

    return { product, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map((item) => item.product);
}
