"use client";

import { ReactNode } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../lib/auth";
import { LocalAuthProvider } from "../lib/auth-local";
import { SupabaseAuthProvider } from "../lib/auth-supabase";
import { LocalStoreProvider } from "../lib/store-local";
import { SupabaseStoreProvider } from "../lib/store-supabase";
import LoginScreen from "./LoginScreen";
import LoginScreenSupabase from "./LoginScreenSupabase";
import Nav from "./Nav";

function Inner({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();

  if (!usuario) return isSupabaseConfigured ? <LoginScreenSupabase /> : <LoginScreen />;

  const Store = isSupabaseConfigured ? SupabaseStoreProvider : LocalStoreProvider;

  return (
    <Store>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </Store>
  );
}

export default function GestionShell({ children }: { children: ReactNode }) {
  const Auth = isSupabaseConfigured ? SupabaseAuthProvider : LocalAuthProvider;

  return (
    <Auth>
      <Inner>{children}</Inner>
    </Auth>
  );
}
