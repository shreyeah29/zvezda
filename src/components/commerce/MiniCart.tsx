"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct, formatPrice } from "@/data/products";

type MiniCartProps = {
  open: boolean;
  onClose: () => void;
};

export function MiniCart({ open, onClose }: MiniCartProps) {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart } = useCommerce();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-label="Shopping cart"
            className="fixed top-0 right-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-cream/10 bg-ink/95 backdrop-blur-xl"
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-6 md:px-8">
              <p className="editorial-spacing text-[10px] text-cream">Cart</p>
              <button
                type="button"
                onClick={onClose}
                className="editorial-spacing text-[9px] text-cream/45 transition-colors hover:text-cream"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
              {cart.length === 0 ? (
                <p className="font-display text-2xl font-light text-cream/40">Your cart is empty.</p>
              ) : (
                <ul className="space-y-6">
                  {cart.map((item) => {
                    const product = getProduct(item.slug);
                    if (!product) return null;
                    const key = `${item.slug}-${item.size}`;
                    return (
                      <motion.li
                        key={key}
                        layout
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16, scale: 0.96 }}
                        className="flex gap-4"
                      >
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-cream/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.hero}
                            alt={product.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base text-cream">{product.name}</p>
                          <p className="editorial-spacing mt-1 text-[8px] text-cream/40">
                            Size {item.size}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center border border-cream/15">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity - 1, item.size)
                                }
                                className="px-2.5 py-1.5 text-cream/50 hover:text-cream"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="editorial-spacing min-w-[1.75rem] text-center text-[9px] text-cream">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity + 1, item.size)
                                }
                                className="px-2.5 py-1.5 text-cream/50 hover:text-cream"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm text-cream/75">
                              {formatPrice(product.price * item.quantity, product.currency)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.slug, item.size)}
                            className="editorial-spacing mt-2 text-[8px] text-cream/35 transition-colors hover:text-cream"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-cream/10 px-6 py-6 md:px-8">
                <div className="mb-5 flex items-end justify-between">
                  <p className="editorial-spacing text-[9px] text-cream/45">Subtotal</p>
                  <p className="font-display text-xl text-cream">
                    {formatPrice(cartSubtotal, "USD")}
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="editorial-spacing block w-full bg-cream py-4 text-center text-[9px] text-ink transition-shadow hover:shadow-[0_0_40px_rgba(196,165,116,0.25)]"
                  >
                    Checkout
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
