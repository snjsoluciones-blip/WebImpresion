"use client";

// Cuatro números reales del taller que cuentan hasta su valor al entrar en pantalla.
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import Surface from "./ui/Surface";
import Reveal from "./ui/Reveal";
import Stagger from "./ui/Stagger";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

const STATS = [
  { to: 500, label: "llaveros con logo propio, en menos de una semana" },
  { to: 18, label: "trofeos de una misma serie, cada uno con su placa" },
  { to: 4, label: "materiales: PLA, PETG, ABS y TPU" },
  { to: 2, label: "formatos de archivo: STL y 3MF" },
] as const;

function Counter({ to }: { to: number }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = String(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduced, to]);

  return (
    <span ref={ref} aria-label={String(to)}>
      0
    </span>
  );
}

export default function Stats() {
  return (
    <Section id="numeros" tone="base" labelledBy="numeros-title">
      <SectionHeading eyebrow="En números" titleId="numeros-title" title="Trabajo real, a medida." />

      <Stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {STATS.map((s) => (
          <Reveal key={s.label} className="flex">
            <Surface padding="md" className="w-full">
              <p
                className="font-display m-0 font-bold leading-none tracking-[-0.05em] text-white"
                style={{ fontSize: "clamp(3rem, 2rem + 4vw, 5.5rem)" }}
              >
                <Counter to={s.to} />
              </p>
              <p className="t-body mt-4 max-w-[22ch]" style={{ color: "var(--tx-3)" }}>
                {s.label}
              </p>
            </Surface>
          </Reveal>
        ))}
      </Stagger>
    </Section>
  );
}
