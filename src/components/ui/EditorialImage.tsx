"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type EditorialImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  accent?: string;
};

export function EditorialImage({
  src,
  alt,
  className,
  priority = false,
  fill = true,
  sizes = "100vw",
  accent = "#4a5240",
}: EditorialImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn("relative overflow-hidden", className)}
        style={{
          background: `linear-gradient(145deg, #0a0a0a 0%, ${accent}33 50%, #0a0a0a 100%)`,
        }}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="editorial-spacing text-[10px] text-cream/20">Image forthcoming</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        unoptimized
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
