"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, UserRole } from "@/lib/types";
import type { User as SupabaseUser, AuthChangeEvent, Session, SupabaseClient } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (userData: Partial<User> & { password?: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  role: null,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
});

function translateError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("rate_limit"))
    return "Həddən artıq çox cəhd. Zəhmət olmasa bir neçə dəqiqə gözləyin.";
  if (lower.includes("invalid login credentials") || lower.includes("invalid email or password"))
    return "E-poçt və ya şifrə yanlışdır.";
  if (lower.includes("user already registered") || lower.includes("already registered") || lower.includes("already exists"))
    return "Bu e-poçt ünvanı artıq qeydiyyatdan keçib.";
  if (lower.includes("email not confirmed") || lower.includes("email not verified"))
    return "E-poçt təsdiqlənməyib. Zəhmət olmasa e-poçt qutunuzu yoxlayın.";
  if (lower.includes("password"))
    return "Şifrə tələblərə cavab vermir. Minimum 6 simvol olmalıdır.";
  return "Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.";
}

function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    fullName: (meta.fullName as string) || supabaseUser.email?.split("@")[0] || "İstifadəçi",
    email: supabaseUser.email || "",
    phone: (meta.phone as string) || "",
    whatsapp: (meta.whatsapp as string) || "",
    role: (meta.role as UserRole) || "supplier",
    avatarUrl: (meta.avatarUrl as string) || "",
    isActive: true,
    isApproved: (meta.isApproved as boolean) || false,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client: SupabaseClient | null = createClient();

    if (!client) {
      setLoading(false);
      return;
    }

    client.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(mapSupabaseUser(session?.user ?? null));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const client = createClient();
    if (!client) return { error: "Autentifikasiya xidməti konfiqurə edilməyib" };
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error.message) };
    if (data.user) setUser(mapSupabaseUser(data.user));
    return {};
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<{ error?: string }> => {
    if (!userData.email || !userData.password) return { error: "E-mail və şifrə tələb olunur" };
    const client = createClient();
    if (!client) return { error: "Autentifikasiya xidməti konfiqurə edilməyib" };

    const { data, error } = await client.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          fullName: userData.fullName || "",
          phone: userData.phone || "",
          role: userData.role || "supplier",
        },
      },
    });

    if (error) return { error: translateError(error.message) };
    if (data.user) setUser(mapSupabaseUser(data.user));
    return {};
  };

  const logout = async () => {
    const client = createClient();
    if (client) await client.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, role: user?.role || null, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
