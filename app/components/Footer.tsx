"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  Button,
  ChromeText,
  Hairline,
  LayerLines,
  LayerText,
  MonoLabel,
  WhatsAppIcon,
  useReducedMotionSafe,
} from "./ui";

/**
 * Footer — spec §96-101.
 *
 * §96  Wordmark SNJ SOLUCIONES gigante en cromo estático (tercera y última aparición del cromo),
 *      impreso desde abajo con LayerText. Decorativo (aria-hidden): el nombre accesible vive en
 *      el logo del bloque de marca.
 * §97  Grilla de 12 columnas con hairlines verticales: marca + <address> (mismos datos de siempre),
 *      Navegación, Servicios y Materiales con encabezados MonoLabel.
 * §98  Zona de cobertura (= areaServed del JSON-LD) + último CTA de WhatsApp.
 * §99  Links en reposo a --tx-3 (contraste ≥ 4.5:1) con subrayado que se dibuja en hover/focus.
 * §100 Fondo --srf-2, hairline-glow arriba, legales en mono con año dinámico y "Volver arriba".
 * §101 Franja de materiales impresa en el borde inferior, con máscara lateral en mobile.
 *
 * Todo el contenido real del footer original se conserva: descripción, dirección, WhatsApp
 * (+54 9 11 6125 6413 → wa.me/541161256413), email, links de navegación y ambas líneas legales.
 */

/* ---------------------------------------------------------------------------------------- */
/* Datos                                                                                      */
/* ---------------------------------------------------------------------------------------- */

