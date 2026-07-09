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
};

export function NavLink({ href, label, onClick, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("group relative inline-flex flex-col items-center py-1", className)}
    >
      <motion.span
        className={cn(
          "editorial-spacing text-[9px] transition-colors duration-500 md:text-[10px]",
          isActive ? "text-cream" : "text-cream/55 group-hover:text-cream"
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
