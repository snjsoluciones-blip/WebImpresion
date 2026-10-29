"use client";

// Dos cintas de texto gigante que se deslizan en sentidos opuestos al ritmo del scroll
// (no a velocidad fija): al bajar una va a la izquierda y la otra a la derecha.
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

const ROW_A = "Impresión 3D · Modelado 3D · STL · 3MF · ";
const ROW_B = "PLA · PETG · ABS · TPU · A medida · Pacheco · ";

function Row({ text, outline }: { text: string; outline?: boolean }) {
  return (
    <span
      className="font-display inline-block whitespace-nowrap font-bold leading-none tracking-[-0.04em]"
      style={{
        fontSize: "clamp(3.5rem, 2rem + 8vw, 9rem)",
        color: outline ? "transparent" : "rgba(255,255,255,0.92)",
        WebkitTextStroke: outline ? "1.5px rgba(255,255,255,0.4)" : undefined,
      }}
    >
      {text.repeat(4)}
    </span>
  );
}

export default function ScrollMarquee() {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const xa = useTransform(smooth, [0, 1], reduced ? ["-10%", "-10%"] : ["0%", "-35%"]);
  const xb = useTransform(smooth, [0, 1], reduced ? ["-30%", "-30%"] : ["-45%", "0%"]);

  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden py-10 sm:py-16">
      <motion.div style={{ x: xa }} className="flex w-max">
        <Row text={ROW_A} />
      </motion.div>
      <motion.div style={{ x: xb }} className="mt-3 flex w-max sm:mt-5">
        <Row text={ROW_B} outline />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48"
        style={{ background: "linear-gradient(90deg, #08090a, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48"
        style={{ background: "linear-gradient(270deg, #08090a, transparent)" }}
      />
    </div>
  );
}
