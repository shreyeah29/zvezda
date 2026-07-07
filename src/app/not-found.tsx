import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="editorial-spacing text-[10px] text-muted">404</p>
      <h1 className="font-display mt-6 text-6xl font-light text-cream">Lost in the atelier</h1>
      <Link
        href="/"
        className="editorial-spacing mt-12 text-[10px] text-gold hover:text-cream"
      >
        Return home →
      </Link>
    </div>
  );
}
