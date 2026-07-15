"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth";
import { SOCIOS, Socio } from "../lib/types";

export default function LoginScreen() {
  const { login } = useAuth();
  const [socio, setSocio] = useState<Socio>(SOCIOS[0]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(socio, password);
    if (!ok) setError("Contraseña incorrecta.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-white/10 rounded-xl p-8 bg-white/[0.03]"
      >
        <h1 className="text-xl font-medium mb-1">SNJ Gestión</h1>
        <p className="text-sm text-white/50 mb-6">Ingresá con tu cuenta</p>

        <label className="block text-sm mb-1 text-white/70">Socio</label>
        <select
          value={socio}
          onChange={(e) => setSocio(e.target.value as Socio)}
          className="w-full mb-4 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
        >
          {SOCIOS.map((s) => (
            <option key={s} value={s} className="bg-black">
              {s}
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1 text-white/70">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mb-2 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
        />

        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 rounded-md bg-white text-black py-2 font-medium hover:bg-white/90 transition"
        >
          Entrar
        </button>

        <p className="text-xs text-white/30 mt-6">
          Versión de prueba local. La contraseña es la misma para los 3 socios hasta que
          conectemos las cuentas reales.
        </p>
      </form>
    </div>
  );
}
