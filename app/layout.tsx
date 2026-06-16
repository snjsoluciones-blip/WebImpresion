import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Impresión 3D Industrial y Prototipado | SNJ Soluciones",
  description: "Servicios de impresión 3D industrial, matricería y fabricación de repuestos en Don Torcuato, Buenos Aires. Soluciones rápidas y precisas para empresas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}