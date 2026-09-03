import HairlineAnimated from "./HairlineAnimated";

export type HairlineProps = {
  orientation?: "h" | "v";
  /** Entra con scaleX 0→1 (origen izquierda) al llegar al viewport. */
  animate?: boolean;
  className?: string;
};

/**
 * Línea de 1px por gradiente (nunca corta en seco contra el borde).
 * Server component; sólo con `animate` delega en la parte cliente.
 * Para la vertical, el contenedor tiene que darle altura (self-stretch / h-full).
 */
export default function Hairline({ orientation = "h", animate = false, className = "" }: HairlineProps) {
  if (animate) return <HairlineAnimated orientation={orientation} className={className} />;
  return (
    <div aria-hidden="true" className={`${orientation === "v" ? "hairline-v" : "hairline"} ${className}`} />
  );
}
