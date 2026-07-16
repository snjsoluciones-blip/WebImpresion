"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { LocalStoreProvider } from "../lib/store-local";
import { SupabaseStoreProvider } from "../lib/store-supabase";
import Nav from "./Nav";

// Sin login: se entra directo por la dirección secreta y los datos se comparten
// entre todos (acceso público a la tabla, controlado en Supabase).
export default function GestionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
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
