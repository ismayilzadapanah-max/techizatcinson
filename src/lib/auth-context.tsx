"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, UserRole } from "@/lib/types";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";

let supabaseClient: ReturnType<typeof import("@/lib/supabase/client").createClient> | null = null;

const getSupabaseClient = async () => {
  if (!supabaseClient) {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      supabaseClient = createClient();
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      return null;
    }
  }
  return supabaseClient;
};

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
  const [supabase, setSupabase] = useState<ReturnType<typeof getSupabaseClient> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Session-u yoxla
  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await getSupabaseClient();
        if (!client) {
          console.warn("Supabase client not available - auth features disabled");
          setLoading(false);
          return () => {};
        }

        setSupabase(client);

        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            setUser(mapSupabaseUser(session.user));
          }

          // Auth state dəyişikliyini dinlə
          const { data: { subscription } } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
              setUser(mapSupabaseUser(session.user));
            } else {
              setUser(null);
            }
          });

          setLoading(false);
          return () => subscription.unsubscribe();
        } catch (authError) {
          console.error("Auth session check error:", authError);
          setError("Authentication service temporarily unavailable");
          setLoading(false);
          return () => {};
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError("Failed to initialize authentication");
        setLoading(false);
        return () => {};
      }
    };

    let unsubscribe: (() => void) | null = null;
    initAuth().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const client = await getSupabaseClient();
    if (!client) return { error: "Autentifikasiya xidməti hazır deyil" };
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error.message) };
    if (data.user) setUser(mapSupabaseUser(data.user));
    return {};
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<{ error?: string }> => {
    if (!userData.email || !userData.password) {
      return { error: "E-mail və şifrə tələb olunur" };
    }

    const client = await getSupabaseClient();
    if (!client) return { error: "Autentifikasiya xidməti hazır deyil" };

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
    const client = await getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
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
