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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const productSlugs = new Set([...sets.map((set) => set.slug), ...shopProducts.map((product) => product.slug)]);

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/shop" || path === "/collections" ? 0.9 : 0.6,
    })),
    ...collections.map((collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...[...productSlugs].map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
