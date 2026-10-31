import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, getServicio } from "../../servicios/data";
import { GUIAS, getGuia } from "../data";
import { PageShell, glass } from "../shell";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) return {};
  const url = `${SITE}/guias/${g.slug}`;
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: url },
    openGraph: {
      title: g.title,
      description: g.description,
      url,
      siteName: "SNJ Soluciones",
      locale: "es_AR",
      type: "article",
      publishedTime: g.fecha,
      images: [{ url: g.imagen.src, alt: g.imagen.alt }],
    },
    twitter: { card: "summary_large_image", title: g.title, description: g.description, images: [g.imagen.src] },
  };
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) notFound();

  const url = `${SITE}/guias/${g.slug}`;
  const servicios = g.servicios.map((s) => getServicio(s)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const otras = GUIAS.filter((x) => x.slug !== g.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.h1,
        description: g.description,
        url,
        mainEntityOfPage: url,
        datePublished: g.fecha,
        dateModified: g.fecha,
        inLanguage: "es-AR",
        image: `${SITE}${g.imagen.src}`,
        author: { "@id": `${SITE}/#negocio` },
        publisher: { "@id": `${SITE}/#negocio` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE}/guias` },
          { "@type": "ListItem", position: 3, name: g.nombre, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <main className="shell" style={{ paddingBlock: "clamp(2rem, 1rem + 4vw, 5rem)" }}>
        <nav aria-label="Ruta" className="mx-auto mb-6 max-w-3xl text-sm" style={{ color: "var(--tx-4)" }}>
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/guias" className="hover:text-white">
            Guías
          </Link>
          <span aria-hidden="true"> / </span>
          <span style={{ color: "var(--tx-2)" }}>{g.nombre}</span>
        </nav>

        <article className="mx-auto max-w-3xl">
          <h1 className="t-display" style={{ fontSize: "clamp(2rem, 1.1rem + 3.6vw, 3.75rem)" }}>
            {g.h1}
          </h1>
          <p className="t-lead mt-6">{g.lead}</p>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[var(--r-lg)]" style={glass}>
            <Image
              src={g.imagen.src}
              alt={g.imagen.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              quality={75}
              className="object-cover"
            />
          </div>

          {g.secciones.map((s) => (
            <section key={s.h2} className="mt-12">
              <h2 className="t-h3 m-0 text-white">{s.h2}</h2>
              {s.p?.map((p) => (
                <p key={p} className="t-body mt-3">
                  {p}
                </p>
              ))}
              {s.ul && (
                <ul className="t-body mt-3 list-disc space-y-2 pl-6">
                  {s.ul.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <aside className="mt-14 rounded-[var(--r-lg)] p-6 md:p-8" style={glass}>
            <h2 className="t-h3 m-0 text-white">¿Querés que lo hagamos nosotros?</h2>
            <p className="t-body mt-3">
              Imprimimos y modelamos piezas a medida desde General Pacheco, con envíos a todo el país. Mandanos tu
              archivo o tu idea y te pasamos el presupuesto.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#contacto" className="snj-btn snj-btn--primary snj-btn--md">
                Pedir presupuesto
              </Link>
              <a
                href="https://wa.me/541161256413"
                target="_blank"
                rel="noopener noreferrer"
                className="snj-btn snj-btn--outline snj-btn--md"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </aside>
        </article>

        <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="serv-title">
          <h2 id="serv-title" className="t-h3 m-0 text-white">
            Servicios relacionados
          </h2>
          <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
            {servicios.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicios/${s.slug}`}
                  className="block rounded-[var(--r-md)] p-5 text-white transition-transform duration-300 hover:-translate-y-1"
                  style={glass}
                >
                  {s.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="mas-title">
          <h2 id="mas-title" className="t-h3 m-0 text-white">
            Más guías
          </h2>
          <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
            {otras.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/guias/${o.slug}`}
                  className="block rounded-[var(--r-md)] p-5 text-white transition-transform duration-300 hover:-translate-y-1"
                  style={glass}
                >
                  {o.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
