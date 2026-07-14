"use client";

import { useEffect, useState, ReactNode } from "react";
import { Socio, SOCIOS } from "./types";
import { AuthContext } from "./auth";
import { supabase } from "./supabaseClient";

function socioFromUser(user: { user_metadata?: Record<string, unknown> } | null | undefined): Socio | null {
  const socio = user?.user_metadata?.socio;
  if (typeof socio === "string" && (SOCIOS as readonly string[]).includes(socio)) {
    return socio as Socio;
  }
  return null;
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
      // La cuenta existe pero no tiene asignado a qué socio corresponde.
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

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}
