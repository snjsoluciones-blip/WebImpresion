"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Button,
  DUR,
  EASE,
  Hairline,
  MagneticButton,
  MonoLabel,
  ScrollProgress,
  WhatsAppIcon,
  useActiveSection,
  useMediaQuery,
  useReducedMotionSafe,
} from "./ui";

// Entrada secreta a la app de gestión: 5 toques seguidos en el logo.
// Mantener en sync con BASE de app/taller-cobalto/lib/rutas.ts
const GESTION_PATH = "/taller-cobalto";

const WHATSAPP_URL = "https://wa.me/541161256413";
const EMAIL = "snjsoluciones@gmail.com";

type NavLink = {
  label: string;
  href: string;
  /** id de la sección (sin #), para useActiveSection */
  id: string;
  /** Solo visible desde lg (7 links no entran entre 768 y 1024px) */
  lgOnly?: boolean;
};

// Nav desktop: 6 links. Los href y los ids de sección no cambian.
const navLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios", id: "servicios" },
  { label: "Galería", href: "#galeria", id: "galeria" },
  { label: "Materiales", href: "#materiales", id: "materiales" },
  { label: "Tecnología", href: "#tecnologia", id: "tecnologia", lgOnly: true },
  { label: "Proceso", href: "#como-funciona", id: "como-funciona" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
];

// Menú mobile a pantalla completa: suma FAQ (vive acá y en el footer). Índices 01…07.
const mobileLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios", id: "servicios" },
  { label: "Galería", href: "#galeria", id: "galeria" },
  { label: "Materiales", href: "#materiales", id: "materiales" },
  { label: "Tecnología", href: "#tecnologia", id: "tecnologia" },
  { label: "Proceso", href: "#como-funciona", id: "como-funciona" },
  { label: "FAQ", href: "#faq", id: "faq" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
];

const SECTION_IDS = navLinks.map((l) => l.id);

const SCROLL_THRESHOLD = 40;

// Estado "scrolleado" como store externo: listener de scroll pasivo (el de siempre),
// SSR-safe (false en servidor) y sin setState dentro de efectos.
function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > SCROLL_THRESHOLD;
const getScrolledServer = () => false;

// Overlay del menú: clip-path circular que crece desde el centro del hamburger
// (a ~42px del borde derecho, a media altura del riel de 72px).
const CLIP_FROM = "circle(0vmax at calc(100% - 42px) 36px)";
const CLIP_TO = "circle(150vmax at calc(100% - 42px) 36px)";

// Stagger de los links del menú: 50 ms por item tras el arranque del overlay.
// Tope de 6 elementos (regla global): del 7º en adelante usan el delay del 6º.
// (staggerDelay de ui/motion no sirve acá: sus defaults quedan tipados como literales.)
const menuStaggerDelay = (i: number) => 0.14 + Math.min(i, 5) * 0.05;

