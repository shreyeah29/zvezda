import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Serif, Inter, Playfair_Display } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const editorial = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: "400",
  style: ["normal", "italic"],
});

const product = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-product",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zvezda — Where light becomes garment",
  description:
    "An immersive luxury fashion house. Editorial collections, couture craftsmanship, cinematic storytelling.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${editorial.variable} ${product.variable} h-full`}
    >
      <body className="relative h-full min-h-screen bg-ink text-cream antialiased">
        <div className="viewport-fixed pointer-events-none -z-50 bg-ink" aria-hidden="true" />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
