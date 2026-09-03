"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "./ui/Section";
import ChromeText from "./ui/ChromeText";
import LayerLines from "./ui/LayerLines";
import Field from "./ui/Field";
import Stepper from "./ui/Stepper";
import Button from "./ui/Button";
import Tag from "./ui/Tag";
import Surface from "./ui/Surface";
import Hairline from "./ui/Hairline";
import MonoLabel from "./ui/MonoLabel";
import Reveal from "./ui/Reveal";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { EASE } from "./ui/motion";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";
import { useLocalDraft } from "./ui/useLocalDraft";
import { MATERIAL_VALUES, SERVICE_VALUES, useQuote } from "./ui/quote-context";

/* =========================================================================
   Datos de contacto reales — intactos.
   ========================================================================= */

const WHATSAPP_NUMBER = "541161256413";
const WHATSAPP_DIRECT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "¡Hola! Vengo de la web de SNJ Soluciones y quiero hacer una consulta."
)}`;
const DRAFT_KEY = "snj-cotizacion-v1";
const DESC_MAX = 600;

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  descripcion: string;
  medidas: string;
  material: string;
}

type FieldName = keyof FormState;

const INITIAL: FormState = {
  nombre: "",
  email: "",
  telefono: "",
  servicio: "Modelado + Impresión",
  descripcion: "",
  medidas: "",
  material: "PLA",
};

const STEPS = ["Tu proyecto", "Tus datos", "Revisar y enviar"];

/** Obligatorios por paso: la misma regla de `formValid` de siempre, repartida en dos pasos. */
const STEP_REQUIRED: FieldName[][] = [["descripcion", "medidas"], ["nombre", "email", "telefono"], []];

const FIELD_STEP: Record<FieldName, number> = {
  servicio: 0,
  descripcion: 0,
  medidas: 0,
  material: 0,
  nombre: 1,
  email: 1,
  telefono: 1,
};

const FIELD_WORD: Record<FieldName, string> = {
  servicio: "servicio",
  descripcion: "descripción",
  medidas: "medidas",
  material: "material",
  nombre: "nombre",
  email: "email",
  telefono: "teléfono",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* =========================================================================
   Mensaje de WhatsApp — carácter por carácter el de siempre.
   buildWhatsAppUrl() lo consume; la preview del paso 3 lo muestra tal cual.
   ========================================================================= */

function buildMessage(form: FormState) {
  return `Hola SNJ Soluciones! 👋 Quiero solicitar una pieza 3D.

👤 Nombre: ${form.nombre.trim()}
📧 Email: ${form.email.trim()}
📱 Teléfono: ${form.telefono.trim()}

📋 Servicio: ${form.servicio}
📝 Descripción: ${form.descripcion.trim()}
📐 Medidas: ${form.medidas.trim()}
🧪 Material: ${form.material}

Quedo a disposición para coordinar. Gracias!`;
}

function buildWhatsAppUrl(form: FormState) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(form))}`;
}

function isFormValid(f: FormState) {
  return (
    f.nombre.trim() !== "" &&
    f.email.trim() !== "" &&
    f.telefono.trim() !== "" &&
    f.descripcion.trim() !== "" &&
    f.medidas.trim() !== ""
  );
}

/** Validación amable en blur. Nunca bloquea más allá de "campos completos". */
function validateField(name: FieldName, value: string): string | null {
  const v = value.trim();
  if (name === "nombre" && v === "") return "Necesitamos saber cómo llamarte";
  if (name === "email" && v !== "" && !EMAIL_RE.test(v)) return "Revisá el email, parece que falta algo";
  if (name === "telefono" && v !== "" && v.replace(/\D/g, "").length < 8) {
    return "Poné al menos 8 números, con característica";
  }
  return null;
}

function truncate(s: string, max: number) {
  const t = s.trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/* =========================================================================
   Iconos (1px, currentColor)
   ========================================================================= */

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4L3 8l4 4" />
    </svg>
  );
}

function ClipIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 4.5 5.8 9.2a1.6 1.6 0 0 0 2.3 2.3l5-5a3 3 0 0 0-4.2-4.2l-5.3 5.3a4.2 4.2 0 0 0 6 6L13 10.2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/* =========================================================================
   Chips de servicio / material (radiogroup con flechas + select sr-only sincronizado)
   ========================================================================= */

type ChipGroupProps = {
  id: "servicio" | "material";
  index: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
};

