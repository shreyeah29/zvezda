"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/data/products";

export type CartItem = {
  slug: string;
  quantity: number;
  size: string;
};

type FlyPayload = {
  slug: string;
  image: string;
  from: DOMRect;
};

type CommerceContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (slug: string, quantity?: number, size?: string) => void;
  removeFromCart: (slug: string, size?: string) => void;
  updateCartQuantity: (slug: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => boolean;
  isInWishlist: (slug: string) => boolean;
  flyPayload: FlyPayload | null;
  triggerFlyToCart: (payload: FlyPayload) => void;
  clearFlyPayload: () => void;
  cartPulse: boolean;
  setCartPulse: (value: boolean) => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

const CART_KEY = "zvezda-cart";
const WISHLIST_KEY = "zvezda-wishlist";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function cartKey(item: Pick<CartItem, "slug" | "size">) {
  return `${item.slug}::${item.size}`;
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [flyPayload, setFlyPayload] = useState<FlyPayload | null>(null);
  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => {
    setCart(readStorage<CartItem[]>(CART_KEY, []));
    setWishlist(readStorage<string[]>(WISHLIST_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((slug: string, quantity = 1, size = "M") => {
    setCart((prev) => {
      const key = cartKey({ slug, size });
      const existing = prev.find((item) => cartKey(item) === key);
      if (existing) {
        return prev.map((item) =>
          cartKey(item) === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { slug, quantity, size }];
    });
    setCartPulse(true);
  }, []);

  const removeFromCart = useCallback((slug: string, size = "M") => {
    const key = cartKey({ slug, size });
    setCart((prev) => prev.filter((item) => cartKey(item) !== key));
  }, []);

  const updateCartQuantity = useCallback((slug: string, quantity: number, size = "M") => {
    const key = cartKey({ slug, size });
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => cartKey(item) !== key));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (cartKey(item) === key ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    let added = false;
    setWishlist((prev) => {
      if (prev.includes(slug)) {
        added = false;
        return prev.filter((s) => s !== slug);
      }
      added = true;
      return [...prev, slug];
    });
    return added;
  }, []);

  const isInWishlist = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const triggerFlyToCart = useCallback((payload: FlyPayload) => {
    setFlyPayload(payload);
  }, []);

  const clearFlyPayload = useCallback(() => setFlyPayload(null), []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = getProduct(item.slug);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      flyPayload,
      triggerFlyToCart,
      clearFlyPayload,
      cartPulse,
      setCartPulse,
    }),
    [
      cart,
      wishlist,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      flyPayload,
      triggerFlyToCart,
      clearFlyPayload,
      cartPulse,
    ]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within CommerceProvider");
  return ctx;
}
