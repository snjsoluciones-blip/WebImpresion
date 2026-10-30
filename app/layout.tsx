import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.snjsoluciones.com.ar/#negocio",
  name: "SNJ Soluciones",
  description:
    "Impresión y modelado 3D bajo demanda: subís tu archivo STL o 3MF (o lo modelamos desde tu idea) y lo imprimimos en PLA, PETG, ABS o TPU, con envíos a todo el país.",
  url: "https://www.snjsoluciones.com.ar",
  telephone: "+5491161256413",
  email: "snjsoluciones@gmail.com",
  image: "https://www.snjsoluciones.com.ar/icon.png",
  logo: "https://www.snjsoluciones.com.ar/icon.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "General Pacheco",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.4522,
    longitude: -58.6469,
  },
  areaServed: ["Pacheco", "Tigre", "Zona Norte GBA", "Buenos Aires", "CABA", "Argentina"],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Impresión 3D de archivos STL y 3MF" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Modelado 3D a medida" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Soportes y estuches para automovilismo" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trofeos personalizados" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Llaveros personalizados con logo" } },
    ],
  },
  knowsAbout: [
    "Impresión de modelos 3D",
    "Modelado 3D",
    "Impresión 3D bajo demanda",
    "Impresión 3D",
    "Prototipado rápido",
    "PLA",
    "PETG",
    "ABS",
    "TPU",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.snjsoluciones.com.ar"),
  title: "Impresión de Modelos 3D en Argentina | SNJ Soluciones",
  description: "Subí tu archivo STL o 3MF, o pedinos que lo modelemos, y lo imprimimos en PLA, PETG, ABS o TPU. Impresión y modelado 3D bajo demanda con envíos a todo el país, desde General Pacheco, Buenos Aires. Presupuesto rápido por WhatsApp.",
  keywords: "impresión de modelos 3D, modelado 3D, diseño 3D a medida, imprimir modelo 3D, impresión 3D bajo demanda, subir archivo STL para imprimir, impresión 3D Argentina, impresión 3D Buenos Aires, impresión 3D Pacheco, impresión 3D Tigre, impresión 3D zona norte, servicio de impresión 3D, repuestos 3D, PLA, PETG, ABS, TPU",
  authors: [{ name: "SNJ Soluciones" }],
  creator: "SNJ Soluciones",
  openGraph: {
    title: "Impresión de Modelos 3D en Argentina | SNJ Soluciones",
    description: "Imprimimos tu archivo STL o 3MF, o lo modelamos desde tu idea, en PLA, PETG, ABS o TPU. Envíos a todo el país. Presupuesto rápido por WhatsApp.",
    url: "https://www.snjsoluciones.com.ar",
    siteName: "SNJ Soluciones",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SNJ Soluciones — Impresión de Modelos 3D en Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Impresión de Modelos 3D en Argentina | SNJ Soluciones",
    description: "Imprimimos tu archivo STL o 3MF, o lo modelamos desde tu idea, en PLA, PETG, ABS o TPU. Envíos a todo el país. Presupuesto rápido por WhatsApp.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.snjsoluciones.com.ar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${inter.variable} ${display.variable} ${mono.variable} scroll-pt-[88px]`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="geo.region" content="AR" />
        <meta name="geo.placename" content="Pacheco, Buenos Aires, Argentina" />
        <meta name="language" content="Spanish" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}