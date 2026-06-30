import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { company, siteUrl } from "@/lib/company";
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

const siteName = company.tradeName;
const businessDescription =
  "Descubre Cusco con Spirit Qosqo Travel. City Tour, Machu Picchu, Valle Sagrado, Montaña de Colores, Laguna Humantay y experiencias premium con guías profesionales.";

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
    "Montaña de Colores",
    "Laguna Humantay",
    "City Tour Cusco",
    "tours privados Cusco",
    "agencia turismo Cusco"
  ],
  authors: [{ name: company.tradeName }],
  creator: company.tradeName,
  publisher: company.legalName,
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
  name: company.tradeName,
  legalName: company.legalName,
  alternateName: company.tradeName,
  taxID: company.ruc,
  description: businessDescription,
  url: siteUrl,
  logo: `${siteUrl}/logo-spirit-qosqo.png`,
  image: `${siteUrl}/og-image`,
  telephone: company.phone,
  email: company.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: company.city,
    streetAddress: company.contactAddress,
    addressCountry: company.country
  },
  geo: {
    "@type": "GeoCoordinates",
    address: company.contactAddress
  },
  areaServed: ["Cusco", "Machu Picchu", "Valle Sagrado", "Montaña de Colores", "Laguna Humantay"],
  openingHours: "Mo-Su 08:00-20:00",
  priceRange: "$$",
  sameAs: [company.facebook, company.instagram, `https://wa.me/${company.whatsappNumber}`]
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
    "City Tour Clásico + Templo de la Luna + Zona X",
    "Valle Sagrado",
    "Montaña de Colores",
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
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
