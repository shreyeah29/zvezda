import { CollectionClient } from "./CollectionClient";
import { collections } from "@/data/collections";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CollectionClient slug={slug} />;
}
