"use client";

import { useEffect, useState, ReactNode } from "react";
import { Socio, SOCIOS } from "./types";
import { AuthContext } from "./auth";
import { supabase } from "./supabaseClient";

// Nombre a mostrar: si la cuenta tiene un socio asignado lo usa; si no (cuenta
// compartida tipo "admin"), muestra "Admin". Cualquier usuario autenticado entra.
function nombreDeUsuario(
  user: { user_metadata?: Record<string, unknown> } | null | undefined
): string | null {
  if (!user) return null;
  const socio = user.user_metadata?.socio;
  if (typeof socio === "string" && (SOCIOS as readonly string[]).includes(socio)) {
    return socio;
  }
  return "Admin";
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUsuario(nombreDeUsuario(data.session?.user));
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(nombreDeUsuario(session?.user));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    if (!supabase) return false;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    setUsuario(nombreDeUsuario(data.user));
    return true;
  }

  async function signUp(
    email: string,
    password: string,
    socio: Socio
  ): Promise<{ ok: boolean; error?: string }> {
    if (!supabase) return { ok: false, error: "Supabase no está configurado." };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { socio } },
    });
    if (error) return { ok: false, error: error.message };
    if (data.session?.user) {
      setUsuario(socio);
    }
    return { ok: true };
  }

  function logout() {
    supabase?.auth.signOut();
    setUsuario(null);
  }

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ usuario, login, signUp, logout }}>{children}</AuthContext.Provider>
  );
}
