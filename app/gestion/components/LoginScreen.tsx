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
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm g-card rounded-2xl p-8"
      >
        <h1 className="text-xl font-medium mb-1">SNJ Gestión</h1>
        <p className="text-sm text-neutral-500 mb-6">Ingresá con tu cuenta</p>

        <label className="block text-sm mb-1 text-neutral-600">Socio</label>
        <select
          value={socio}
          onChange={(e) => setSocio(e.target.value as Socio)}
          className="w-full mb-4 rounded-md bg-white border border-black/10 px-3 py-2 outline-none focus:border-violet-400"
        >
          {SOCIOS.map((s) => (
            <option key={s} value={s} className="bg-white text-neutral-800">
              {s}
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1 text-neutral-600">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mb-2 rounded-md bg-white border border-black/10 px-3 py-2 outline-none focus:border-violet-400"
        />

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 rounded-md g-btn-primary py-2 font-medium transition"
        >
          Entrar
        </button>

        <p className="text-xs text-neutral-400 mt-6">
          Versión de prueba local. La contraseña es la misma para los 3 socios hasta que
          conectemos las cuentas reales.
        </p>
      </form>
    </div>
  );
}
