"use client";

import { motion } from "framer-motion";

const services = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
        />
      </svg>
    ),
    title: "Modelado + Impresión",
    description:
      "¿Tenés una idea? Nosotros la modelamos en 3D y la imprimimos.",
    detail:
      "Desde el concepto hasta la pieza física. Trabajamos con vos para dar forma a tu idea con precisión profesional.",
    badge: "Más popular",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
        />
      </svg>
    ),
    title: "Solo Impresión",
    description:
      "¿Ya tenés el modelo? Solo necesitamos el archivo y lo imprimimos.",
    detail:
      "Envianos tu archivo STL o STEP y nos encargamos de la impresión con los mejores materiales disponibles.",
    badge: null,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Servicios
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            ¿Qué necesitás?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
              className="group relative flex flex-col gap-6 bg-[#111111] border border-white/[0.08] rounded-2xl p-8 hover:border-white/[0.16] transition-colors duration-300"
            >
              {service.badge && (
                <span className="absolute top-6 right-6 text-[10px] font-semibold uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-3 py-1">
                  {service.badge}
                </span>
              )}

              <div className="text-white/50 group-hover:text-white/70 transition-colors duration-300">
                {service.icon}
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="text-white/55 leading-relaxed">{service.description}</p>
                <p className="text-white/35 text-sm leading-relaxed">{service.detail}</p>
              </div>

              <a
                href="#contacto"
                className="mt-auto inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                Solicitar este servicio
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
