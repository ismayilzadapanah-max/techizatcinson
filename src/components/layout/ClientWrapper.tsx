"use client";

import { AuthProvider } from "@/lib/auth-context";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
