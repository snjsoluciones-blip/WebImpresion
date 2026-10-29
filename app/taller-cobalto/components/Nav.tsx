"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BASE } from "../lib/rutas";
import { useAuth } from "../lib/auth";
import { useConsultasNuevas } from "../lib/consultas";

const LINKS = [
  { href: BASE, label: "Tablero" },
  { href: `${BASE}/consultas`, label: "Consultas" },
  { href: `${BASE}/clientes`, label: "Clientes" },
  { href: `${BASE}/calendario`, label: "Calendario" },
  { href: `${BASE}/cuentas`, label: "Cuentas" },
  { href: `${BASE}/papelera`, label: "Papelera" },
];

export default function Nav() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const nuevas = useConsultasNuevas(pathname);

  return (
    <header className="border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  active ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                }`}
              >
                {l.label}
                {l.label === "Consultas" && nuevas > 0 && (
                  <span
                    className={`ml-1.5 inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1.5 text-xs font-medium ${
                      active ? "bg-black text-white" : "bg-amber-400 text-black"
                    }`}
                    aria-label={`${nuevas} consultas nuevas`}
                  >
                    {nuevas}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white/60">{usuario}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-md text-white/60 hover:bg-white/10 transition"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
