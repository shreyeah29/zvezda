import { Bodoni_Moda, Barlow_Condensed } from "next/font/google";

const shopDisplay = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-shop-display",
  weight: ["400", "500", "600"],
});

const shopSans = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-shop-sans",
  weight: ["300", "400", "500"],
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${shopDisplay.variable} ${shopSans.variable} min-h-screen font-[family-name:var(--font-shop-sans)]`}
    >
      {children}
    </div>
  );
}
