"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCommerce } from "@/context/CommerceContext";
import { getProduct } from "@/data/products";
import "./AddToCartButton.css";

type AddToCartButtonProps = {
  slug: string;
  quantity?: number;
  size?: string;
  className?: string;
  label?: string;
};

export function AddToCartButton({
  slug,
  quantity = 1,
  size = "M",
  className = "",
  label = "Add to Bag",
}: AddToCartButtonProps) {
  const { addToCart, triggerFlyToCart } = useCommerce();
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async () => {
    if (state !== "idle") return;
    const product = getProduct(slug);
    if (!product || !buttonRef.current) return;

    setState("loading");
    await new Promise((r) => setTimeout(r, 380));

    const rect = buttonRef.current.getBoundingClientRect();
    triggerFlyToCart({ slug, image: product.hero, from: rect });
    addToCart(slug, quantity, size);

    setState("success");
    await new Promise((r) => setTimeout(r, 520));
    setState("idle");
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      whileHover={state === "idle" ? { scale: 1.01 } : undefined}
      whileTap={state === "idle" ? { scale: 0.96 } : undefined}
      animate={
        state === "loading"
          ? { scale: 0.97 }
          : state === "success"
            ? { scale: 1.02 }
            : { scale: 1 }
      }
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={`add-to-cart-btn relative overflow-hidden bg-cream py-4 text-[10px] font-normal uppercase tracking-[0.06em] text-ink transition-opacity hover:opacity-90 disabled:cursor-wait ${className}`}
    >
      <motion.span
        key={state}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {state === "loading" ? "Adding…" : state === "success" ? "Added" : label}
      </motion.span>
    </motion.button>
  );
}
