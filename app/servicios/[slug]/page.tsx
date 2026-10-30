import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICIOS, SITE, getServicio } from "../data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getServicio(slug);
  if (!s) return {};
  const url = `${SITE}/servicios/${s.slug}`;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: url },
    openGraph: {
      title: s.title,
      description: s.description,
      url,
      siteName: "SNJ Soluciones",
      locale: "es_AR",
      type: "article",
      images: [{ url: s.imagen.src, alt: s.imagen.alt }],
    },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.imagen.src] },
  };
}

const glass = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
  border: "1px solid rgba(255,255,255,0.16)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.34), 0 24px 60px rgba(0,0,0,0.32)",
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
} as const;

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  const s = getServicio(slug);
  if (!s) notFound();

  const url = `${SITE}/servicios/${s.slug}`;
  const relacionadas = s.relacionadas.map((r) => getServicio(r)).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.h1,
        description: s.description,
        url,
        serviceType: s.nombre,
        provider: { "@id": `${SITE}/#negocio` },
        areaServed: ["Pacheco", "Tigre", "Zona Norte GBA", "CABA", "Argentina"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: s.h1, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: s.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="site-root">
      <header className="shell flex items-center justify-between gap-4 py-5">
        <Link href="/" className="flex items-center" aria-label="SNJ Soluciones, ir al inicio">
          <Image src="/images/snj-logo.png" alt="SNJ Soluciones" width={147} height={69} className="h-9 w-auto" priority />
        </Link>
        <Link
          href="/#contacto"
          className="snj-btn snj-btn--primary snj-btn--sm"
        >
          Cotizar
        </Link>
      </header>

      <main className="shell" style={{ paddingBlock: "clamp(2rem, 1rem + 4vw, 5rem)" }}>
        <nav aria-label="Ruta" className="mb-6 text-sm" style={{ color: "var(--tx-4)" }}>
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
          <span aria-hidden="true"> / </span>
          <span style={{ color: "var(--tx-2)" }}>{s.nombre}</span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="t-display" style={{ fontSize: "clamp(2.25rem, 1.2rem + 4.5vw, 4.5rem)" }}>
              {s.h1}
            </h1>
            <p className="t-lead mt-6">{s.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#contacto" className="snj-btn snj-btn--primary snj-btn--lg">
                Pedir presupuesto
              </Link>
              <a
                href="https://wa.me/541161256413"
                target="_blank"
                rel="noopener noreferrer"
                className="snj-btn snj-btn--outline snj-btn--lg"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-lg)]" style={glass}>
            <Image
              src={s.imagen.src}
              alt={s.imagen.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={75}
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {s.secciones.map((sec) => (
            <section key={sec.h2} className="rounded-[var(--r-lg)] p-6 md:p-8" style={glass}>
              <h2 className="t-h3 m-0 text-white">{sec.h2}</h2>
              {sec.parrafos.map((p) => (
                <p key={p} className="t-body mt-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-20" aria-labelledby="faq-title">
          <h2 id="faq-title" className="t-h3 m-0 text-white">
            Preguntas frecuentes
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {s.faq.map((f) => (
              <div key={f.q} className="rounded-[var(--r-md)] p-5" style={glass}>
                <h3 className="m-0 text-base font-medium text-white">{f.q}</h3>
                <p className="t-body mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="mas-title">
          <h2 id="mas-title" className="t-h3 m-0 text-white">
            También te puede interesar
          </h2>
          <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
            {relacionadas.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/servicios/${r.slug}`}
                  className="block rounded-[var(--r-md)] p-5 text-white transition-transform duration-300 hover:-translate-y-1"
                  style={glass}
                >
                  {r.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="shell py-12 text-sm" style={{ color: "var(--tx-4)" }}>
        <p className="m-0">
          © {new Date().getFullYear()} SNJ Soluciones · Impresión y modelado 3D en General Pacheco, Buenos Aires ·{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            Volver al inicio
          </Link>
        </p>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
