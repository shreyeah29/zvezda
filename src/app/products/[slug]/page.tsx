import { ProductClient } from "./ProductClient";
import { sets } from "@/data/sets";
import { shopProducts } from "@/data/shopCatalog";

export function generateStaticParams() {
  return [
    ...sets.map((s) => ({ slug: s.slug })),
    ...shopProducts.map((product) => ({ slug: product.slug })),
  ];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
