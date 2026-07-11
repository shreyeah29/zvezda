import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "hero" | "nav" | "footer";
  tone?: "light" | "dark";
  className?: string;
  asLink?: boolean;
};

function LogoStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("fill-current", className)}
    >
      <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
    </svg>
  );
}

function LogoMark({ variant, tone = "dark" }: { variant: "hero" | "nav" | "footer"; tone?: "light" | "dark" }) {
  const isHero = variant === "hero";
  const isFooter = variant === "footer";
  const textClass = tone === "light" ? "text-white" : "text-cream";
  const subClass = tone === "light" ? "text-white/85" : "text-cream/85";

  return (
    <div
      className={cn(
        "flex flex-col items-center",
        textClass,
        isHero && "gap-3 md:gap-4",
        !isHero && "gap-1"
      )}
    >
      <div
        className={cn(
          "font-display font-light uppercase leading-none",
          isHero && "text-5xl tracking-[0.28em] md:text-7xl lg:text-8xl",
          variant === "nav" && "text-lg tracking-[0.32em] md:text-xl",
          isFooter && "text-2xl tracking-[0.28em]"
        )}
      >
        <span>ZV</span>
        <span className="relative inline-block">
          <LogoStar
            className={cn(
              "absolute left-1/2 -translate-x-1/2",
              isHero && "top-[-1.1rem] h-3 w-3 md:top-[-1.4rem] md:h-4 md:w-4",
              variant === "nav" && "top-[-0.55rem] h-2 w-2",
              isFooter && "top-[-0.7rem] h-2.5 w-2.5"
            )}
          />
          E
        </span>
        <span>ZDA</span>
      </div>
      <span
        className={cn(
          "editorial-spacing",
          subClass,
          isHero && "text-[10px] md:text-[11px]",
          variant === "nav" && "text-[7px]",
          isFooter && "text-[8px]"
        )}
      >
        Atelier
      </span>
    </div>
  );
}

/** Official Zvezda wordmark — star above the E, Atelier subline */
export function BrandLogo({ variant = "nav", tone = "dark", className, asLink = true }: BrandLogoProps) {
  const content = <LogoMark variant={variant} tone={tone} />;

  if (!asLink) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href="/" className={cn("inline-block transition-opacity hover:opacity-90", className)}>
      {content}
    </Link>
  );
}
