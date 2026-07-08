"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

type SelectionContextValue = {
  /** Product the user intentionally selected (updates details panel) */
  selected: Product;
  selectedIndex: number;
  /** Select after stage animation completes */
  selectProduct: (index: number) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const selectProduct = useCallback((index: number) => {
    setSelectedIndex(Math.max(0, Math.min(products.length - 1, index)));
  }, [products.length]);

  const value = useMemo(
    () => ({
      selected: products[selectedIndex],
      selectedIndex,
      selectProduct,
      isDragging,
      setIsDragging,
    }),
    [products, selectedIndex, selectProduct, isDragging]
  );

  return (
    <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}

/** Ref-based drag flag — avoids re-renders during drag */
export function useDragRef() {
  return useRef(false);
}
