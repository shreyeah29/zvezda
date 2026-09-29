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
  red: ["red", "crimson", "scarlet", "scarlett", "carmine"],
  crimson: ["red", "crimson", "scarlet", "scarlett", "carmine"],
  scarlet: ["red", "crimson", "scarlet", "scarlett", "carmine"],
  scarlett: ["red", "crimson", "scarlet", "scarlett", "carmine"],
  carmine: ["red", "crimson", "scarlet", "scarlett", "carmine"],
};

const PREFIX_MIN = 4;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(value: string) {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function wordMatchesTerm(word: string, term: string) {
  if (word === term || word === `${term}s`) return true;
  if (term.length >= PREFIX_MIN && word.startsWith(term)) return true;
  return false;
}

function textMatchesTerm(text: string, term: string) {
  return words(text).some((word) => wordMatchesTerm(word, term));
}

function aliasesFor(token: string) {
  return SYNONYMS[token] ?? [token];
}

function productText(product: Product) {
  return [
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
  ].join(" ");
}

export function searchProducts(query: string, limit = 24): Product[] {
  const q = normalize(query);
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = shopProducts.map((product) => {
    const text = productText(product);
    const name = product.name;
    const slug = product.slug.replace(/-/g, " ");
    const type = product.garmentType ?? "";
    const colours = product.colours ?? [];
    let score = 0;

    const allTokensHit = tokens.every((token) =>
      aliasesFor(token).some((alias) => textMatchesTerm(text, alias)),
    );

    if (!allTokensHit) return { product, score: 0 };

    for (const token of tokens) {
      const aliases = aliasesFor(token);
      for (const term of aliases) {
        const weight = term === token ? 1 : 0.45;
        if (textMatchesTerm(name, term) && words(name).length === 1 && words(name)[0] === term) {
          score += 120 * weight;
        } else if (textMatchesTerm(name, term)) {
          score += 90 * weight;
        }
        if (textMatchesTerm(slug, term)) score += 50 * weight;
        if (textMatchesTerm(type, term)) score += 55 * weight;
        if (colours.some((colour) => colour === term || wordMatchesTerm(colour, term))) {
          score += 110 * weight;
        }
        if (textMatchesTerm(product.collectionLabel, term)) score += 20 * weight;
        if (product.priceOptions?.some((option) => textMatchesTerm(option.label, term))) {
          score += 80 * weight;
        }
        if (textMatchesTerm(text, term)) score += 8 * weight;
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
