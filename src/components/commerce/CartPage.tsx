"use client";

import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct, formatPrice } from "@/data/products";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./CartPage.css";

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
      <main id="main-content" className="cart-page">
        <div className="cart-page__inner">
          <header className="cart-page__header">
            <h1 className="cart-page__title">Your Selection</h1>
            <p className="cart-page__subtitle">
              Review your pieces, adjust sizes and quantities, then proceed to checkout.
            </p>
          </header>

          {cart.length === 0 ? (
            <div className="cart-page__empty">
              <p className="cart-page__empty-text">Your cart is empty.</p>
              <Link href="/shop" className="cart-page__shop-link">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <LayoutGroup>
                <ul className="cart-page__list">
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
                          className="cart-page__item"
                        >
                          <Link href={`/products/${product.slug}`} className="cart-page__thumb">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.hero} alt={product.name} />
                          </Link>
                          <div className="cart-page__details">
                            <Link href={`/products/${product.slug}`} className="cart-page__name">
                              {product.name}
                            </Link>
                            <p className="cart-page__size">Size {item.size}</p>
                            <p className="cart-page__unit-price">
                              {formatPrice(product.price, product.currency)} each
                            </p>
                          </div>
                          <div className="cart-page__controls">
                            <div className="cart-page__qty">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity - 1, item.size)
                                }
                                aria-label="Decrease"
                              >
                                −
                              </motion.button>
                              <span>
                                <RollingNumber value={item.quantity} />
                              </span>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity + 1, item.size)
                                }
                                aria-label="Increase"
                              >
                                +
                              </motion.button>
                            </div>
                            <p className="cart-page__line-total">
                              {formatPrice(product.price * item.quantity, product.currency)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.slug, item.size)}
                              className="cart-page__remove"
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

              <motion.div layout className="cart-page__summary">
                <div className="cart-page__subtotal-row">
                  <p className="cart-page__subtotal-label">Subtotal</p>
                  <motion.p
                    key={cartSubtotal}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cart-page__subtotal-value"
                  >
                    {formatPrice(cartSubtotal, "USD")}
                  </motion.p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="cart-page__checkout"
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <JacquemusFooter />
    </SmoothScroll>
  );
}
