"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { collectionGradients, gradientBase } from "@/data/collectionGradients";

type ShaderGradientBackgroundProps = {
  presetId: string;
};

export function ShaderGradientBackground({ presetId }: ShaderGradientBackgroundProps) {
  const preset = collectionGradients[presetId];
  if (!preset) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient control="props" {...gradientBase} {...preset} />
      </ShaderGradientCanvas>
    </div>
  );
}
