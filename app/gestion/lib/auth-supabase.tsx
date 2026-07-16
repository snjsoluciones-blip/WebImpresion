"use client";

import { useEffect, useState, ReactNode } from "react";
import { Socio } from "./types";
import { AuthContext } from "./auth";
import { supabase } from "./supabaseClient";
import { buscarUsuario } from "./acceso";

// La identidad y el permiso salen SIEMPRE de la lista de autorizados (acceso.ts),
// no de metadata de la cuenta. Si el email no está en la lista, no hay socio => no entra.
function socioFromUser(user: { email?: string | null } | null | undefined): Socio | null {
  return buscarUsuario(user?.email)?.socio ?? null;
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Socio | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUsuario(socioFromUser(data.session?.user));
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(socioFromUser(session?.user));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    if (!supabase) return false;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    const socio = socioFromUser(data.user);
    if (!socio) {
      // El email no está en la lista de autorizados (acceso.ts): se cierra la sesión.
      await supabase.auth.signOut();
      return false;
    }
    setUsuario(socio);
    return true;
  }

  function logout() {
    supabase?.auth.signOut();
    setUsuario(null);
  }

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>
  );
}
