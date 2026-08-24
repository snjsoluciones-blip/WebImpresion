"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface GalleryItem {
  src?: string;
  video?: string;
  title: string;
  desc: string;
  category: string;
}

const items: GalleryItem[] = [
  {
    src: "/images/trofeo-nankang.jpeg",
    title: "Trofeos Nankang",
    desc: "Serie de seis trofeos para el campeonato, con base texturada y el logo del sponsor grabado en relieve.",
    category: "Automovilismo",
  },
  {
    src: "/images/soporte-aim-solo2.jpg",
    video: "/videos/soporte-aim-solo2.mp4",
    title: "Soportes de Telemetría a Medida",
    desc: "Soporte para el display AiM Solo 2 y soporte para mejorar el ángulo de visión del Lisso, impresos en PETG por su resistencia. Diseñados a medida para autos de competición.",
    category: "Automovilismo",
  },
  {
    src: "/images/llavero-mc-racing.jpg",
    title: "Llaveros Personalizados",
    desc: "Tanda de 500 llaveros con diseño y modelado 100% a medida del logo del cliente, terminados en menos de una semana.",
    category: "Personalizados",
  },
];

export default function Gallery() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end center"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="galeria" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-24"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Nuestros Trabajos
          </h2>
        </motion.div>

        <div ref={railRef} className="relative flex flex-col gap-24 md:gap-32">
          {/* Riel de progreso, visible desde md */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10">
            <motion.div
              className="absolute top-0 left-0 w-full bg-white/40"
              style={{ height: railHeight }}
            />
          </div>

          {items.map((item, i) => {
            const fromLeft = i % 2 === 0;
            return (
              <div
                key={item.title}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  fromLeft ? "" : "md:flex-row-reverse"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: fromLeft ? -56 : 56, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative w-full md:w-[46%] aspect-[4/3] rounded-sm overflow-hidden bg-[#111111] border border-white/[0.08]"
                >
                  {item.video ? (
                    <video
                      src={item.video}
                      poster={item.src}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : item.src ? (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 46vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 7px)",
                    }}
                  />
                  <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-widest bg-black/60 text-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                  <span className="absolute bottom-3 right-4 text-4xl font-semibold text-white/[0.08] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-full md:w-[46%]"
                >
                  <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/45 leading-relaxed max-w-md">{item.desc}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
