"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "541161256413";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  descripcion: string;
  medidas: string;
  material: string;
}

const inputBase =
  "w-full bg-[#1a1a1a] border border-white/[0.09] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors duration-200";

const labelBase = "block text-xs font-medium text-white/45 mb-2 uppercase tracking-wider";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    servicio: "Modelado + Impresión",
    descripcion: "",
    medidas: "",
    material: "PLA",
  });
  const [formValid, setFormValid] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    setFormValid(
      updated.nombre.trim() !== "" &&
      updated.email.trim() !== "" &&
      updated.telefono.trim() !== "" &&
      updated.descripcion.trim() !== "" &&
      updated.medidas.trim() !== ""
    );
  };

  const buildWhatsAppUrl = () => {
    const msg = `Hola SNJ Soluciones! 👋 Quiero solicitar una pieza 3D.

👤 Nombre: ${form.nombre.trim()}
📧 Email: ${form.email.trim()}
📱 Teléfono: ${form.telefono.trim()}

📋 Servicio: ${form.servicio}
📝 Descripción: ${form.descripcion.trim()}
📐 Medidas: ${form.medidas.trim()}
🧪 Material: ${form.material}

Quedo a disposición para coordinar. Gracias!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="contacto" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Contacto
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Solicitá tu Pieza
          </h2>
          <p className="text-white/45 leading-relaxed">
            Completá el formulario y te contactamos por WhatsApp con toda la información.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
          className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 md:p-10 flex flex-col gap-7"
        >
          {/* Nombre + Email */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nombre" className={labelBase}>
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={handleChange}
                className={inputBase}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className={labelBase}>
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                className={inputBase}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className={labelBase}>
              Teléfono / WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              placeholder="Ej: 11 6125 6413"
              value={form.telefono}
              onChange={handleChange}
              className={inputBase}
              autoComplete="tel"
              required
            />
          </div>

          {/* Tipo de servicio */}
          <div>
            <label htmlFor="servicio" className={labelBase}>
              Tipo de servicio <span className="text-red-400">*</span>
            </label>
            <select
              id="servicio"
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className={inputBase}
              style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff60' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
              required
            >
              <option value="Modelado + Impresión">Modelado + Impresión</option>
              <option value="Solo Impresión">Solo Impresión</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className={labelBase}>
              Descripción detallada de la pieza <span className="text-red-400">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describí la pieza: función, características especiales, tolerancias necesarias, cantidad..."
              value={form.descripcion}
              onChange={handleChange}
              rows={5}
              className={`${inputBase} resize-none`}
              required
            />
          </div>

          {/* Medidas + Material */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="medidas" className={labelBase}>
                Medidas aproximadas <span className="text-red-400">*</span>
              </label>
              <input
                id="medidas"
                type="text"
                name="medidas"
                placeholder="Ej: 10cm × 5cm × 3cm"
                value={form.medidas}
                onChange={handleChange}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label htmlFor="material" className={labelBase}>
                Material preferido <span className="text-red-400">*</span>
              </label>
              <select
                id="material"
                name="material"
                value={form.material}
                onChange={handleChange}
                className={inputBase}
                style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff60' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
                required
              >
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
                <option value="TPU">TPU</option>
                <option value="No sé, asesorarme">No sé, asesorarme</option>
              </select>
            </div>
          </div>

          {/* WhatsApp button */}
          {formValid ? (
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98]"
              style={{ background: "#25D366" }}
              onMouseOver={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#22c05c")}
              onMouseOut={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#25D366")}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Enviar por WhatsApp
            </a>
          ) : (
            <div
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm text-white/30 cursor-not-allowed select-none"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Completá los campos obligatorios
            </div>
          )}

          <p className="text-xs text-white/40 text-center mt-2">
            Al hacer clic se abrirá WhatsApp con tu consulta pre-completada.
          </p>
          <p className="text-xs text-white/40 text-center">
            📎 Si tenés una imagen de referencia, enviala directamente en el chat de WhatsApp una vez abierto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
