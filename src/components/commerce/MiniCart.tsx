"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct, formatPrice } from "@/data/products";
import { getLenisInstance } from "@/lib/lenisInstance";
import "./MiniCart.css";

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

  // Lock page / Lenis while the drawer is open so cart scroll doesn't chain.
  useEffect(() => {
    if (!open) return;

    const lenis = getLenisInstance();
    lenis?.stop();

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }
    body.classList.add("dg-scroll-lock");

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevPaddingRight;
      body.classList.remove("dg-scroll-lock");
      getLenisInstance()?.start();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            data-lenis-prevent
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="mini-cart fixed top-0 right-0 z-[95] flex h-full w-full max-w-md flex-col shadow-2xl"
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            data-lenis-prevent
          >
            <div className="mini-cart__header">
              <p className="mini-cart__title">Cart</p>
              <button type="button" onClick={onClose} className="mini-cart__close">
                Close
              </button>
            </div>

            <div className="mini-cart__body" data-lenis-prevent>
              {cart.length === 0 ? (
                <p className="mini-cart__empty">Your cart is empty.</p>
              ) : (
                <ul className="mini-cart__list">
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
                        className="mini-cart__item"
                      >
                        <div className="mini-cart__thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.hero} alt={product.name} />
                        </div>
                        <div className="mini-cart__details">
                          <p className="mini-cart__name">{product.name}</p>
                          <p className="mini-cart__size">Size {item.size}</p>
                          <div className="mini-cart__row">
                            <div className="mini-cart__qty">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity - 1, item.size)
                                }
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(item.slug, item.quantity + 1, item.size)
                                }
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <p className="mini-cart__price">
                              {formatPrice(product.price * item.quantity, product.currency)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.slug, item.size)}
                            className="mini-cart__remove"
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
              <div className="mini-cart__footer">
                <div className="mini-cart__subtotal-row">
                  <p className="mini-cart__subtotal-label">Subtotal</p>
                  <p className="mini-cart__subtotal-value">{formatPrice(cartSubtotal, "USD")}</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/cart" onClick={onClose} className="mini-cart__checkout">
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
