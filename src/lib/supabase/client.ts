import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// createBrowserClient sessiyaları cookie-də saxlayır ki,
// server action-lar da supabase.auth.getUser() ilə oxuya bilsin.
let _client: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  try {
    _client = createBrowserClient(url, key);
  } catch {
    _client = null;
  }

  return _client;
}
