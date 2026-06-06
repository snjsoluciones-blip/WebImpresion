"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Describís tu pieza",
    desc: "Enviás descripción, medidas, material y fotos de referencia",
  },
  {
    number: "02",
    title: "Modelamos en 3D",
    desc: "Nuestro equipo crea el modelo digital de tu pieza",
  },
  {
    number: "03",
    title: "Confirmás el diseño",
    desc: "Revisás el modelo antes de imprimir",
  },
  {
    number: "04",
    title: "Imprimimos y enviamos",
    desc: "Imprimimos con alta calidad y te lo enviamos",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-20"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Proceso
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Cómo Funciona
          </h2>
        </motion.div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          {/* Circles row with connecting line */}
          <div className="relative flex items-center mb-10">
            {/* Background line */}
            <div
              className="absolute h-px bg-white/10"
              style={{ left: "12.5%", right: "12.5%" }}
            />
            {/* Circles */}
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-40px" }}
                className="flex-1 flex justify-center relative z-10"
              >
                <div className="w-16 h-16 rounded-full border border-white/15 bg-[#111111] flex items-center justify-center">
                  <span className="font-mono text-xs text-white/50">{step.number}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Text row */}
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.2, ease: "easeOut" }}
                viewport={{ once: true, margin: "-40px" }}
                className="text-center px-2"
              >
                <h3 className="font-semibold text-white mb-2 text-sm">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col gap-0 md:hidden">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              viewport={{ once: true, margin: "-40px" }}
              className="flex gap-5"
            >
              {/* Left: circle + vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full border border-white/15 bg-[#111111] flex items-center justify-center z-10">
                  <span className="font-mono text-xs text-white/50">{step.number}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 w-px bg-white/10 my-2 min-h-[48px]" />
                )}
              </div>

              {/* Right: text */}
              <div className="pb-10">
                <h3 className="font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
