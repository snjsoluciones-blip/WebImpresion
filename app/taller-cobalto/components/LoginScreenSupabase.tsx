"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth";
import { SOCIOS, Socio } from "../lib/types";

export default function LoginScreenSupabase() {
  const { login, signUp } = useAuth();
  const [modo, setModo] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [socio, setSocio] = useState<Socio>(SOCIOS[0]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError("Email o contraseña incorrectos.");
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!signUp) return;
    setLoading(true);
    const result = await signUp(email, password, socio);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "No se pudo crear la cuenta.");
      return;
    }
    setInfo("Cuenta creada. Si te pide confirmar el email, revisá tu casilla y después entrá con tu contraseña.");
    setModo("login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={modo === "login" ? handleLogin : handleSignUp}
        className="w-full max-w-sm border border-white/10 rounded-xl p-8 bg-white/[0.03]"
      >
        <h1 className="text-xl font-medium mb-1">SNJ Gestión</h1>
        <p className="text-sm text-white/50 mb-6">
          {modo === "login" ? "Ingresá con tu cuenta" : "Creá tu cuenta"}
        </p>

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

        {modo === "signup" && (
          <>
            <label className="block text-sm mb-1 text-white/70">Sos</label>
            <select
              value={socio}
              onChange={(e) => setSocio(e.target.value as Socio)}
              className="w-full mb-2 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
            >
              {SOCIOS.map((s) => (
                <option key={s} value={s} className="bg-black">
                  {s}
                </option>
              ))}
            </select>
          </>
        )}

        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
        {info && <p className="text-sm text-green-300 mb-2">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-md bg-white text-black py-2 font-medium hover:bg-white/90 transition disabled:opacity-50"
        >
          {loading ? "Un momento…" : modo === "login" ? "Entrar" : "Crear cuenta"}
        </button>

        <button
          type="button"
          onClick={() => {
            setModo(modo === "login" ? "signup" : "login");
            setError("");
            setInfo("");
          }}
          className="w-full mt-3 text-sm text-white/50 hover:text-white"
        >
          {modo === "login" ? "¿No tenés cuenta? Creala acá" : "¿Ya tenés cuenta? Entrá acá"}
        </button>
      </form>
    </div>
  );
}
