import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { shopProducts } from "@/data/shopCatalog";
import { sets } from "@/data/sets";
import { SITE_URL } from "@/lib/site";

const staticRoutes = [
  "",
  "/shop",
  "/collections",
  "/about",
  "/contact",
  "/gallery",
  "/custom-order",
  "/faq",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
] as const;

function staticFrequency(path: (typeof staticRoutes)[number]): "weekly" | "monthly" {
  return path === "" ? "weekly" : "monthly";
}

function staticPriority(path: (typeof staticRoutes)[number]) {
  if (path === "") return 1;
  if (path === "/shop" || path === "/collections") return 0.9;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const productSlugs = new Set([...sets.map((set) => set.slug), ...shopProducts.map((product) => product.slug)]);

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: staticFrequency(path),
    priority: staticPriority(path),
  }));

  const house: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${SITE_URL}/collections/${collection.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const products: MetadataRoute.Sitemap = [...productSlugs].map((slug) => ({
    url: `${SITE_URL}/products/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...house, ...products];
}
