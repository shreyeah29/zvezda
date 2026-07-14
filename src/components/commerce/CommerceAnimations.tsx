"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useCommerce } from "@/context/CommerceContext";

const CONFETTI_COLORS = ["#c4a574", "#f5f0e8", "#8b1a2b", "#e8dcc8", "#ffffff"];
const WISHLIST_CONFETTI = ["#e85d8a", "#f4a4b8", "#ff6b9d", "#ffc2d4", "#ffffff", "#c4a574"];
const CART_CONFETTI = ["#0c0a09", "#c4a574", "#f5f0e8", "#8b1a2b", "#e8dcc8", "#ffffff"];

/** Clean symmetrical heart — no lobe bump */
const HEART_PATH =
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

function ConfettiBurst({
  active,
  onComplete,
  colors = CONFETTI_COLORS,
}: {
  active: boolean;
  onComplete: () => void;
  colors?: string[];
}) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    angle: (i / 18) * 360 + Math.random() * 18,
    distance: 14 + Math.random() * 22,
    size: 3 + Math.random() * 4,
    color: colors[i % colors.length],
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

const WISHLIST_FLY_DURATION = 2.15;
const CART_FLY_DURATION = 2.15;

function FlyingBag({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M7.2 7.25h12.1l-1.15 9.1a1.6 1.6 0 0 1-1.58 1.4H9.55a1.6 1.6 0 0 1-1.58-1.35L6.35 4.75H3.75"
        fill="none"
        stroke="#0c0a09"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.2" cy="19.35" r="1.1" fill="#0c0a09" />
      <circle cx="16.55" cy="19.35" r="1.1" fill="#0c0a09" />
    </svg>
  );
}

export function FlyToCartLayer() {
  const { flyPayload, clearFlyPayload, setCartPulse } = useCommerce();
  const [mounted, setMounted] = useState(false);
  const [navBurst, setNavBurst] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!flyPayload) return;
    const timer = setTimeout(() => {
      setNavBurst(true);
    }, CART_FLY_DURATION * 1000 - 120);
    const clearTimer = setTimeout(() => {
      clearFlyPayload();
      setCartPulse(false);
      setNavBurst(false);
    }, CART_FLY_DURATION * 1000 + 700);
    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [flyPayload, clearFlyPayload, setCartPulse]);

  if (!mounted || !flyPayload) return null;

  const cartEl = document.querySelector("[data-cart-target]");
  const cartRect = cartEl?.getBoundingClientRect();
  const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 48;
  const endY = cartRect ? cartRect.top + cartRect.height / 2 : 32;
  const startX = flyPayload.from.left + flyPayload.from.width / 2;
  const startY = flyPayload.from.top + flyPayload.from.height / 2;
  const path = buildWaveFlowPath(startX, startY, endX, endY);

  return createPortal(
    <>
      <motion.div
        className="pointer-events-none fixed z-[200] flex items-center justify-center will-change-transform"
        initial={{
          left: path[0].x,
          top: path[0].y,
          x: "-50%",
          y: "-50%",
          scale: path[0].scale,
          opacity: 0.95,
          rotate: path[0].rotate,
          filter: "drop-shadow(0 6px 16px rgba(12, 10, 9, 0.18))",
        }}
        animate={{
          left: path.map((point) => point.x),
          top: path.map((point) => point.y),
          x: "-50%",
          y: "-50%",
          scale: path.map((point) => point.scale),
          opacity: path.map((_, index) => {
            const t = index / (path.length - 1);
            if (t < 0.88) return 1;
            return 1 - ((t - 0.88) / 0.12) * 0.72;
          }),
          rotate: path.map((point) => point.rotate),
          filter: [
            "drop-shadow(0 6px 16px rgba(12, 10, 9, 0.18))",
            "drop-shadow(0 10px 22px rgba(12, 10, 9, 0.12))",
            "drop-shadow(0 2px 8px rgba(12, 10, 9, 0.05))",
          ],
        }}
        transition={{
          duration: CART_FLY_DURATION,
          ease: "linear",
          times: path.map((_, index) => index / (path.length - 1)),
        }}
      >
        <FlyingBag size={26} />
      </motion.div>
      {navBurst && cartRect && (
        <div
          className="pointer-events-none fixed z-[201] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: cartRect.left + cartRect.width / 2,
            top: cartRect.top + cartRect.height / 2,
          }}
        >
          <ConfettiBurst active colors={CART_CONFETTI} onComplete={() => setNavBurst(false)} />
        </div>
      )}
    </>,
    document.body,
  );
}

