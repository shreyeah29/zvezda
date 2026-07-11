"use client";

import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct, formatPrice } from "@/data/products";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

function RollingNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="inline-block min-w-[1.5rem] text-center"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export function CartPage() {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart } = useCommerce();

  return (
    <SmoothScroll>
      <main id="main-content" className="min-h-screen bg-ink pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <header className="mb-16 border-b border-cream/10 pb-12 md:mb-20">
            <p className="editorial-spacing text-[10px] text-gold/90">Atelier</p>
            <h1 className="font-display mt-4 text-5xl font-light text-cream md:text-7xl">
              Your Selection
            </h1>
          </header>

          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-3xl font-light text-cream/35">Your cart is empty.</p>
              <Link
                href="/shop"
                className="editorial-spacing mt-10 inline-block border border-cream/20 px-8 py-4 text-[9px] text-cream/70 hover:border-gold hover:text-cream"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <LayoutGroup>
                <ul className="space-y-8">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => {
                      const product = getProduct(item.slug);
                      if (!product) return null;
                      const key = `${item.slug}-${item.size}`;
                      return (
                        <motion.li
                          key={key}
                          layout
                          initial={{ opacity: 0, x: -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 48, height: 0, marginBottom: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="flex flex-col gap-6 border-b border-cream/10 pb-8 sm:flex-row sm:items-center"
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            className="h-36 w-28 shrink-0 overflow-hidden rounded-xl border border-cream/10"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.hero}
                              alt={product.name}
                              className="h-full w-full object-cover object-top"
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link href={`/products/${product.slug}`}>
                              <p className="font-display text-2xl text-cream">{product.name}</p>
                            </Link>
                            <p className="editorial-spacing mt-2 text-[9px] text-cream/40">
                              Size {item.size}
                            </p>
                            <p className="mt-3 text-sm text-cream/60">
                              {formatPrice(product.price, product.currency)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="inline-flex items-center border border-cream/15">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity - 1, item.size)
                                }
                                className="px-3 py-2 text-cream/50 hover:text-cream"
                                aria-label="Decrease"
                              >
                                −
                              </motion.button>
                              <span className="editorial-spacing flex min-w-[2.5rem] items-center justify-center text-[10px] text-cream">
                                <RollingNumber value={item.quantity} />
                              </span>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity + 1, item.size)
                                }
                                className="px-3 py-2 text-cream/50 hover:text-cream"
                                aria-label="Increase"
                              >
                                +
                              </motion.button>
                            </div>
                            <p className="min-w-[5rem] text-right font-display text-lg text-cream">
                              {formatPrice(product.price * item.quantity, product.currency)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.slug, item.size)}
                              className="editorial-spacing text-[8px] text-cream/35 hover:text-cream"
                            >
                              Remove
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </LayoutGroup>

              <motion.div
                layout
                className="mt-16 flex flex-col items-end gap-6 border-t border-cream/10 pt-10"
              >
                <div className="flex w-full max-w-xs items-end justify-between">
                  <p className="editorial-spacing text-[10px] text-cream/45">Subtotal</p>
                  <motion.p
                    key={cartSubtotal}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-3xl text-cream"
                  >
                    {formatPrice(cartSubtotal, "USD")}
                  </motion.p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 48px rgba(196,165,116,0.28)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="editorial-spacing w-full max-w-xs bg-cream py-5 text-[10px] text-ink sm:w-auto sm:px-16"
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
