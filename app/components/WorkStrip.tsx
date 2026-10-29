"use client";

// Tira de fotos reales del taller que se desliza en horizontal mientras bajás, con
// zoom suave al pasar el cursor y una etiqueta de vidrio en cada foto.
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

const PHOTOS = [
  { src: "/images/float-llavero-castrol.jpg", alt: "Llavero personalizado de un bidón Castrol, impreso en 3D", label: "Llavero Castrol" },
  { src: "/images/float-estuche-valen.jpg", alt: "Estuche a medida para AiM Solo 2 y cámara, con el nombre del piloto grabado", label: "Estuche AiM Solo 2" },
  { src: "/images/trofeo-piloto-dorado.jpg", alt: "Trofeo de un piloto en acabado metalizado dorado", label: "Trofeo dorado" },
  { src: "/images/float-llavero-castrol-car.jpg", alt: "Estuche GoPro junto a un llavero de un auto de carrera Castrol", label: "Estuche y llavero" },
  { src: "/images/float-estuche-interior.jpg", alt: "Interior de un estuche a medida con la espuma recortada para cada pieza", label: "Interior a medida" },
  { src: "/images/trofeo-nankang-pole-minicas.jpg", alt: "Trofeo Nankang con la placa de la categoría Mini Cas", label: "Trofeo Nankang" },
] as const;

export default function WorkStrip() {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.7 });
  const x = useTransform(smooth, [0, 1], reduced ? ["0%", "0%"] : ["8%", "-38%"]);

  return (
    <div ref={ref} className="relative overflow-hidden py-16 sm:py-24" aria-label="Piezas hechas en el taller">
      <motion.ul style={{ x }} className="m-0 flex w-max list-none gap-4 p-0 pl-6 sm:gap-6">
        {PHOTOS.map((p, i) => (
          <li
            key={p.src}
            className="group relative shrink-0 overflow-hidden rounded-[var(--r-lg)]"
            style={{
              width: "clamp(220px, 28vw, 380px)",
              aspectRatio: i % 2 === 0 ? "3 / 4" : "4 / 5",
              marginTop: i % 2 === 0 ? 0 : "clamp(1.5rem, 4vw, 4rem)",
              border: "1px solid var(--line-2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 24px 60px rgba(0,0,0,0.4)",
            }}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 60vw, 30vw"
              quality={75}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
            />
            <span
              className="absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-xs font-medium text-white"
              style={{
                background: "rgba(10,10,12,0.45)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px) saturate(160%)",
                WebkitBackdropFilter: "blur(14px) saturate(160%)",
              }}
            >
              {p.label}
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
