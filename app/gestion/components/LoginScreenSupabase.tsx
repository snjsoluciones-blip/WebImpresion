"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function LoginScreenSupabase() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError("Email o contraseña incorrectos, o no tenés acceso.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm border border-white/10 rounded-xl p-8 bg-white/[0.03]"
      >
        <h1 className="text-xl font-medium mb-1">SNJ Gestión</h1>
        <p className="text-sm text-white/50 mb-6">Ingresá con tu cuenta</p>

        <label className="block text-sm mb-1 text-white/70">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@email.com"
          className="w-full mb-4 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
        />

        <label className="block text-sm mb-1 text-white/70">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mb-4 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
        />

        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-md bg-white text-black py-2 font-medium hover:bg-white/90 transition disabled:opacity-50"
        >
          {loading ? "Un momento…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
