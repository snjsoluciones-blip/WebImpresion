"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  if (!usuario) return isSupabaseConfigured ? <LoginScreenSupabase /> : <LoginScreen />;

  const Store = isSupabaseConfigured ? SupabaseStoreProvider : LocalStoreProvider;

  return (
    <Store>
      <div className="min-h-screen">
        <Nav />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 py-8"
        >
          {children}
        </motion.main>
      </div>
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
