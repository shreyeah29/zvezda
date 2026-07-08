"use client";

import dynamic from "next/dynamic";

const GridMotionReveal = dynamic(
  () =>
    import("@/components/GridMotionReveal/GridMotionReveal").then((mod) => ({
      default: mod.GridMotionReveal,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <p className="editorial-spacing text-[9px] text-cream/35">Loading collection…</p>
      </div>
    ),
  }
);

export function HomeGridMotion() {
  return <GridMotionReveal />;
}
