"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";

const LINKS = [
  { href: "/gestion", label: "Tablero" },
  { href: "/gestion/calendario", label: "Calendario" },
  { href: "/gestion/cuentas", label: "Cuentas" },
  { href: "/gestion/presupuestos", label: "Presupuestos" },
  { href: "/gestion/tareas", label: "Tareas" },
];

export default function Nav() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-black/5">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
          >
            SNJ
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                    active
                      ? "text-white"
                      : "text-neutral-600 hover:bg-black/5"
                  }`}
                  style={active ? { background: "linear-gradient(135deg,#7c3aed,#06b6d4)" } : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="text-neutral-500 hidden sm:inline">{usuario}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-full text-neutral-500 hover:bg-black/5 transition"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
