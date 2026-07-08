"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";

type SharedTransitionContextValue = {
  /** Navigate to product page — Framer layoutId handles the morph */
  navigateToProduct: (product: Product) => void;
  transitioningSlug: string | null;
};

const SharedTransitionContext = createContext<SharedTransitionContextValue | null>(null);

export function SharedTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const transitioningSlug = useMemo(() => null, []);

  const navigateToProduct = useCallback(
    (product: Product) => {
      router.push(`/products/${product.slug}`);
    },
    [router]
  );

  const value = useMemo(
    () => ({ navigateToProduct, transitioningSlug }),
    [navigateToProduct, transitioningSlug]
  );

  return (
    <SharedTransitionContext.Provider value={value}>
      {children}
    </SharedTransitionContext.Provider>
  );
}

export function useSharedTransition() {
  const ctx = useContext(SharedTransitionContext);
  if (!ctx) throw new Error("useSharedTransition must be used within SharedTransitionProvider");
  return ctx;
}
