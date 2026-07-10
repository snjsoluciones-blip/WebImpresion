"use client";

import { motion } from "framer-motion";

const materials = [
  {
    name: "PLA",
    tagline: "El todoterreno",
    description:
      "El material más versátil y económico. Excelente nivel de detalle y terminación superficial.",
    idealFor: "Prototipos, maquetas, piezas decorativas, trofeos.",
    props: ["Detalle alto", "Hasta ~55°C", "Uso interior"],
  },
  {
    name: "PETG",
    tagline: "Resistente y confiable",
    description:
      "Buena resistencia mecánica y química. Tolera humedad y golpes sin volverse frágil.",
    idealFor: "Repuestos funcionales, soportes, piezas de uso diario.",
    props: ["Resistente", "Hasta ~75°C", "Apto exterior"],
  },
  {
    name: "ABS",
    tagline: "Para exigencia térmica",
    description:
      "Soporta impacto y temperaturas altas. El clásico de las piezas técnicas y automotrices.",
    idealFor: "Piezas de auto y moto, carcasas, repuestos cerca de motores.",
    props: ["Muy resistente", "Hasta ~95°C", "Apto exterior"],
  },
  {
    name: "TPU",
    tagline: "El flexible",
    description:
      "Elástico como la goma y muy resistente a la abrasión. Absorbe impactos y vibraciones.",
    idealFor: "Juntas, fundas, ruedas, protectores, bujes.",
    props: ["Flexible", "Antigolpes", "Antiabrasión"],
  },
];

export default function Materials() {
  return (
    <section id="materiales" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Materiales
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            El material correcto para cada pieza
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {materials.map((material, i) => (
            <motion.div
              key={material.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
              className="group flex flex-col gap-4 bg-[#111111] border border-white/[0.08] rounded-2xl p-7 hover:border-white/[0.16] transition-colors duration-300"
            >
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {material.name}
                </h3>
                <p className="text-white/35 text-xs font-semibold uppercase tracking-widest mt-1">
                  {material.tagline}
                </p>
              </div>

              <p className="text-white/55 text-sm leading-relaxed">
                {material.description}
              </p>

              <p className="text-white/35 text-sm leading-relaxed">
                <span className="text-white/50 font-medium">Ideal para:</span>{" "}
                {material.idealFor}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {material.props.map((prop) => (
                  <span
                    key={prop}
                    className="text-[10px] font-semibold uppercase tracking-wider text-white/40 border border-white/10 rounded-full px-3 py-1"
                  >
                    {prop}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 text-white/40 text-sm"
        >
          ¿No sabés cuál conviene para tu pieza?{" "}
          <a
            href="#contacto"
            className="text-white/70 underline underline-offset-4 hover:text-white transition-colors duration-200"
          >
            Contanos qué necesitás
          </a>{" "}
          y te asesoramos sin compromiso.
        </motion.p>
      </div>
    </section>
  );
}
