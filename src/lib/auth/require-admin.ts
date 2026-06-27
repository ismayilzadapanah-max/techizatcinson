"use server";

import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<void> {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Supabase client yaradıla bilmədi.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Giriş tələb olunur.");
  }

  if (user.user_metadata?.role !== "admin") {
    throw new Error("Bu əməliyyat yalnız adminlər üçündür.");
  }
}
