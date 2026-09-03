"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Barra de 1px al borde inferior del header (el header debe ser position:fixed/relative).
 * scrollYProgress → scaleX exacto, sin spring. aria-hidden, pointer-events:none.
 * Reduced-motion: se renderiza igual (no hay transición que apagar).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[-1px] left-0 right-0 h-px"
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0% 50%",
        background: "linear-gradient(90deg, rgba(255,255,255,0.25), #fff)",
      }}
    />
  );
}
