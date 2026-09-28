import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Instrument_Serif, Inter, Italiana, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CommerceProvider } from "@/context/CommerceContext";
import { Navigation } from "@/components/layout/Navigation";
import { VideoAutoplayBoot } from "@/components/media/VideoAutoplayBoot";
import { atelierContact, atelierStudio } from "@/data/atelier";
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_TAGLINE, SITE_URL } from "@/lib/site";
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

const italiana = Italiana({
  subsets: ["latin"],
  variable: "--font-section",
  weight: "400",
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
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Zvezda",
    "Zvezda Atelier",
    "Zvezda Hyderabad",
    "luxury fashion Hyderabad",
    "couture Hyderabad",
    "Bindu Reddy",
  ],
  authors: [{ name: "Bindu Reddy" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE, alt: "Zvezda Atelier" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["Zvezda", "ZVEZDA"],
      url: SITE_URL,
      email: atelierContact.careEmail,
      telephone: `+91${atelierContact.phone}`,
      sameAs: [atelierContact.instagramUrl],
      address: {
        "@type": "PostalAddress",
        streetAddress: `${atelierStudio.line1}, ${atelierStudio.line2}`,
        addressLocality: atelierStudio.city,
        addressRegion: "Telangana",
        postalCode: "500033",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: "Zvezda",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ClothingStore",
      "@id": `${SITE_URL}/#store`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}${SITE_OG_IMAGE}`,
      telephone: `+91${atelierContact.phone}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${atelierStudio.line1}, ${atelierStudio.line2}`,
        addressLocality: atelierStudio.city,
        addressRegion: "Telangana",
        postalCode: "500033",
        addressCountry: "IN",
      },
    },
  ],
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
      className={`${display.variable} ${body.variable} ${kinetic.variable} ${editorial.variable} ${product.variable} ${italiana.variable} ${bright.variable} ${against.variable} ${tempting.variable} ${modernRomance.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          as="video"
          href="/assets/videos/products/desktop/set-12/RedDressSolo.mp4"
          type="video/mp4"
        />
      </head>
      <body className="relative h-full min-h-screen bg-ink text-cream antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
