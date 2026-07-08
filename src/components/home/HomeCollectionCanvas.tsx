"use client";

import dynamic from "next/dynamic";

const CollectionCanvas = dynamic(
  () =>
    import("@/components/CollectionCanvas").then((mod) => ({
      default: mod.CollectionCanvas,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <p className="editorial-spacing text-[9px] text-cream/35">Loading collection explorer…</p>
      </div>
    ),
  }
);

export function HomeCollectionCanvas() {
  return <CollectionCanvas />;
}