function FlyingHeart({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d={HEART_PATH}
        fill="#e85d8a"
        stroke="#f4a4b8"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildWaveFlowPath(startX: number, startY: number, endX: number, endY: number) {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy) || 1;
  const perpX = -dy / distance;
  const perpY = dx / distance;
  const amplitude = Math.min(40, Math.max(20, distance * 0.09));
  const waves = 2.6;
  const steps = 36;

  const points: { x: number; y: number; rotate: number; scale: number }[] = [];

  const sample = (t: number) => {
    const progress = 1 - Math.pow(1 - t, 2.05);
    const envelope = Math.sin(t * Math.PI);
    const ripple =
      Math.sin(t * Math.PI * waves) * amplitude * envelope +
      Math.sin(t * Math.PI * waves * 0.42 + 0.9) * amplitude * 0.32 * envelope;
    const bob = Math.sin(t * Math.PI * 1.6 + 0.35) * 12 * envelope;

    const x = startX + dx * progress + perpX * ripple;
    const y = startY + dy * progress + perpY * ripple * 0.18 + bob;

    return { x, y, envelope, progress };
  };

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const current = sample(t);
    const ahead = sample(Math.min(1, t + 1 / steps));
    const angle = Math.atan2(ahead.y - current.y, ahead.x - current.x);
    const travelAngle = Math.atan2(dy, dx);
    const rotate = ((angle - travelAngle) * 180) / Math.PI;
    const clampedRotate = Math.max(-16, Math.min(16, rotate * 0.7));

    points.push({
      x: current.x,
      y: current.y,
      rotate: clampedRotate,
      scale: 1.04 + current.envelope * 0.05 - t * 0.34,
    });
  }

  return points;
}

