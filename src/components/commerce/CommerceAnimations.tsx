"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useCommerce } from "@/context/CommerceContext";

export function FlyToCartLayer() {
  const { flyPayload, clearFlyPayload, setCartPulse } = useCommerce();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!flyPayload) return;
    const timer = setTimeout(() => {
      clearFlyPayload();
      setCartPulse(false);
    }, 720);
    return () => clearTimeout(timer);
  }, [flyPayload, clearFlyPayload, setCartPulse]);

  if (!mounted || !flyPayload) return null;

  const cartEl = document.querySelector("[data-cart-target]");
  const cartRect = cartEl?.getBoundingClientRect();
  const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 48;
  const endY = cartRect ? cartRect.top + cartRect.height / 2 : 32;
  const startX = flyPayload.from.left + flyPayload.from.width / 2;
  const startY = flyPayload.from.top + flyPayload.from.height / 2;

  return createPortal(
    <motion.div
      className="pointer-events-none fixed z-[200] h-14 w-11 overflow-hidden rounded-md border border-cream/20 shadow-2xl"
      initial={{
        left: startX,
        top: startY,
        x: "-50%",
        y: "-50%",
        scale: 1,
        opacity: 1,
      }}
      animate={{
        left: endX,
        top: endY,
        x: "-50%",
        y: "-50%",
        scale: 0.25,
        opacity: 0.15,
      }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flyPayload.image} alt="" className="h-full w-full object-cover object-top" />
    </motion.div>,
    document.body
  );
}

type WishlistButtonProps = {
  slug: string;
  className?: string;
  size?: "sm" | "md";
};

export function WishlistButton({ slug, className = "", size = "md" }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useCommerce();
  const active = isInWishlist(slug);
  const [burst, setBurst] = useState(false);
  const dim = size === "sm" ? 32 : 40;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(slug);
    if (added) setBurst(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: dim, height: dim }}
    >
      <motion.span
        animate={
          burst
            ? { scale: [1, 1.35, 1], filter: ["drop-shadow(0 0 0px transparent)", "drop-shadow(0 0 12px rgba(196,165,116,0.8))", "drop-shadow(0 0 0px transparent)"] }
            : { scale: 1 }
        }
        transition={{ type: "spring", stiffness: 520, damping: 18 }}
        onAnimationComplete={() => setBurst(false)}
        className="relative z-10 text-lg leading-none"
      >
        <motion.span
          animate={{ color: active ? "#c4a574" : "rgba(245,240,232,0.45)" }}
          transition={{ duration: 0.35 }}
        >
          {active ? "♥" : "♡"}
        </motion.span>
      </motion.span>
      <AnimatePresence>
        {burst && (
          <>
            {[0, 45, 90, 135].map((deg) => (
              <motion.span
                key={deg}
                className="absolute h-1 w-1 rounded-full bg-gold"
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((deg * Math.PI) / 180) * 18,
                  y: Math.sin((deg * Math.PI) / 180) * 18,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
}
