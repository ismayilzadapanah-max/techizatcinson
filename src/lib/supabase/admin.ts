import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Module səviyyəsində createClient çağırılmır —
// undefined key olduqda Next.js-i çökdürür.
// Bunun əvəzinə lazy getter istifadə edilir.

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL tapılmadı.");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY tapılmadı.");

  _client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}
