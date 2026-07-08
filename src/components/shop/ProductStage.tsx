"use client";

import type { MutableRefObject, RefObject } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { StageArrows } from "./StageArrows";

type ProductStageProps = {
  products: Product[];
  stageRef: RefObject<HTMLDivElement | null>;
  cardRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  dragMovedRef: MutableRefObject<boolean>;
  centerIndex: number;
  selectedIndex: number;
  onProductSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ProductStage({
  products,
  stageRef,
  cardRefs,
  dragMovedRef,
  centerIndex,
  selectedIndex,
  onProductSelect,
  onPrev,
  onNext,
}: ProductStageProps) {
  const handleSelect = (index: number) => {
    if (dragMovedRef.current) return;
    onProductSelect(index);
  };

  return (
    <div
      ref={stageRef}
      className="relative flex-1 touch-none select-none overflow-hidden"
      style={{ minHeight: "clamp(340px, 48vh, 520px)" }}
    >
      <StageArrows
        onPrev={onPrev}
        onNext={onNext}
        canPrev={centerIndex > 0}
        canNext={centerIndex < products.length - 1}
      />

      <div className="relative h-full w-full">
        {products.map((product, i) => (
          <ProductCard
            key={product.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            product={product}
            index={i}
            isSelected={i === selectedIndex}
            isCenter={i === centerIndex}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
