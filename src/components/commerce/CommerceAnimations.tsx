"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useCommerce } from "@/context/CommerceContext";

const CONFETTI_COLORS = ["#c4a574", "#f5f0e8", "#8b1a2b", "#e8dcc8", "#ffffff"];

function ConfettiBurst({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    angle: (i / 18) * 360 + Math.random() * 18,
    distance: 14 + Math.random() * 22,
    size: 3 + Math.random() * 4,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotate: Math.random() * 180,
  }));

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {active &&
        particles.map((particle) => {
          const rad = (particle.angle * Math.PI) / 180;
          const x = Math.cos(rad) * particle.distance;
          const y = Math.sin(rad) * particle.distance;

          return (
            <motion.span
              key={particle.id}
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-[1px]"
              style={{
                width: particle.size,
                height: particle.size * 1.4,
                backgroundColor: particle.color,
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
              }}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0, 1.1, 0.6],
                x: [0, x, x * 1.15],
                y: [0, y, y + 16],
                rotate: [0, particle.rotate, particle.rotate + 90],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
    </AnimatePresence>
  );
}

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
    document.body,
  );
}

type WishlistButtonProps = {
  slug: string;
  className?: string;
  size?: "sm" | "md";
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 20.5s-7.2-4.74-9.6-8.64C.62 8.74 2.24 5.5 5.7 5.5c1.92 0 3.18 1.02 4.3 2.34C11.12 6.52 12.38 5.5 14.3 5.5c3.46 0 5.08 3.24 3.3 6.36C19.2 15.76 12 20.5 12 20.5z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistButton({ slug, className = "", size = "md" }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useCommerce();
  const active = isInWishlist(slug);
  const [burst, setBurst] = useState(false);
  const dim = size === "sm" ? 34 : 42;

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
            ? {
                scale: [1, 1.42, 1],
                filter: [
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 16px rgba(196,165,116,0.95))",
                  "drop-shadow(0 0 0px transparent)",
                ],
              }
            : { scale: 1 }
        }
        transition={{ type: "spring", stiffness: 560, damping: 16 }}
        className="relative z-10"
      >
        <motion.span
          animate={{ color: active ? "#c4a574" : "rgba(245,240,232,0.55)" }}
          transition={{ duration: 0.35 }}
        >
          <HeartIcon filled={active} />
        </motion.span>
      </motion.span>
      <ConfettiBurst active={burst} onComplete={() => setBurst(false)} />
    </button>
  );
}

export function WishlistNavButton({
  href,
  className = "",
}: {
  href: string;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [burst, setBurst] = useState(false);

  return (
    <Link
      href={href}
      onClick={() => setBurst(true)}
      className={`group relative inline-flex flex-col items-center py-1 ${className}`}
      aria-label="Wishlist"
    >
      <motion.span
        className={`relative z-10 transition-colors duration-500 ${isActive ? "text-cream" : "text-cream/55 group-hover:text-cream"}`}
        whileHover={{ y: -2, scale: 1.06 }}
        animate={burst ? { scale: [1, 1.28, 1] } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 18 }}
      >
        <HeartIcon filled={false} />
      </motion.span>
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold/90"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0.6 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <ConfettiBurst active={burst} onComplete={() => setBurst(false)} />
    </Link>
  );
}
