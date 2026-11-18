import type { Metadata } from "next";
import Home from "../page";
import LuigiEgg from "../components/LuigiEgg";

// Easter egg: snjsoluciones.com.ar/luigi muestra la web normal y aparece el nonno Luigi fumando.
// No se indexa en Google.
export const metadata: Metadata = {
  title: "SNJ Soluciones",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.snjsoluciones.com.ar" },
};

export default function LuigiPage() {
  return (
    <>
      <Home />
      <LuigiEgg />
    </>
  );
}
