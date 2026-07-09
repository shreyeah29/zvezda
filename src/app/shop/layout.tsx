import localFont from "next/font/local";
import { Barlow_Condensed } from "next/font/google";

const bright = localFont({
  src: "../../../public/fonts/Bright.otf",
  variable: "--font-bright",
  display: "swap",
});

const shopSans = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-shop-sans",
  weight: ["300", "400", "500"],
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bright.variable} ${shopSans.variable} min-h-screen font-[family-name:var(--font-shop-sans)]`}
    >
      {children}
    </div>
  );
}
