import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "../servicios/data";
import { GUIAS } from "./data";
import { PageShell, glass } from "./shell";

const title = "Guías de impresión y modelado 3D | SNJ Soluciones";
const description =
  "Guías simples sobre impresión 3D: qué material elegir, STL o 3MF, cómo preparar tu archivo, de qué depende el precio y cómo replicar una pieza rota.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/guias` },
  openGraph: { title, description, url: `${SITE}/guias`, siteName: "SNJ Soluciones", locale: "es_AR", type: "website" },
};

export default function GuiasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guías de impresión y modelado 3D",
    url: `${SITE}/guias`,
    hasPart: GUIAS.map((g) => ({ "@type": "Article", headline: g.h1, url: `${SITE}/guias/${g.slug}` })),
  };

  return (
    <PageShell>
      <main className="shell" style={{ paddingBlock: "clamp(2rem, 1rem + 4vw, 5rem)" }}>
        <nav aria-label="Ruta" className="mb-6 text-sm" style={{ color: "var(--tx-4)" }}>
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
          <span aria-hidden="true"> / </span>
          <span style={{ color: "var(--tx-2)" }}>Guías</span>
        </nav>

        <h1 className="t-display" style={{ fontSize: "clamp(2.25rem, 1.2rem + 4.5vw, 4.5rem)" }}>
          Guías de impresión 3D
        </h1>
        <p className="t-lead mt-6">
          Respuestas simples a las preguntas que más nos hacen antes de pedir una pieza.
        </p>

        <ul className="m-0 mt-12 grid list-none gap-5 p-0 md:grid-cols-2">
          {GUIAS.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guias/${g.slug}`}
                className="block h-full rounded-[var(--r-lg)] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8"
                style={glass}
              >
                <h2 className="t-h3 m-0 text-white">{g.nombre}</h2>
                <p className="t-body mt-3">{g.description}</p>
                <span className="mt-4 inline-block text-sm text-white underline underline-offset-4">Leer la guía</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
