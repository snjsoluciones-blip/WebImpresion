"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BASE } from "../lib/rutas";

const LINKS = [
  { href: BASE, label: "Tablero" },
  { href: `${BASE}/calendario`, label: "Calendario" },
  { href: `${BASE}/cuentas`, label: "Cuentas" },
  { href: `${BASE}/presupuestos`, label: "Presupuestos" },
  { href: `${BASE}/tareas`, label: "Tareas" },
];

export default function Nav() {
  const pathname = usePathname();

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
              </Link>
            );
          })}
        </nav>
        <span className="text-white/30 text-sm select-none">SNJ Gestión</span>
      </div>
    </header>
  );
}
