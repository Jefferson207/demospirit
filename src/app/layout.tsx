import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap"
});

const siteUrl = "https://spiritqosqotravel.com";
const siteName = "Spirit Qosqo Travel";
const businessDescription =
  "Descubre Cusco con Spirit Qosqo Travel. City Tour, Machu Picchu, Valle Sagrado, Montana de Colores, Laguna Humantay y experiencias premium con guias profesionales.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Spirit Qosqo Travel | Agencia de Viajes en Cusco",
    template: "%s | Spirit Qosqo Travel"
  },
  description: businessDescription,
  keywords: [
    "agencia de viajes en Cusco",
    "Spirit Qosqo Travel",
    "tours en Cusco",
    "Machu Picchu full day",
    "Valle Sagrado",
    "Montana de Colores",
    "Laguna Humantay",
    "City Tour Cusco",
    "tours privados Cusco",
    "agencia turismo Cusco"
  ],
  authors: [{ name: "Spirit Qosqo Travel" }],
  creator: "Spirit Qosqo Travel",
  publisher: "Spirit Qosqo Travel",
  category: "travel",
  classification: "Travel Agency",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-PE": "/"
    }
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
      { url: "/logo-spirit-qosqo.png", sizes: "1024x1024", type: "image/png" }
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/logo-spirit-qosqo.png", sizes: "1024x1024", type: "image/png" }]
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent"
  },
  openGraph: {
    title: "Spirit Qosqo Travel | Agencia de Viajes en Cusco",
    description: businessDescription,
    url: siteUrl,
    siteName,
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Spirit Qosqo Travel en Cusco"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Spirit Qosqo Travel | Agencia de Viajes en Cusco",
    description: businessDescription,
    images: ["/og-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080806",
  colorScheme: "light"
};

const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Spirit Qosqo Travel",
  description: businessDescription,
  url: siteUrl,
  logo: `${siteUrl}/logo-spirit-qosqo.png`,
  image: `${siteUrl}/og-image`,
  telephone: "+51982214529",
  email: "reservas@spiritqosqotravel.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cusco",
    streetAddress: "Urb. Kennedy A, Calle Los Brillantes B-41",
    addressCountry: "PE"
  },
  geo: {
    "@type": "GeoCoordinates",
    address: "Urb. Kennedy A, Calle Los Brillantes B-41, Cusco, Peru"
  },
  areaServed: ["Cusco", "Machu Picchu", "Valle Sagrado", "Montana de Colores", "Laguna Humantay"],
  priceRange: "$$",
  sameAs: ["https://wa.me/51982214529"]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "es-PE",
  potentialAction: {
    "@type": "ReserveAction",
    target: `${siteUrl}/#tours`,
    result: {
      "@type": "Reservation",
      name: "Reserva de tour en Cusco"
    }
  }
};

const tourCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Tours destacados en Cusco",
  itemListElement: [
    "City Tour Clasico + Templo de la Luna + Zona X",
    "Valle Sagrado",
    "Montana de Colores",
    "Laguna Humantay",
    "Machu Picchu Full Day",
    "Maras y Moray",
    "Cuatrimotos"
  ].map((name, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    url: `${siteUrl}/#tours`
  }))
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${dmSerif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([travelAgencySchema, websiteSchema, tourCatalogSchema])
          }}
        />
        {children}
      </body>
    </html>
  );
}
