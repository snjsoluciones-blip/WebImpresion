import { Accordion, Button, Hairline, MonoLabel, Reveal, Section, SectionHeading, WhatsAppIcon } from "./ui";

/**
 * #faq · 07 — Preguntas frecuentes (spec §80-82).
 * Server component: no hay hooks acá; Accordion / Reveal / SectionHeading ya son "use client".
 *
 * Una única fuente de datos (FAQ) alimenta tanto lo que se ve en pantalla como el JSON-LD
 * FAQPage local (§82), así las 7 preguntas y respuestas son exactamente las mismas en ambos.
 * Todas las respuestas usan SOLO hechos ya publicados en la web: nada de precios, plazos
 * genéricos ni garantías (§81).
 */

const WHATSAPP_NUMBER = "541161256413";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola SNJ, tengo una consulta sobre una pieza."
)}`;

type Inline = string | { text: string; href: string };
type Block = { p: Inline[] } | { list: { label: string; text: string }[] };
type FaqEntry = { q: string; a: Block[] };

const FAQ: FaqEntry[] = [
  {
    q: "¿Qué necesito para pedir una pieza?",
    a: [
      {
        p: [
          "Una descripción de la pieza, las medidas aproximadas, el material que preferís y, si tenés, fotos de referencia. Con eso ya podemos entender qué necesitás.",
        ],
      },
      {
        p: [
          "Si ya contás con el modelo 3D, alcanza con que nos envíes el archivo STL o STEP y nos encargamos de la impresión.",
        ],
      },
    ],
  },
  {
    q: "¿Y si no tengo el modelo 3D?",
    a: [
      {
        p: [
          "No hace falta. Con el servicio de ",
          { text: "Modelado + Impresión", href: "#servicios" },
          " lo modelamos nosotros a partir de tu idea: nos contás qué necesitás, creamos el modelo digital y lo revisás antes de que se imprima.",
        ],
      },
      { p: ["Es nuestro servicio más elegido, tanto para ideas nuevas como para repuestos."] },
    ],
  },
  {
    q: "¿Qué materiales manejan?",
    a: [
      {
        p: [
          "Trabajamos con cuatro materiales: PLA, PETG, ABS y TPU. Cada uno tiene su ficha con propiedades, temperatura que soporta y usos recomendados en la sección de ",
          { text: "materiales", href: "#materiales" },
          ".",
        ],
      },
      { p: ["Todas las piezas salen de nuestras impresoras Bambu Lab P2S."] },
    ],
  },
  {
    q: "¿Qué material me conviene?",
    a: [
      { p: ["Depende de lo que tenga que aguantar la pieza:"] },
      {
        list: [
          {
            label: "PLA",
            text: "detalle alto, hasta ~55 °C, uso interior. Ideal para prototipos, maquetas, piezas decorativas y trofeos.",
          },
          {
            label: "PETG",
            text: "resistente, hasta ~75 °C, apto exterior. Ideal para repuestos funcionales, soportes y piezas de uso diario.",
          },
          {
            label: "ABS",
            text: "muy resistente, hasta ~95 °C, apto exterior. Ideal para piezas de auto y moto, carcasas y repuestos cerca de motores.",
          },
          {
            label: "TPU",
            text: "flexible, antigolpes y antiabrasión. Ideal para juntas, fundas, ruedas, protectores y bujes.",
          },
        ],
      },
      {
        p: [
          "Si no estás seguro, ",
          { text: "contanos qué necesitás", href: "#contacto" },
          " y te asesoramos sin compromiso.",
        ],
      },
    ],
  },
  {
    q: "¿Hacen series o solo unidades?",
    a: [
      { p: ["Las dos cosas. Hacemos piezas únicas y también series cortas."] },
      {
        p: [
          "Un ejemplo real: para MC Racing imprimimos una tanda de 500 llaveros con diseño y modelado 100 % a medida del logo del cliente, terminados en menos de una semana. Podés verlos en la ",
          { text: "galería", href: "#galeria" },
          ".",
        ],
      },
    ],
  },
  {
    q: "¿A qué zona llegan?",
    a: [
      { p: ["Estamos en General Pacheco, Buenos Aires, y atendemos Tigre, Zona Norte del GBA y CABA."] },
      { p: ["La consulta y el presupuesto se resuelven por WhatsApp, y una vez impresa la pieza te la enviamos."] },
    ],
  },
  {
    q: "¿Cómo sigue después de que envío el formulario?",
    a: [
      {
        p: [
          "El formulario arma el mensaje con tus datos y lo abre en WhatsApp: ahí seguimos la charla y te contesta uno de nosotros.",
        ],
      },
      {
        p: [
          "De ahí en adelante son cuatro pasos: describís tu pieza, la modelamos en 3D, confirmás el diseño y la imprimimos y te la enviamos. Está detallado en ",
          { text: "cómo funciona", href: "#como-funciona" },
          ".",
        ],
      },
    ],
  },
];

/* -------- Render en pantalla -------- */

const LINK_CLASS =
  "text-white/80 underline decoration-1 decoration-white/30 underline-offset-4 transition-colors duration-[160ms] hover:text-white hover:decoration-white";

function renderInline(parts: Inline[]) {
  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <a key={i} href={part.href} className={LINK_CLASS}>
        {part.text}
      </a>
    )
  );
}

function Answer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) =>
        "p" in block ? (
          <p key={i} className="[text-wrap:pretty]">
            {renderInline(block.p)}
          </p>
        ) : (
          <ul key={i} className="space-y-2.5 py-1">
            {block.list.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                {/* pt-[6px] centra el rótulo mono de 11px sobre la primera línea de 15px/1.625 */}
                <MonoLabel tone="bright" className="w-12 shrink-0 pt-[6px]">
                  {item.label}
                </MonoLabel>
                <span className="[text-wrap:pretty]">{item.text}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

const ITEMS = FAQ.map((entry) => ({ q: entry.q, a: <Answer blocks={entry.a} /> }));

/* -------- JSON-LD FAQPage (§82): mismas 7 preguntas y respuestas, en texto plano -------- */

function inlineToText(parts: Inline[]) {
  return parts.map((part) => (typeof part === "string" ? part : part.text)).join("");
}

function blocksToText(blocks: Block[]) {
  return blocks
    .map((block) =>
      "p" in block ? inlineToText(block.p) : block.list.map((item) => `${item.label}: ${item.text}`).join(" ")
    )
    .join(" ");
}

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((entry) => ({
    "@type": "Question",
    name: entry.q,
    acceptedAnswer: { "@type": "Answer", text: blocksToText(entry.a) },
  })),
};

export default function Faq() {
  return (
    <Section id="faq" tone="raised" labelledBy="faq-title">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
        {/* Columna izquierda: cabecera + CTA, sticky en lg+ */}
        <div className="lg:col-span-4">
          <div className="lg:sticky" style={{ top: "calc(var(--header-h) + 32px)" }}>
            {/* mb-8! pisa el margen inferior grande que SectionHeading trae por inline style:
                acá el CTA forma parte del mismo bloque que el título. */}
            <SectionHeading
              index="07"
              eyebrow="Preguntas"
              titleId="faq-title"
              title="Lo que más nos preguntan"
              lead="Respuestas cortas a las dudas más comunes antes de pedir una pieza."
              className="mb-8!"
            />
            <Reveal delay={0.25}>
              <Button
                variant="whatsapp"
                href={WHATSAPP_HREF}
                external
                icon={<WhatsAppIcon className="h-[18px] w-[18px]" />}
                iconPosition="left"
              >
                Preguntar por WhatsApp
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Hairline vertical en la columna 5 (solo lg+) */}
        <div className="relative hidden lg:col-span-1 lg:col-start-5 lg:block">
          <Hairline orientation="v" className="absolute left-1/2 top-0 h-full" />
        </div>

        {/* Columna derecha: acordeón */}
        <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <Reveal delay={0.1}>
            <div style={{ borderTop: "1px solid var(--line-1)" }}>
              <Accordion items={ITEMS} allowMultiple={false} defaultOpen={0} />
            </div>
            <p className="mt-8 text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>
              ¿Tu pregunta no está acá?{" "}
              <a href="#contacto" className={LINK_CLASS}>
                Contanos qué necesitás
              </a>{" "}
              y te contesta uno de nosotros por WhatsApp.
            </p>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD).replace(/</g, "\\u003c") }}
      />
    </Section>
  );
}