export function FlyToWishlistLayer() {
  const { wishlistFlyPayload, clearWishlistFlyPayload, setWishlistPulse } = useCommerce();
  const [mounted, setMounted] = useState(false);
  const [navBurst, setNavBurst] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!wishlistFlyPayload) return;
    const timer = setTimeout(() => {
      setNavBurst(true);
    }, WISHLIST_FLY_DURATION * 1000 - 120);
    const clearTimer = setTimeout(() => {
      clearWishlistFlyPayload();
      setWishlistPulse(false);
      setNavBurst(false);
    }, WISHLIST_FLY_DURATION * 1000 + 700);
    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [wishlistFlyPayload, clearWishlistFlyPayload, setWishlistPulse]);

  if (!mounted || !wishlistFlyPayload) return null;

  const targets = document.querySelectorAll("[data-wishlist-target]");
  const wishlistEl = Array.from(targets).find((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  const wishlistRect = wishlistEl?.getBoundingClientRect();
  const endX = wishlistRect ? wishlistRect.left + wishlistRect.width / 2 : window.innerWidth - 120;
  const endY = wishlistRect ? wishlistRect.top + wishlistRect.height / 2 : 32;
  const startX = wishlistFlyPayload.from.left + wishlistFlyPayload.from.width / 2;
  const startY = wishlistFlyPayload.from.top + wishlistFlyPayload.from.height / 2;
  const path = buildWaveFlowPath(startX, startY, endX, endY);

  return createPortal(
    <>
      <motion.div
        className="pointer-events-none fixed z-[200] flex items-center justify-center will-change-transform"
        initial={{
          left: path[0].x,
          top: path[0].y,
          x: "-50%",
          y: "-50%",
          scale: path[0].scale,
          opacity: 0.95,
          rotate: path[0].rotate,
          filter: "drop-shadow(0 6px 16px rgba(232, 93, 138, 0.2))",
        }}
        animate={{
          left: path.map((point) => point.x),
          top: path.map((point) => point.y),
          x: "-50%",
          y: "-50%",
          scale: path.map((point) => point.scale),
          opacity: path.map((_, index) => {
            const t = index / (path.length - 1);
            if (t < 0.88) return 1;
            return 1 - (t - 0.88) / 0.12 * 0.72;
          }),
          rotate: path.map((point) => point.rotate),
          filter: [
            "drop-shadow(0 6px 16px rgba(232, 93, 138, 0.2))",
            "drop-shadow(0 10px 22px rgba(232, 93, 138, 0.14))",
            "drop-shadow(0 2px 8px rgba(232, 93, 138, 0.06))",
          ],
        }}
        transition={{
          duration: WISHLIST_FLY_DURATION,
          ease: "linear",
          times: path.map((_, index) => index / (path.length - 1)),
        }}
      >
        <FlyingHeart size={26} />
      </motion.div>
      {navBurst && wishlistRect && (
        <div
          className="pointer-events-none fixed z-[201] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: wishlistRect.left + wishlistRect.width / 2,
            top: wishlistRect.top + wishlistRect.height / 2,
          }}
        >
          <ConfettiBurst active colors={WISHLIST_CONFETTI} onComplete={() => setNavBurst(false)} />
        </div>
      )}
    </>,
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
        d={HEART_PATH}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistButton({ slug, className = "", size = "md" }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist, triggerFlyToWishlist } = useCommerce();
  const active = isInWishlist(slug);
  const [burst, setBurst] = useState(false);
  const dim = size === "sm" ? 44 : 44;

  const stopEvent = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopEvent(e);
    const added = toggleWishlist(slug);
    if (added) {
      setBurst(true);
      triggerFlyToWishlist(e.currentTarget.getBoundingClientRect());
    }
  };

  return (
    <button
      type="button"
      onPointerDown={stopEvent}
      onMouseDown={stopEvent}
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
                scale: [1, 1.35, 1],
                filter: [
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 14px rgba(232,93,138,0.95))",
                  "drop-shadow(0 0 0px transparent)",
                ],
              }
            : { scale: 1 }
        }
        transition={{ type: "spring", stiffness: 560, damping: 16 }}
        className="relative z-10"
      >
        <motion.span
          animate={{ color: active ? "#e85d8a" : "rgba(12, 10, 9, 0.55)" }}
          transition={{ duration: 0.35 }}
        >
          <HeartIcon filled={active} />
        </motion.span>
      </motion.span>
      <ConfettiBurst active={burst} colors={WISHLIST_CONFETTI} onComplete={() => setBurst(false)} />
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
  const { wishlistPulse } = useCommerce();
  const isActive = pathname === href;
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (wishlistPulse) setBurst(true);
  }, [wishlistPulse]);

  return (
    <Link
      href={href}
      data-wishlist-target
      onClick={() => setBurst(true)}
      className={`group relative inline-flex flex-col items-center py-1 ${className}`}
      aria-label="Wishlist"
    >
      <motion.span
        className={`relative z-10 transition-colors duration-500 ${isActive ? "text-cream" : "text-cream/55 group-hover:text-cream"}`}
        whileHover={{ y: -2, scale: 1.06 }}
        animate={
          burst || wishlistPulse
            ? {
                scale: [1, 1.32, 1],
                color: ["rgba(245,240,232,0.55)", "#e85d8a", isActive ? "#f5f0e8" : "rgba(245,240,232,0.55)"],
              }
            : { scale: 1 }
        }
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
      <ConfettiBurst
        active={burst}
        colors={WISHLIST_CONFETTI}
        onComplete={() => setBurst(false)}
      />
    </Link>
  );
}
