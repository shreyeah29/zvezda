import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Instrument_Serif, Inter, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CommerceProvider } from "@/context/CommerceContext";
import { Navigation } from "@/components/layout/Navigation";
import { VideoAutoplayBoot } from "@/components/media/VideoAutoplayBoot";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
});

const body = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const kinetic = Inter({
  subsets: ["latin"],
  variable: "--font-kinetic",
  weight: ["400", "500", "600"],
});

const editorial = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: "400",
  style: ["normal", "italic"],
});

const product = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-product",
  weight: ["400", "500"],
});

const bright = localFont({
  src: "../../public/fonts/Bright.otf",
  variable: "--font-bright",
  display: "swap",
});

const against = localFont({
  src: "../../public/fonts/AgainstRegular.otf",
  variable: "--font-against",
  display: "swap",
});

const tempting = localFont({
  src: "../../public/fonts/Tempting.otf",
  variable: "--font-tempting",
  display: "swap",
});

const modernRomance = localFont({
  src: "../../public/fonts/ModernRomance.otf",
  variable: "--font-modern-romance",
  display: "swap",
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
      className={`${display.variable} ${body.variable} ${kinetic.variable} ${editorial.variable} ${product.variable} ${bright.variable} ${against.variable} ${tempting.variable} ${modernRomance.variable} h-full`}
    >
      <body className="relative h-full min-h-screen bg-ink text-cream antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="viewport-fixed pointer-events-none -z-50 bg-ink" aria-hidden="true" />
        <CommerceProvider>
          <MotionProvider>
            <VideoAutoplayBoot />
            <Navigation />
            {children}
          </MotionProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}