const BAR_TRANSITION =
  "transform var(--dur-2) var(--ease-in-out-quart), opacity var(--dur-2) var(--ease-in-out-quart)";

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default function Header() {
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getScrolledServer);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotionSafe();
  const isLg = useMediaQuery("(min-width: 1024px)", false);
  const active = useActiveSection(SECTION_IDS, 80);
  const router = useRouter();
  const taps = useRef<{ count: number; t: number }>({ count: 0, t: 0 });
  const headerRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Menú abierto: bloqueo de scroll del body compensando el ancho de la scrollbar
  // (también en el header fijo, para que el hamburger no salte), Escape para cerrar,
  // y cierre automático si el viewport pasa a md (donde el overlay no existe).
  useEffect(() => {
    if (!menuOpen) return;
    const body = document.body;
    const header = headerRef.current;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const prevHeaderPad = header ? header.style.paddingRight : "";
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (sbw > 0) {
      body.style.paddingRight = `${sbw}px`;
      if (header) header.style.paddingRight = `${sbw}px`;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      if (header) header.style.paddingRight = prevHeaderPad;
    };
  }, [menuOpen]);

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    const now = Date.now();
    const count = now - taps.current.t < 1500 ? taps.current.count + 1 : 1;
    taps.current = { count, t: now };
    if (count >= 5) {
      taps.current = { count: 0, t: 0 };
      router.push(GESTION_PATH);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Click en el "fondo" del overlay (zonas marcadas con data-backdrop) → cierra.
  const onBackdropClick = (e: ReactMouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.dataset.backdrop === "true") {
      closeMenu();
      burgerRef.current?.focus();
    }
  };

  const chromeVisible = scrolled && !menuOpen;

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      style={{ height: "var(--header-h)" }}
    >
      {/* Vidrio oscuro: aparece al scrollear (>40px) y se apaga con el menú abierto */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "rgba(8,8,8,0.72)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          opacity: chromeVisible ? 1 : 0,
          transition: "opacity var(--dur-2) var(--ease-mech)",
        }}
      />
      {/* Hairline inferior en lugar del border-bottom que cortaba en seco */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0"
        style={{ opacity: chromeVisible ? 1 : 0, transition: "opacity var(--dur-2) var(--ease-mech)" }}
      >
        <Hairline />
      </div>

      {/* Riel: siempre por encima del overlay del menú (z-70) para que logo y hamburger sigan visibles */}
      <div className="shell relative z-[80] flex h-full items-center justify-between gap-4">
        <MagneticButton strength={0.2}>
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex select-none items-center rounded-md transition-transform duration-150 active:scale-[0.97]"
          >
            {/* h-9 → h-7 vía scale (sin cambio de layout) al scrollear */}
            <span
              className="block"
              style={{
                transform: scrolled ? "scale(0.78)" : "scale(1)",
                transformOrigin: "0% 50%",
                transition: "transform var(--dur-2) var(--ease-mech)",
              }}
            >
              <Image
                src="/images/snj-logo.png"
                alt="SNJ Soluciones"
                width={147}
                height={69}
                className="block h-9 w-auto object-contain"
                priority
              />
            </span>
          </a>
        </MagneticButton>

        {/* Nav desktop con indicador de sección activa */}
        <nav aria-label="Secciones" className="hidden items-center gap-5 md:flex lg:gap-7">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            const showDot = isActive && (!link.lgOnly || isLg);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative items-center rounded-sm py-1.5 text-sm ${
                  link.lgOnly ? "hidden lg:inline-flex" : "inline-flex"
                } ${isActive ? "text-white" : "text-white/40 hover:text-white"}`}
                style={{ transition: "color var(--dur-1) var(--ease-mech)" }}
              >
                {showDot &&
                  (reduced ? (
                    <span
                      aria-hidden="true"
                      className="absolute -left-3 h-[3px] w-[3px] rounded-full bg-white"
                      style={{ top: "calc(50% - 1.5px)" }}
                    />
                  ) : (
                    <motion.span
                      layoutId="nav-dot"
                      aria-hidden="true"
                      className="absolute -left-3 h-[3px] w-[3px] rounded-full bg-white"
                      style={{ top: "calc(50% - 1.5px)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ))}
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* CTAs desktop: WhatsApp directo (segunda vía) + Cotizar (primario) */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Button
            variant="ghost"
            size="sm"
            href={WHATSAPP_URL}
            external
            aria-label="Escribinos por WhatsApp"
            className="w-11"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </Button>
          <Button variant="primary" size="sm" href="#contacto" icon={<ArrowRight />} iconPosition="right">
            Cotizar
          </Button>
        </div>

        {/* Hamburger: 44×44 real, label en español, controla el overlay */}
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
        >
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className="absolute left-0 top-1/2 block h-[1.5px] w-6 rounded-full bg-white"
              style={{
                transform: menuOpen ? "translateY(-50%) rotate(45deg)" : "translateY(calc(-50% - 6px))",
                transition: BAR_TRANSITION,
              }}
            />
            <span
              className="absolute left-0 top-1/2 block h-[1.5px] w-6 rounded-full bg-white"
              style={{
                transform: menuOpen ? "translateY(-50%) scaleX(0)" : "translateY(-50%) scaleX(1)",
                opacity: menuOpen ? 0 : 1,
                transition: BAR_TRANSITION,
              }}
            />
            <span
              className="absolute left-0 top-1/2 block h-[1.5px] w-6 rounded-full bg-white"
              style={{
                transform: menuOpen ? "translateY(-50%) rotate(-45deg)" : "translateY(calc(-50% + 6px))",
                transition: BAR_TRANSITION,
              }}
            />
          </span>
        </button>
      </div>

      {/* Barra de progreso de lectura: único elemento del chrome que se mueve con el scroll */}
      <ScrollProgress />

      {/* Menú mobile a pantalla completa */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="menu-mobile"
            id="menu-mobile"
            aria-label="Menú principal"
            data-backdrop="true"
            onClick={onBackdropClick}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain md:hidden"
            style={{
              background: "rgba(8,8,8,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            initial={reduced ? { opacity: 0 } : { clipPath: CLIP_FROM, opacity: 1 }}
            animate={reduced ? { opacity: 1 } : { clipPath: CLIP_TO, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reduced
                ? { duration: DUR.d1 }
                : {
                    clipPath: { duration: 0.48, ease: EASE.quart },
                    opacity: { duration: DUR.d2, ease: EASE.mech },
                  }
            }
          >
            <div
              data-backdrop="true"
              className="shell flex min-h-full flex-col"
              style={{
                paddingTop: "calc(var(--header-h) + 0.75rem)",
                paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
              }}
            >
              <MonoLabel as="p" rule className="mb-3">
                Navegación
              </MonoLabel>
              <Hairline />

              <ul className="flex flex-col">
                {mobileLinks.map((link, i) => {
                  const isActive = active === link.id;
                  const item = (
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={isActive ? "true" : undefined}
                      className={`group flex items-center gap-4 py-3 ${
                        isActive ? "text-white" : "text-white/70 hover:text-white active:text-white"
                      }`}
                      style={{ transition: "color var(--dur-1) var(--ease-mech)" }}
                    >
                      <MonoLabel tone={isActive ? "bright" : "dim"} className="w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </MonoLabel>
                      <span className="t-h3">{link.label}</span>
                      <span
                        aria-hidden="true"
                        className="ml-auto inline-flex text-white/30 transition-transform duration-150 group-hover:translate-x-1 group-active:translate-x-1"
                      >
                        <ArrowRight />
                      </span>
                    </a>
                  );
                  return (
                    <li key={link.href}>
                      {reduced ? (
                        item
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: menuStaggerDelay(i),
                            duration: DUR.d3,
                            ease: EASE.expo,
                          }}
                        >
                          {item}
                        </motion.div>
                      )}
                      {i < mobileLinks.length - 1 && <Hairline />}
                    </li>
                  );
                })}
              </ul>

              {/* Bloque de contacto + CTA verde a ancho completo */}
              <div className="mt-auto pt-8">
                <MonoLabel as="p" rule>
                  Contacto directo
                </MonoLabel>
                <ul className="mt-4 flex flex-col gap-2 text-[15px] leading-snug" style={{ color: "var(--tx-3)" }}>
                  <li>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                      style={{ transition: "color var(--dur-1) var(--ease-mech)" }}
                    >
                      WhatsApp: +54 9 11 6125 6413
                      <span className="sr-only"> (abre en una pestaña nueva)</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="hover:text-white"
                      style={{ transition: "color var(--dur-1) var(--ease-mech)" }}
                    >
                      {EMAIL}
                    </a>
                  </li>
                  <li>General Pacheco, Buenos Aires</li>
                </ul>
                <Button
                  variant="whatsapp"
                  size="lg"
                  full
                  href={WHATSAPP_URL}
                  external
                  icon={<WhatsAppIcon className="h-5 w-5" />}
                  iconPosition="left"
                  className="mt-6"
                >
                  Escribinos por WhatsApp
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
