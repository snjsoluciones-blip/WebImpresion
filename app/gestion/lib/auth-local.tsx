"use client";

import { useEffect, useState, ReactNode } from "react";
import { Socio, SOCIOS } from "./types";
import { AuthContext } from "./auth";

// Modo local (sin Supabase): contraseña compartida solo para probar la app en la compu.
// Se reemplaza automáticamente por el login real (Supabase Auth) apenas se configuren
// las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
const STAGE1_PASSWORD = "snj2026";
const STORAGE_KEY = "snj-gestion-session";

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Socio | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (SOCIOS as readonly string[]).includes(saved)) {
      setUsuario(saved as Socio);
    }
    setReady(true);
  }, []);

  function login(socio: string, password: string): boolean {
    if (!(SOCIOS as readonly string[]).includes(socio)) return false;
    if (password !== STAGE1_PASSWORD) return false;
    setUsuario(socio as Socio);
    window.localStorage.setItem(STORAGE_KEY, socio);
    return true;
  }

  function logout() {
    setUsuario(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  if (!ready) return null;

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}
