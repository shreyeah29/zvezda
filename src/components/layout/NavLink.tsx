"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 420, damping: 28, mass: 0.8 };

type NavLinkProps = {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  tone?: "light" | "dark";
};

export function NavLink({ href, label, onClick, className, tone = "dark" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const textActive = tone === "light" ? "text-white" : "text-cream";
  const textIdle = tone === "light" ? "text-white/75 group-hover:text-white" : "text-cream/70 group-hover:text-cream";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
          "group relative inline-flex min-h-11 min-w-11 flex-col items-center justify-center px-2",
          className,
        )}
    >
      <motion.span
        className={cn(
          "editorial-spacing text-[9px] transition-colors duration-500 md:text-[10px]",
          isActive ? textActive : textIdle
        )}
        style={{ letterSpacing: "0.32em" }}
        whileHover={{ y: -2, letterSpacing: "0.42em" }}
        transition={SPRING}
      >
        {label}
      </motion.span>
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold/90"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0.6 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </Link>
  );
}
