const footerLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="font-semibold text-white text-lg tracking-tight mb-3">
              SNJ Soluciones
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              Impresión 3D de precisión para industria y proyectos personales.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © 2026 SNJ Soluciones. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20">
            Impresión 3D &middot; Modelado 3D &middot; Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
