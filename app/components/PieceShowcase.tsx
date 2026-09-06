"use client";

// Franja de piezas reales: 4 fotos del taller (llaveros Castrol, estuches AiM Solo 2
// personalizados) en su propia sección, más abajo en la página, entre Cómo Funciona y
// Contacto. A diferencia del intento anterior (fotos flotando encima de la Galería,
// position:absolute — terminó tapando contenido en algunas pantallas), esto es una fila
// normal, sin superponerse a nada: cero riesgo de tapar otra sección.
import Image from "next/image";
import Reveal from "./ui/Reveal";
import Stagger from "./ui/Stagger";
import MonoLabel from "./ui/MonoLabel";
import Hairline from "./ui/Hairline";

type Piece = { src: string; alt: string; label: string };

const PIECES: readonly Piece[] = [
  { src: "/images/float-llavero-castrol.jpg", alt: "Llavero personalizado de un bidón Castrol, impreso en 3D", label: "Llavero Castrol" },
  { src: "/images/float-estuche-valen.jpg", alt: "Estuche a medida para AiM Solo 2 y cámara, con el nombre del piloto grabado", label: "Estuche a medida" },
  { src: "/images/float-llavero-castrol-car.jpg", alt: "Llavero de un auto de carrera Castrol, junto a un estuche GoPro", label: "Llavero de carrera" },
  { src: "/images/float-estuche-interior.jpg", alt: "Interior de un estuche a medida, con la espuma recortada para cada pieza", label: "Espuma a medida" },
];

export default function PieceShowcase() {
  return (
    <div className="relative" style={{ background: "var(--srf-1)" }}>
      <Hairline className="absolute top-0 left-0" />
      <div className="shell" style={{ paddingBlock: "clamp(3rem, 2rem + 4vw, 6rem)" }}>
        <Reveal>
          <MonoLabel rule>Del taller</MonoLabel>
        </Reveal>

        <Stagger wrap start={0.08} className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {PIECES.map((piece) => (
            <figure key={piece.src} className="m-0">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-lg)] border"
                style={{ borderColor: "var(--line-2)", background: "var(--srf-2)" }}
              >
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  quality={72}
                  className="object-cover"
                />
              </div>
              <figcaption
                className="font-mono-tech mt-3 text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--tx-4)" }}
              >
                {piece.label}
              </figcaption>
            </figure>
          ))}
        </Stagger>
      </div>
      <Hairline className="absolute bottom-0 left-0" />
    </div>
  );
}
