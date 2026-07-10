import { Barlow_Condensed, Bodoni_Moda } from "next/font/google";

const shopSans = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-shop-sans",
  weight: ["300", "400", "500"],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600"],
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${shopSans.variable} ${bodoni.variable} min-h-screen font-[family-name:var(--font-shop-sans)]`}
    >
      {children}
    </div>
  );
}
