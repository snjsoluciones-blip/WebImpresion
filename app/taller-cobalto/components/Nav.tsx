"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BASE } from "../lib/rutas";
import { useAuth } from "../lib/auth";
import ColorPicker from "./ColorPicker";
import { useConsultasNuevas } from "../lib/consultas";

// Íconos de trazo fino, en la misma línea que los de iOS.
const ICONOS: Record<string, ReactNode> = {
  tablero: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  ),
  consultas: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 13.5 6 5.5a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 5.5l2.5 8" />
      <path d="M3.5 13.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4.5h-5l-1.2 2.2h-5.6L8.5 13.5z" />
    </svg>
  ),
  clientes: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.7a3.5 3.5 0 0 1 0 6.6" />
      <path d="M18 14.2A6.5 6.5 0 0 1 21.5 20" />
    </svg>
  ),
  calendario: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  ),
  cuentas: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12z" />
      <path d="M14.5 3.7A8.5 8.5 0 0 1 20.3 9.5h-5.8z" />
    </svg>
  ),
  papelera: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
};

const TABS = [
  { href: BASE, label: "Tablero", icono: "tablero" },
  { href: `${BASE}/consultas`, label: "Consultas", icono: "consultas" },
  { href: `${BASE}/clientes`, label: "Clientes", icono: "clientes" },
  { href: `${BASE}/calendario`, label: "Calendario", icono: "calendario" },
  { href: `${BASE}/cuentas`, label: "Cuentas", icono: "cuentas" },
  { href: `${BASE}/papelera`, label: "Papelera", icono: "papelera" },
];

// Título grande de cada pantalla, como las apps de iOS.
function tituloDe(pathname: string): string {
  const resto = pathname.replace(BASE, "").replace(/^\//, "").split("/")[0];
  switch (resto) {
    case "":
      return "Tablero";
    case "proyectos":
      return "Proyecto";
    case "consultas":
      return "Consultas";
    case "clientes":
      return "Clientes";
    case "calendario":
      return "Calendario";
    case "cuentas":
      return "Cuentas";
    case "papelera":
      return "Papelera";
    case "presupuestos":
      return "Presupuestos";
    case "tareas":
      return "Tareas";
    default:
      return "SNJ Gestión";
  }
}

// La pestaña activa: el Tablero también cubre la ficha de un proyecto.
function pestañaActiva(pathname: string): string {
  const resto = pathname.replace(BASE, "").replace(/^\//, "").split("/")[0];
  if (resto === "" || resto === "proyectos") return BASE;
  const hit = TABS.find((t) => t.href === `${BASE}/${resto}`);
  return hit ? hit.href : "";
}

export default function Nav() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const nuevas = useConsultasNuevas(pathname);
  const activa = pestañaActiva(pathname);
  const fecha = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const hoy = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  return (
    <>
      <header className="g-encabezado">
        <div>
          <h1 className="g-titulo">{tituloDe(pathname)}</h1>
          <p className="g-fecha">{hoy}</p>
        </div>
        <div className="flex items-center gap-2">
          <ColorPicker />
          <div className="g-usuario g-vidrio">
            <span>{usuario}</span>
            <button onClick={logout}>Salir</button>
          </div>
        </div>
      </header>

      <nav className="g-tabs" aria-label="Secciones">
        {TABS.map((t) => {
          const esActiva = t.href === activa;
          return (
            <Link key={t.href} href={t.href} className="g-tab" aria-current={esActiva ? "page" : undefined}>
              {esActiva && (
                <motion.span
                  layoutId="g-burbuja"
                  className="g-burbuja"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {ICONOS[t.icono]}
              <span className="g-tab-texto">{t.label}</span>
              {t.label === "Consultas" && nuevas > 0 && (
                <span className="g-insignia" aria-label={`${nuevas} consultas nuevas`}>
                  {nuevas}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
