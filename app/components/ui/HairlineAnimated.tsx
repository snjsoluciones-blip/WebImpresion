"use client";

import { motion } from "framer-motion";
import { DUR, EASE, VIEWPORT } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

/** Parte cliente de <Hairline animate />: entra con scaleX 0→1 (origen izquierda), 700 ms expo. */
export default function HairlineAnimated({
  orientation = "h",
  className = "",
}: {
  orientation?: "h" | "v";
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const base = orientation === "v" ? "hairline-v" : "hairline";
  if (reduced) return <div aria-hidden="true" className={`${base} ${className}`} />;
  const from = orientation === "v" ? { scaleY: 0 } : { scaleX: 0 };
  const to = orientation === "v" ? { scaleY: 1 } : { scaleX: 1 };
  return (
    <motion.div
      aria-hidden="true"
      className={`${base} ${className}`}
      style={{ transformOrigin: orientation === "v" ? "50% 0%" : "0% 50%" }}
      initial={from}
      whileInView={to}
      viewport={VIEWPORT}
      transition={{ duration: DUR.d4, ease: EASE.expo }}
    />
  );
}
