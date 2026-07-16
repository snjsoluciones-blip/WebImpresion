"use client";

import { motion } from "framer-motion";

// Loader temático: capas de impresión 3D que se van apilando.
export default function PrintLoader({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/60">
      <div className="flex flex-col-reverse gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-[3px] rounded-full bg-white/70"
            style={{ width: 22 }}
            initial={{ scaleX: 0, opacity: 0.3 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: i * 0.15,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0.3,
            }}
          />
        ))}
      </div>
      <span>{label ?? "Pensando…"}</span>
    </div>
  );
}
