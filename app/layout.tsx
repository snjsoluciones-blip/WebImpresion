import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://snjsoluciones.com.ar/#negocio",
  name: "SNJ Soluciones",
  description:
    "Servicios de impresión 3D industrial, modelado 3D y fabricación de repuestos y prototipos.",
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
  areaServed: ["Pacheco", "Zona Norte GBA", "Buenos Aires", "CABA"],
  knowsAbout: [
    "Impresión 3D",
    "Modelado 3D",
    "Prototipado rápido",
    "PLA",
    "PETG",
    "ABS",
    "TPU",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://snjsoluciones.com.ar"),
  title: "Impresión 3D en Pacheco y Zona Norte | SNJ Soluciones",
  description: "Impresión 3D industrial, modelado y prototipado en General Pacheco, Buenos Aires. Repuestos y piezas técnicas en PLA, PETG, ABS y TPU. Atendemos Tigre, zona norte del GBA y CABA. Presupuesto rápido por WhatsApp.",
  keywords: "impresión 3D Pacheco, impresión 3D General Pacheco, impresión 3D Tigre, impresión 3D zona norte, impresión 3D, impresión 3D industrial, modelado 3D, prototipado rápido, impresión 3D Argentina, impresión 3D Buenos Aires, repuestos 3D, servicio de impresión 3D, PLA, PETG, ABS, TPU",
  authors: [{ name: "SNJ Soluciones" }],
  creator: "SNJ Soluciones",
  openGraph: {
    title: "Impresión 3D en Pacheco y Zona Norte | SNJ Soluciones",
    description: "Impresión 3D industrial, modelado y prototipado en General Pacheco, Buenos Aires. Presupuesto rápido por WhatsApp.",
    url: "https://snjsoluciones.com.ar",
    siteName: "SNJ Soluciones",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SNJ Soluciones — Impresión 3D Industrial en Pacheco, Buenos Aires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Impresión 3D en Pacheco y Zona Norte | SNJ Soluciones",
    description: "Impresión 3D industrial, modelado y prototipado en General Pacheco, Buenos Aires. Presupuesto rápido por WhatsApp.",
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
    <html lang="es-AR">
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