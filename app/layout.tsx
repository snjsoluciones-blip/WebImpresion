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
    addressLocality: "Pacheco",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
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
  title: "Impresión 3D Industrial y Prototipado | SNJ Soluciones",
  description: "Servicios de impresión 3D industrial, modelado 3D y fabricación de repuestos en Argentina. Soluciones rápidas y precisas para empresas y particulares.",
  keywords: "impresión 3D, impresión 3D industrial, modelado 3D, prototipado rápido, impresión 3D Argentina, impresión 3D Buenos Aires, repuestos 3D, PLA, PETG, ABS",
  authors: [{ name: "SNJ Soluciones" }],
  creator: "SNJ Soluciones",
  openGraph: {
    title: "Impresión 3D Industrial | SNJ Soluciones",
    description: "Impresiones 3D de alta calidad, modelado industrial y prototipado rápido en Argentina.",
    url: "https://snjsoluciones.com.ar",
    siteName: "SNJ Soluciones",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impresión 3D Industrial | SNJ Soluciones",
    description: "Impresiones 3D de alta calidad, modelado industrial y prototipado rápido en Argentina.",
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