function ChipGroup({ id, index, label, options, value, onChange }: ChipGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!forward && !back) return;
    e.preventDefault();
    const i = Math.max(0, options.indexOf(value));
    const nextIndex = (i + (forward ? 1 : -1) + options.length) % options.length;
    onChange(options[nextIndex]);
    requestAnimationFrame(() => {
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="inline-flex items-center gap-2">
        <MonoLabel tone="dim">
          {index} {label}
        </MonoLabel>
        <span
          aria-hidden="true"
          className="inline-block h-1 w-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />
        <span className="sr-only">(obligatorio)</span>
      </span>

      <div
        ref={groupRef}
        id={`${id}-group`}
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => (
          <Tag
            key={opt}
            as="button"
            role="radio"
            selected={opt === value}
            tabIndex={opt === value ? 0 : -1}
            onClick={() => onChange(opt)}
            className="min-h-[44px] px-4 text-[12px]!"
          >
            {opt}
          </Tag>
        ))}
      </div>

      {/* Select sincronizado: mantiene name/id/values de siempre para autofill y formularios. */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        required
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================================
   Panel de paso: enfoca el primer control al montar (nunca en la carga inicial)
   ========================================================================= */

function StepPanel({
  children,
  focusId,
  focusOnMount,
}: {
  children: ReactNode;
  focusId: string | null;
  focusOnMount: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusOnMount) return;
    const raf = requestAnimationFrame(() => {
      const panel = ref.current;
      if (!panel) return;
      let target: HTMLElement | null = null;
      if (focusId) {
        target =
          panel.querySelector<HTMLElement>(`#${focusId}-group [role="radio"][aria-checked="true"]`) ??
          panel.querySelector<HTMLElement>(`#${focusId}`);
      }
      if (!target) {
        target = panel.querySelector<HTMLElement>(
          '[role="radio"][aria-checked="true"], input:not([type="hidden"]), textarea, [data-first-focus]'
        );
      }
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
    // Solo al montar el paso: focusId/focusOnMount ya están decididos en ese momento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}>{children}</div>;
}

/* =========================================================================
   Formulario
   ========================================================================= */

export default function ContactForm() {
  const reduced = useReducedMotionSafe();
  const { preset } = useQuote();
  const [form, setForm, clearDraft] = useLocalDraft<FormState>(DRAFT_KEY, INITIAL);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [recoveredDismissed, setRecoveredDismissed] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string | null>>>({});

  // Borrador recuperado: hay algo escrito y el usuario todavía no tocó nada en esta visita.
  const recovered = !touched && !recoveredDismissed && JSON.stringify(form) !== JSON.stringify(INITIAL);

  // Preset que llega desde Servicios / Materiales ("Cotizar en PETG").
  // Diferido (no sincrónico en el efecto) para no encadenar renders.
  useEffect(() => {
    const next: Partial<FormState> = {};
    if (preset.servicio && (SERVICE_VALUES as readonly string[]).includes(preset.servicio)) {
      next.servicio = preset.servicio;
    }
    if (preset.material && (MATERIAL_VALUES as readonly string[]).includes(preset.material)) {
      next.material = preset.material;
    }
    if (Object.keys(next).length === 0) return;
    const id = window.setTimeout(() => {
      setTouched(true);
      setForm((p) => ({ ...p, ...next }));
      setDirection(-1);
      setStep(0);
    }, 0);
    return () => window.clearTimeout(id);
  }, [preset.servicio, preset.material, setForm]);

  const go = useCallback(
    (to: number, focus: string | null = null) => {
      setDirection(to > step ? 1 : -1);
      setFocusId(focus);
      setInteracted(true);
      setStep(to);
    },
    [step]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setTouched(true);
    setForm((p) => ({ ...p, [name]: value }));
    // Se limpia mientras escribe; nunca se calcula mientras escribe.
    setErrors((p) => (p[name] ? { ...p, [name]: null } : p));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const message = validateField(name, e.target.value);
    setErrors((p) => (p[name] === message ? p : { ...p, [name]: message }));
  };

  const setChip = (name: "servicio" | "material") => (v: string) => {
    setTouched(true);
    setForm((p) => ({ ...p, [name]: v }));
  };

  const missing = STEP_REQUIRED[step].filter((n) => form[n].trim() === "");
  const canContinue = missing.length === 0;
  const formValid = isFormValid(form);

  const onFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
    e.preventDefault();
    if (step < STEPS.length - 1 && canContinue) go(step + 1);
  };

  const restart = () => {
    clearDraft();
    setErrors({});
    setSent(false);
    setTouched(false);
    setRecoveredDismissed(true);
    go(0);
  };

  // Al abrir WhatsApp: borramos el borrador guardado, pero dejamos el formulario a la vista
  // por si la pestaña no se abrió y hay que tocar de nuevo.
  const handleSent = () => {
    setSent(true);
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* sin storage */
    }
  };

  const descHint =
    form.descripcion.trim().length < 40
      ? "Contanos para qué es la pieza y en qué condiciones va a trabajar"
      : "Con eso ya podemos empezar";

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : 24 * d }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : -24 * d }),
  };

  const summaryRows: { key: FieldName; label: string; value: string }[] = [
    { key: "servicio", label: "Servicio", value: form.servicio },
    { key: "material", label: "Material", value: form.material },
    { key: "medidas", label: "Medidas", value: form.medidas },
    { key: "descripcion", label: "Descripción", value: truncate(form.descripcion, 140) },
    { key: "nombre", label: "Nombre", value: form.nombre },
    { key: "email", label: "Email", value: form.email },
    { key: "telefono", label: "Teléfono", value: form.telefono },
  ];

  return (
    <Section id="contacto" bleed labelledBy="contacto-title" tone="base">
      {/* ---------- Cabecera cromo a sangre ---------- */}
      <div className="relative">
        <LayerLines spacing={7} opacity={0.05} />
        <div className="shell relative">
          <div className="mb-6 flex items-center gap-4">
            <MonoLabel>08 / Contacto</MonoLabel>
            <Hairline animate className="flex-1" />
          </div>
          <Reveal>
            <h2 id="contacto-title" className="t-display">
              <ChromeText>Mandanos tu pieza</ChromeText>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="t-lead mt-5 max-w-2xl">
              Completá el formulario y te contactamos por WhatsApp con toda la información.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ---------- Formulario + vías alternativas ---------- */}
      <div
        className="shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
        style={{ marginTop: "clamp(3rem, 2rem + 3vw, 5.5rem)" }}
      >
        <div className="min-w-0">
          <Stepper steps={STEPS} current={step} onStepClick={(i) => go(i)} className="mb-6" />

          <Surface padding="lg" corners spotlight={false}>
            <form
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={onFormKeyDown}
              noValidate
              aria-label="Solicitá tu pieza"
              className="flex flex-col gap-7"
            >
              {recovered && (
                <div
                  role="status"
                  className="flex flex-col gap-3 rounded-[var(--r-sm)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  style={{ background: "var(--srf-2)", border: "1px solid var(--line-1)" }}
                >
                  <span className="text-sm" style={{ color: "var(--tx-3)" }}>
                    Recuperamos lo que habías escrito.
                  </span>
                  <Button variant="ghost" size="sm" onClick={restart}>
                    Empezar de nuevo
                  </Button>
                </div>
              )}

              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0.15 : 0.28, ease: EASE.quart }}
                >
                  <StepPanel focusId={focusId} focusOnMount={interacted}>
                    {/* ---------- Paso 1: tu proyecto ---------- */}
                    {step === 0 && (
                      <div className="flex flex-col gap-7">
                        <ChipGroup
                          id="servicio"
                          index="01"
                          label="Tipo de servicio"
                          options={SERVICE_VALUES}
                          value={form.servicio}
                          onChange={setChip("servicio")}
                        />

                        <div className="snj-field">
                          <Field
                            id="descripcion"
                            index="02"
                            label="Descripción detallada de la pieza"
                            required
                            counter={{ current: form.descripcion.length, max: DESC_MAX }}
                            hint={descHint}
                            error={errors.descripcion}
                          >
                            <textarea
                              name="descripcion"
                              placeholder="Describí la pieza: función, características especiales, tolerancias necesarias, cantidad..."
                              value={form.descripcion}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              rows={5}
                              maxLength={DESC_MAX}
                              className="snj-input"
                              required
                            />
                          </Field>
                        </div>

                        <div className="snj-field">
                          <Field id="medidas" index="03" label="Medidas aproximadas" required error={errors.medidas}>
                            <input
                              type="text"
                              name="medidas"
                              placeholder="Ej: 10cm × 5cm × 3cm"
                              value={form.medidas}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="snj-input"
                              required
                            />
                          </Field>
                        </div>

                        <ChipGroup
                          id="material"
                          index="04"
                          label="Material preferido"
                          options={MATERIAL_VALUES}
                          value={form.material}
                          onChange={setChip("material")}
                        />
                      </div>
                    )}

                    {/* ---------- Paso 2: tus datos ---------- */}
                    {step === 1 && (
                      <div className="flex flex-col gap-7">
                        <div className="snj-field">
                          <Field id="nombre" index="05" label="Nombre" required error={errors.nombre}>
                            <input
                              type="text"
                              name="nombre"
                              placeholder="Tu nombre completo"
                              value={form.nombre}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="snj-input"
                              autoComplete="name"
                              required
                            />
                          </Field>
                        </div>

                        <div className="grid gap-7 sm:grid-cols-2">
                          <div className="snj-field">
                            <Field id="email" index="06" label="Email" required error={errors.email}>
                              <input
                                type="email"
                                name="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="snj-input"
                                autoComplete="email"
                                inputMode="email"
                                required
                              />
                            </Field>
                          </div>
                          <div className="snj-field">
                            <Field id="telefono" index="07" label="Teléfono / WhatsApp" required error={errors.telefono}>
                              <input
                                type="tel"
                                name="telefono"
                                placeholder="Ej: 11 6125 6413"
                                value={form.telefono}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="snj-input"
                                autoComplete="tel"
                                inputMode="tel"
                                required
                              />
                            </Field>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------- Paso 3: revisar y enviar ---------- */}
                    {step === 2 && (
                      <div className="flex flex-col gap-6">
                        <div>
                          <h3 data-first-focus="true" tabIndex={-1} className="t-h3 text-white outline-none">
                            Solicitá tu Pieza
                          </h3>
                          <p className="mt-2 text-sm" style={{ color: "var(--tx-4)" }}>
                            Revisá que esté todo bien. Podés editar cualquier dato antes de enviar.
                          </p>
                        </div>

                        {sent && (
                          <div
                            role="status"
                            className="flex flex-col gap-3 rounded-[var(--r-sm)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            style={{ background: "var(--srf-2)", border: "1px solid var(--line-1)" }}
                          >
                            <span className="flex items-center gap-2 text-sm" style={{ color: "var(--tx-3)" }}>
                              <CheckIcon />
                              Se abrió WhatsApp con tu mensaje. Si no lo ves, tocá el botón de nuevo.
                            </span>
                            <Button variant="ghost" size="sm" onClick={restart}>
                              Empezar de nuevo
                            </Button>
                          </div>
                        )}

                        <dl className="m-0 flex flex-col">
                          {summaryRows.map((row) => (
                            <div key={row.key}>
                              <div className="grid grid-cols-[88px_minmax(0,1fr)_auto] items-start gap-3 py-3 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
                                <dt className="pt-1">
                                  <MonoLabel>{row.label}</MonoLabel>
                                </dt>
                                <dd
                                  className="m-0 min-w-0 break-words text-sm leading-relaxed"
                                  style={{ color: "var(--tx-2)" }}
                                >
                                  {row.value.trim() === "" ? (
                                    <span style={{ color: "var(--tx-5)" }}>Sin completar</span>
                                  ) : (
                                    row.value
                                  )}
                                </dd>
                                <dd className="m-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => go(FIELD_STEP[row.key], row.key)}
                                    aria-label={`Editar ${FIELD_WORD[row.key]}`}
                                  >
                                    Editar
                                  </Button>
                                </dd>
                              </div>
                              <Hairline />
                            </div>
                          ))}
                        </dl>

                        <details
                          className="rounded-[var(--r-sm)]"
                          style={{ background: "var(--srf-2)", border: "1px solid var(--line-1)" }}
                        >
                          <summary
                            className="font-mono-tech cursor-pointer list-none px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-[160ms] hover:text-white"
                            style={{ color: "var(--tx-4)" }}
                          >
                            Ver el mensaje que se envía
                          </summary>
                          <div
                            className="font-mono-tech whitespace-pre-line px-4 pb-4 text-[12px] leading-relaxed"
                            style={{ color: "var(--tx-4)" }}
                          >
                            {buildMessage(form)}
                          </div>
                        </details>

                        <p
                          className="font-mono-tech m-0 text-[11px] uppercase tracking-[0.14em]"
                          style={{ color: "var(--tx-5)" }}
                        >
                          Vas a abrir WhatsApp con este mensaje ya escrito. Podés revisarlo antes de enviarlo.
                        </p>

                        {/* Un solo contenedor de alto fijo: sin salto de layout entre estados */}
                        <div className="relative h-14">
                          <AnimatePresence mode="wait" initial={false}>
                            {formValid ? (
                              <motion.div
                                key="send"
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.32, ease: EASE.expo }}
                              >
                                <Button
                                  variant="whatsapp"
                                  size="lg"
                                  full
                                  href={buildWhatsAppUrl(form)}
                                  external
                                  onClick={handleSent}
                                  icon={<WhatsAppIcon className="h-5 w-5" />}
                                  iconPosition="left"
                                  className="shadow-[0_8px_30px_rgba(37,211,102,0.18)]"
                                >
                                  Enviar por WhatsApp
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="wait"
                                className="absolute inset-0 flex items-center justify-center gap-3 rounded-[var(--r-full)] text-sm font-semibold select-none"
                                style={{ background: "#1a1a1a", border: "1px solid var(--line-1)", color: "var(--tx-5)" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.32, ease: EASE.expo }}
                                aria-live="polite"
                              >
                                <WhatsAppIcon className="h-5 w-5" />
                                Completá los campos obligatorios
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <p
                          className="m-0 flex items-center justify-center gap-2 text-center text-xs"
                          style={{ color: "var(--tx-4)" }}
                        >
                          <ClipIcon />
                          Se abre WhatsApp con tu consulta escrita. Si tenés fotos o el archivo, adjuntalos ahí mismo.
                        </p>
                      </div>
                    )}
                  </StepPanel>
                </motion.div>
              </AnimatePresence>

              {/* ---------- Navegación entre pasos ---------- */}
              {step < STEPS.length - 1 && (
                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {step > 0 ? (
                    <Button variant="ghost" onClick={() => go(step - 1)} icon={<ArrowLeft />} iconPosition="left">
                      Volver
                    </Button>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => go(step + 1)}
                      disabled={!canContinue}
                      aria-describedby={!canContinue ? "paso-falta" : undefined}
                      icon={<ArrowRight />}
                    >
                      Continuar
                    </Button>
                    <p
                      id="paso-falta"
                      aria-live="polite"
                      className="font-mono-tech m-0 min-h-[14px] text-[11px] uppercase tracking-[0.14em] sm:text-right"
                      style={{ color: "var(--tx-5)" }}
                    >
                      {!canContinue ? `Falta: ${missing.map((m) => FIELD_WORD[m]).join(", ")}` : ""}
                    </p>
                  </div>
                </div>
              )}

              {step === STEPS.length - 1 && (
                <div>
                  <Button variant="ghost" onClick={() => go(step - 1)} icon={<ArrowLeft />} iconPosition="left">
                    Volver
                  </Button>
                </div>
              )}
            </form>
          </Surface>
        </div>

        {/* ---------- Vías alternativas ---------- */}
        <aside className="lg:sticky" style={{ top: "calc(var(--header-h) + 32px)" }} aria-label="Contacto directo">
          <Surface padding="md" spotlight={false}>
            <MonoLabel rule>Contacto directo</MonoLabel>
            <h3 className="t-h3 mt-4 text-white">¿Preferís hablar directo?</h3>
            <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0 text-sm" style={{ color: "var(--tx-3)" }}>
              <li className="flex flex-col gap-1">
                <MonoLabel>WhatsApp</MonoLabel>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors duration-[160ms] hover:text-white"
                >
                  +54 9 11 6125 6413
                  <span className="sr-only"> (abre en una pestaña nueva)</span>
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <MonoLabel>Email</MonoLabel>
                <a
                  href="mailto:snjsoluciones@gmail.com"
                  className="w-fit break-all transition-colors duration-[160ms] hover:text-white"
                >
                  snjsoluciones@gmail.com
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <MonoLabel>Taller</MonoLabel>
                <span>General Pacheco, Buenos Aires</span>
              </li>
              <li className="flex flex-col gap-1">
                <MonoLabel>Zona</MonoLabel>
                <span>Tigre · Zona Norte GBA · CABA</span>
              </li>
            </ul>
            <Hairline className="my-5" />
            <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--tx-4)" }}>
              Si preferís, mandanos un audio o una foto de la pieza por WhatsApp.
            </p>
            <div className="mt-5">
              <Button
                variant="whatsapp"
                full
                href={WHATSAPP_DIRECT_URL}
                external
                icon={<WhatsAppIcon className="h-5 w-5" />}
                iconPosition="left"
              >
                Abrir WhatsApp
              </Button>
            </div>
          </Surface>
        </aside>
      </div>
    </Section>
  );
}
