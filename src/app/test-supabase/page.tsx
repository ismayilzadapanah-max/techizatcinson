import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Supabase xətası</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Supabase bağlantısı işləyir</h1>

      {!categories || categories.length === 0 ? (
        <p>Hələ kateqoriya əlavə edilməyib.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
