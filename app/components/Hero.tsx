"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      
      {/* Video de fondo en bucle */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        Tu navegador no soporta videos de fondo.
      </video>

      {/* Capa oscura encima del video para asegurar el contraste del texto */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />

      {/* Degradado radial original para mantener la estética premium */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #0a0a0a 100%)",
        }}
      />

      {/* Contenido (Subimos el z-index a 20 para que flote sobre el video) */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mb-8"
        >
          Soluciones para la Industria
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05]"
        >
          Impresión 3D
          <br />
          <span className="text-white/70">Industrial</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="mt-8 text-lg md:text-xl text-white/45 font-light max-w-xl mx-auto leading-relaxed"
        >
          Fabricación de repuestos, matricería y series cortas en Pacheco, Buenos Aires. Alta precisión y resistencia para los desafíos de tu empresa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#contacto"
            className="px-8 py-4 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/90 active:scale-95 transition-all duration-200 min-w-[160px] text-center"
          >
            Cotizar Pieza
          </a>
          <a
            href="#galeria"
            className="px-8 py-4 border border-white/20 text-white font-semibold text-sm rounded-full hover:bg-white/5 hover:border-white/35 active:scale-95 transition-all duration-200 min-w-[160px] text-center"
          >
            Ver Trabajos
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-white/20">
            <span className="text-xs tracking-widest uppercase">Explorar</span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}