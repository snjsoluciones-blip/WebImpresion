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
  "@id": "https://snjsoluciones.com.ar/#negocio",
  name: "SNJ Soluciones",
  description:
    "Servicio de impresión de modelos 3D bajo demanda: subís tu archivo 3D y te lo imprimimos en PLA, PETG, ABS o TPU, con envíos a todo el país.",
  url: "https://snjsoluciones.com.ar",
  telephone: "+5491161256413",
  email: "snjsoluciones@gmail.com",
  image: "https://snjsoluciones.com.ar/icon.png",
  logo: "https://snjsoluciones.com.ar/icon.png",
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
  areaServed: ["Pacheco", "Zona Norte GBA", "Buenos Aires", "CABA", "Argentina"],
  knowsAbout: [
    "Impresión de modelos 3D",
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
  metadataBase: new URL("https://snjsoluciones.com.ar"),
  title: "Impresión de Modelos 3D en Argentina | SNJ Soluciones",
  description: "Subí tu archivo 3D y te lo imprimimos en PLA, PETG, ABS o TPU. Impresión 3D bajo demanda con envíos a todo el país, desde General Pacheco, Buenos Aires. Presupuesto rápido por WhatsApp.",
  keywords: "impresión de modelos 3D, imprimir modelo 3D, impresión 3D bajo demanda, subir archivo STL para imprimir, impresión 3D Argentina, impresión 3D Buenos Aires, impresión 3D Pacheco, impresión 3D Tigre, impresión 3D zona norte, servicio de impresión 3D, repuestos 3D, PLA, PETG, ABS, TPU",
  authors: [{ name: "SNJ Soluciones" }],
  creator: "SNJ Soluciones",
  openGraph: {
    title: "Impresión de Modelos 3D en Argentina | SNJ Soluciones",
    description: "Subí tu archivo 3D y te lo imprimimos en PLA, PETG, ABS o TPU. Envíos a todo el país. Presupuesto rápido por WhatsApp.",
    url: "https://snjsoluciones.com.ar",
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
    description: "Subí tu archivo 3D y te lo imprimimos en PLA, PETG, ABS o TPU. Envíos a todo el país. Presupuesto rápido por WhatsApp.",
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
    canonical: "https://snjsoluciones.com.ar",
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