"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const items = [
  {
    src: "/images/bracket.png",
    title: "Soporte Industrial",
    desc: "Bracket funcional para maquinaria pesada",
    category: "Industrial",
  },
  {
    src: "/images/gear.png",
    title: "Engranaje de Precisión",
    desc: "Pieza de transmisión con tolerancias exactas",
    category: "Mecánica",
  },
  {
    src: "/images/connector.png",
    title: "Conector Roscado",
    desc: "Acoplamiento con rosca de alta resistencia",
    category: "Conectores",
  },
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Nuestros Trabajos
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
              className="group bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.22] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Category tag */}
                <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-widest bg-black/60 text-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
