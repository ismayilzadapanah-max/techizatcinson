"use server";

import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Giriş tələb olunur");
  }

  if (user.user_metadata?.role !== "admin") {
    throw new Error("Bu əməliyyat yalnız adminlər üçündür");
  }
}
