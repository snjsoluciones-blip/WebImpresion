"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";

const LINKS = [
  { href: "/gestion", label: "Tablero" },
  { href: "/gestion/cuentas", label: "Cuentas" },
  { href: "/gestion/presupuestos", label: "Presupuestos" },
  { href: "/gestion/tareas", label: "Tareas" },
];

export default function Nav() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

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