const WHATSAPP_NUMBER = "541161256413";
// Mismo mensaje que el botón flotante y la MobileActionBar.
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "¡Hola! Vengo de la web de SNJ Soluciones y quiero hacer una consulta."
)}`;
const EMAIL = "snjsoluciones@gmail.com";

type FooterLinkItem = { label: string; href: string };

const NAV_LINKS: FooterLinkItem[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Materiales", href: "#materiales" },
  { label: "Tecnología", href: "#tecnologia" },
  { label: "Proceso", href: "#como-funciona" },
  { label: "Equipo", href: "#equipo" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
];

const SERVICE_LINKS: FooterLinkItem[] = [
  { label: "Modelado + Impresión", href: "#servicios" },
  { label: "Solo Impresión", href: "#servicios" },
  { label: "Series cortas", href: "#contacto" },
  { label: "Repuestos y prototipos", href: "#contacto" },
];

const MATERIAL_LINKS: FooterLinkItem[] = [
  { label: "PLA", href: "#materiales" },
  { label: "PETG", href: "#materiales" },
  { label: "ABS", href: "#materiales" },
  { label: "TPU", href: "#materiales" },
];

// Coincide con el areaServed del JSON-LD de layout.tsx (que no se toca).
const COVERAGE = ["General Pacheco", "Tigre", "Zona Norte GBA", "CABA"];

// §101 — texto decorativo de la franja inferior.
const STRIP_TEXT = ["PLA", "PETG", "ABS", "TPU", "BAMBU LAB P2S", "GENERAL PACHECO"].join(" — ");
const STRIP_MASK = "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)";

/* ---------------------------------------------------------------------------------------- */
/* Piezas locales                                                                             */
/* ---------------------------------------------------------------------------------------- */

function PinIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 14.5S3.5 10.3 3.5 6.7a4.5 4.5 0 0 1 9 0c0 3.6-4.5 7.8-4.5 7.8Z" />
      <circle cx="8" cy="6.7" r="1.6" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7" />
    </svg>
  );
}

type FooterLinkProps = {
  href: string;
  external?: boolean;
  children: ReactNode;
};

/**
 * §99 — link del footer: reposo --tx-3, hover/focus a blanco con un subrayado de 1px que se
 * dibuja de izquierda a derecha (background-size 0% → 100%, 240 ms, --ease-mech).
 * El subrayado va en un <span inline> con box-decoration-break:clone para que, si el label
 * parte en dos líneas, se dibuje bajo cada una. Target táctil ≥ 44px en mobile.
 */
function FooterLink({ href, external = false, children }: FooterLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group block py-3 text-sm leading-5 text-[color:var(--tx-3)] transition-colors duration-[240ms] ease-[var(--ease-mech)] hover:text-white focus-visible:text-white md:py-1.5"
    >
      <span className="inline bg-no-repeat pb-px [background-image:linear-gradient(#fff,#fff)] [background-position:0_100%] [background-size:0%_1px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] transition-[background-size] duration-[240ms] ease-[var(--ease-mech)] group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
        {children}
      </span>
      {external && <span className="sr-only"> (abre en una pestaña nueva)</span>}
    </a>
  );
}

type FooterColumnProps = {
  id: string;
  title: string;
  links: FooterLinkItem[];
  className?: string;
  /** Clase de la <ul> (default: lista vertical). */
  listClassName?: string;
};

/** §97 — columna de links con hairline vertical a la izquierda (solo md+) y encabezado MonoLabel. */
function FooterColumn({ id, title, links, className = "", listClassName = "flex flex-col" }: FooterColumnProps) {
  return (
    <nav aria-labelledby={id} className={`relative ${className}`}>
      <Hairline orientation="v" className="absolute left-0 top-0 hidden md:block" />
      <h2 id={id} className="mb-3 md:mb-4">
        <MonoLabel tone="bright" rule>
          {title}
        </MonoLabel>
      </h2>
      <ul className={listClassName}>
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** §100 — botón circular "Volver arriba" (36px visibles dentro de un área táctil de 44px). */
function BackToTop() {
  const reduced = useReducedMotionSafe();

  const scrollToTop = () => {
    // "instant" y no "auto": con `html { scroll-behavior: smooth }` global, "auto" seguiría animando.
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className="group -mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-full border text-[color:var(--tx-2)] transition-[border-color,background-color,color,transform] duration-[var(--dur-2)] ease-[var(--ease-mech)] [border-color:var(--line-2)] group-hover:-translate-y-0.5 group-hover:bg-white/5 group-hover:text-white group-hover:[border-color:var(--line-3)] group-focus-visible:text-white group-focus-visible:[border-color:var(--line-3)] group-active:translate-y-0 group-active:scale-95"
      >
        <ArrowUpIcon />
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Footer                                                                                     */
/* ---------------------------------------------------------------------------------------- */

export default function Footer() {
  // §100 — el año no envejece. Hoy renderiza "© 2026 …", igual que el texto original.
  const year = new Date().getFullYear();

  return (
    <footer className="relative" style={{ background: "var(--srf-2)" }}>
      {/* §100 — border-t plano → hairline con brillo */}
      <div aria-hidden="true" className="hairline-glow" />

      <div className="shell">
        {/* §96 — wordmark gigante en cromo estático, impreso desde abajo. Decorativo. */}
        <div
          aria-hidden="true"
          className="overflow-hidden pb-5 md:pb-7"
          style={{ paddingTop: "clamp(3rem, 2rem + 4vw, 5.5rem)" }}
        >
          <div
            className="font-display font-bold uppercase select-none"
            style={{
              fontSize: "clamp(2.5rem, 1rem + 9vw, 8rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.85,
            }}
          >
            {/* Dos unidades: apiladas en mobile (no desborda a 375px) y en una sola fila en md+. */}
            <LayerText
              as="div"
              lineClassName="md:inline"
              lines={[
                <ChromeText key="snj">SNJ</ChromeText>,
                <ChromeText key="soluciones" className="md:ml-[0.22em]">
                  SOLUCIONES
                </ChromeText>,
              ]}
            />
          </div>
        </div>
        <Hairline />

        {/* §97 — 4 columnas: marca (4) · navegación (3) · servicios (2) · materiales (2, col 11) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-12 md:gap-x-5 md:gap-y-0 md:py-16 lg:gap-x-8 lg:py-20">
          {/* Marca + <address> + §98 cobertura y CTA */}
          <div className="col-span-2 flex flex-col md:col-span-4 md:pr-6 lg:pr-10">
            <Image
              src="/images/snj-logo.png"
              alt="SNJ Soluciones"
              width={147}
              height={69}
              className="block h-8 w-auto object-contain"
            />
            <p className="t-body mt-5 max-w-xs">
              Impresión 3D de precisión para industria y proyectos personales.
            </p>
            <address className="mt-4 flex flex-col items-start text-sm not-italic text-[color:var(--tx-3)]">
              <span className="block py-3 leading-5 md:py-1.5">General Pacheco, Buenos Aires, Argentina</span>
              <FooterLink href={`https://wa.me/${WHATSAPP_NUMBER}`} external>
                WhatsApp: +54 9 11 6125 6413
              </FooterLink>
              <FooterLink href={`mailto:${EMAIL}`}>{EMAIL}</FooterLink>
            </address>

            {/* §98 — zona de cobertura + último punto de conversión */}
            <div className="mt-8 md:mt-auto md:pt-8">
              <Hairline />
              <div className="mt-5 flex items-start gap-3 text-[color:var(--tx-4)]">
                <span aria-hidden="true" className="mt-px inline-flex shrink-0">
                  <PinIcon />
                </span>
                <ul
                  aria-label="Zona de cobertura"
                  className="font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] uppercase leading-none tracking-[0.14em]"
                >
                  {COVERAGE.map((area, i) => (
                    <li key={area} className="inline-flex items-center gap-x-2">
                      {i > 0 && (
                        <span aria-hidden="true" className="text-[color:var(--tx-5)]">
                          ·
                        </span>
                      )}
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5">
                <Button
                  variant="whatsapp"
                  size="sm"
                  href={WHATSAPP_URL}
                  external
                  icon={<WhatsAppIcon className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Escribinos
                </Button>
              </div>
            </div>
          </div>

          {/* Separadores horizontales solo en mobile (en md+ los reemplazan las hairlines verticales) */}
          <Hairline className="col-span-2 md:hidden" />

          <FooterColumn
            id="footer-nav-title"
            title="Navegación"
            links={NAV_LINKS}
            className="col-span-2 md:col-span-3 md:pl-5 lg:pl-8"
            listClassName="grid grid-cols-2 gap-x-6 md:flex md:flex-col"
          />

          <Hairline className="col-span-2 md:hidden" />

          <FooterColumn
            id="footer-services-title"
            title="Servicios"
            links={SERVICE_LINKS}
            className="col-span-1 md:col-span-2 md:pl-5 lg:pl-8"
          />
          <FooterColumn
            id="footer-materials-title"
            title="Materiales"
            links={MATERIAL_LINKS}
            className="col-span-1 md:col-span-2 md:col-start-11 md:pl-5 lg:pl-8"
          />
        </div>
      </div>

      {/* §100 — barra legal: ambas líneas textuales, mono 11px, año dinámico, volver arriba */}
      <div className="shell">
        <Hairline />
        <div className="flex items-center justify-between gap-6 py-5 md:py-6">
          <div className="font-mono-tech flex flex-col gap-2 text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[color:var(--tx-5)]">
            <p>© {year} SNJ Soluciones. Todos los derechos reservados.</p>
            <p>Impresión 3D &middot; Modelado 3D &middot; Pacheco, Tigre y Zona Norte GBA</p>
          </div>
          <BackToTop />
        </div>
      </div>

      {/* §101 — franja de materiales impresa en el borde inferior, a sangre. Decorativa. */}
      <div aria-hidden="true" className="relative">
        <LayerLines spacing={4} opacity={0.03} />
        <div aria-hidden="true" className="hairline" />
        <div
          className="flex justify-center overflow-hidden py-3.5"
          style={{ WebkitMaskImage: STRIP_MASK, maskImage: STRIP_MASK }}
        >
          <p
            className="font-mono-tech shrink-0 whitespace-nowrap text-[10px] uppercase leading-none tracking-[0.3em]"
            style={{ color: "rgba(255,255,255,0.12)" }}
          >
            {STRIP_TEXT}
          </p>
        </div>
      </div>
    </footer>
  );
}
