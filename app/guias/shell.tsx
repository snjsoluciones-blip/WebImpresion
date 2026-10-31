import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const glass = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
  border: "1px solid rgba(255,255,255,0.16)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.34), 0 24px 60px rgba(0,0,0,0.32)",
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
} as const;

/** Marco simple (cabecera + pie) para las páginas internas de guías y zonas. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-root">
      <header className="shell flex items-center justify-between gap-4 py-5">
        <Link href="/" className="flex items-center" aria-label="SNJ Soluciones, ir al inicio">
          <Image src="/images/snj-logo.png" alt="SNJ Soluciones" width={147} height={69} className="h-9 w-auto" priority />
        </Link>
        <Link href="/#contacto" className="snj-btn snj-btn--primary snj-btn--sm">
          Cotizar
        </Link>
      </header>

      {children}

      <footer className="shell py-12 text-sm" style={{ color: "var(--tx-4)" }}>
        <p className="m-0">
          © {new Date().getFullYear()} SNJ Soluciones · Impresión y modelado 3D en General Pacheco, Buenos Aires ·{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            Volver al inicio
          </Link>
        </p>
      </footer>
    </div>
  );
}
