import { createClient } from "@/lib/supabase/server";

interface Category {
  id: string;
  name: string;
}

export default async function TestSupabasePage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Supabase xətası</h1>
        <p>Supabase server konfiqurə edilməyib.</p>
      </main>
    );
  }

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
          {categories.map((category: Category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
