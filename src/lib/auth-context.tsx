"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, UserRole } from "@/lib/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

// Supabase xəta mesajlarını Azərbaycan dilinə tərcümə
function translateError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("rate_limit")) {
    return "Həddən artıq çox cəhd. Zəhmət olmasa bir neçə dəqiqə gözləyin və yenidən yoxlayın.";
  }
  if (lower.includes("invalid login credentials") || lower.includes("invalid email or password")) {
    return "E-poçt və ya şifrə yanlışdır.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered") || lower.includes("already exists")) {
    return "Bu e-poçt ünvanı artıq qeydiyyatdan keçib.";
  }
  if (lower.includes("email not confirmed") || lower.includes("email not verified")) {
    return "E-poçt təsdiqlənməyib. Zəhmət olmasa e-poçt qutunuzu yoxlayın.";
  }
  if (lower.includes("password")) {
    return "Şifrə tələblərə cavab vermir. Minimum 8 simvol olmalıdır.";
  }
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
  const supabase = createClient();

  // Session-u yoxla
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch {
        // Sessiya yoxdur
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Auth state dəyişikliyini dinlə
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error.message) };
    if (data.user) setUser(mapSupabaseUser(data.user));
    return {};
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<{ error?: string }> => {
    if (!userData.email || !userData.password) {
      return { error: "E-mail və şifrə tələb olunur" };
    }

    const { data, error } = await supabase.auth.signUp({
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
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
