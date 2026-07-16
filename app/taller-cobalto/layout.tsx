import type { Metadata } from "next";
import GestionShell from "./components/GestionShell";
import "./gestion.css";

export const metadata: Metadata = {
  title: "SNJ Gestión",
  robots: { index: false, follow: false },
};

export default function GestionLayout({ children }: { children: React.ReactNode }) {
  return <GestionShell>{children}</GestionShell>;
}
