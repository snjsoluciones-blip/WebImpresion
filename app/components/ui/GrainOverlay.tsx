/**
 * Grano fijo a pantalla completa: elimina el banding de los gradientes radiales sobre negro.
 * feTurbulence embebido como data-URI (ver `.grain-fixed` en globals.css): cero requests, cero JS.
 * Se monta UNA sola vez desde page.tsx. Estático siempre. Server component.
 */
export default function GrainOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return <div aria-hidden="true" className="grain-fixed" style={{ opacity }} />;
}
