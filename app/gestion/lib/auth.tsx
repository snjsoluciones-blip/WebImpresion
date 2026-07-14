"use client";

import { createContext, useContext } from "react";
import { Socio } from "./types";

export interface AuthCtx {
  usuario: Socio | null;
  login: (identifier: string, password: string) => boolean | Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}
