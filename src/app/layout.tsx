import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Serif, Montserrat, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CommerceProvider } from "@/context/CommerceContext";
import { Navigation } from "@/components/layout/Navigation";
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
      className={`${display.variable} ${body.variable} ${editorial.variable} ${product.variable} ${bright.variable} ${against.variable} ${tempting.variable} h-full`}
    >
      <body className="relative h-full min-h-screen bg-ink text-cream antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="viewport-fixed pointer-events-none -z-50 bg-ink" aria-hidden="true" />
        <CommerceProvider>
          <MotionProvider>
            <Navigation />
            {children}
          </MotionProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}
