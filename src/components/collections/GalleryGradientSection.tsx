"use client";

import type { ReactNode } from "react";
import { ShaderGradientBackground } from "@/components/collections/ShaderGradientBackground";

type GalleryGradientSectionProps = {
  gradientId: string;
  className?: string;
  children: ReactNode;
};

export function GalleryGradientSection({
  gradientId,
  className = "",
  children,
}: GalleryGradientSectionProps) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      <ShaderGradientBackground presetId={gradientId} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
