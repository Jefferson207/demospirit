import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const siteUrl = "https://spiritqosqotravel.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Spirit Qosqo Travel | Agencia de Viajes en Cusco",
  description:
    "Descubre Cusco con Spirit Qosqo Travel. City Tour, Machu Picchu, Valle Sagrado, Montana de Colores y mucho mas. Reserva tu aventura con nosotros.",
  keywords: [
    "agencia de viajes en Cusco",
    "Spirit Qosqo Travel",
    "tours en Cusco",
    "Machu Picchu full day",
    "Valle Sagrado",
    "Montana de Colores",
    "Laguna Humantay"
  ],
  authors: [{ name: "Spirit Qosqo Travel" }],
  creator: "Spirit Qosqo Travel",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Spirit Qosqo Travel | Agencia de Viajes en Cusco",
    description:
      "City Tour, Machu Picchu, Valle Sagrado, Montana de Colores y experiencias privadas en Cusco.",
    url: siteUrl,
    siteName: "Spirit Qosqo Travel",
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
    description:
      "Descubre Cusco con tours premium, guias profesionales y asistencia permanente.",
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

const schema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Spirit Qosqo Travel",
  description:
    "Agencia de viajes en Cusco especializada en City Tour, Machu Picchu, Valle Sagrado, Montana de Colores y experiencias familiares.",
  url: siteUrl,
  telephone: "+51982214529",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cusco",
    streetAddress: "Urb. Kennedy A, Calle Los Brillantes B-41",
    addressCountry: "PE"
  },
  areaServed: ["Cusco", "Machu Picchu", "Valle Sagrado", "Montana de Colores", "Laguna Humantay"],
  priceRange: "$$",
  sameAs: ["https://wa.me/51982214529"]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
