"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createUserByAdmin(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // Admin yoxlaması — server tərəfdə session-dan
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) return { error: "Giriş tələb olunur" };
  if (currentUser.user_metadata?.role !== "admin") {
    return { error: "Bu əməliyyat yalnız adminlər üçündür" };
  }

  // Form məlumatları
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const fullName = (formData.get("fullName") as string)?.trim() || "";
  const phone = (formData.get("phone") as string)?.trim() || null;
  const companyName = (formData.get("companyName") as string)?.trim() || "";
  const restaurantName =
    (formData.get("restaurantName") as string)?.trim() || "";

  if (!email || !password || !role) {
    return { error: "E-mail, şifrə və rol tələb olunur" };
  }

  if (password.length < 6) {
    return { error: "Şifrə minimum 6 simvol olmalıdır" };
  }

  // Supabase Auth-da user yarat — şifrə YALNIZ burada saxlanır
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: phone || "",
        role,
      },
    });

  if (authError || !authData.user) {
    return { error: authError?.message || "İstifadəçi yaradıla bilmədi" };
  }

  const userId = authData.user.id;

  // profiles table-a yaz
  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    role,
    full_name: fullName,
    email,
    phone,
    is_active: true,
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return { error: `Profil xətası: ${profileError.message}` };
  }

  // Supplier üçün əlavə cədvəllər
  if (role === "supplier") {
    const { error: supplierError } = await supabaseAdmin
      .from("supplier_profiles")
      .insert({
        id: userId,
        user_id: userId,
        company_name: companyName,
        contact_person: fullName,
        email,
        phone: phone || "",
        approval_status: "approved",
        rating: 0,
        review_count: 0,
        product_count: 0,
      });

    if (supplierError) {
      return {
        error: `Təchizatçı profili xətası: ${supplierError.message}`,
      };
    }

    // Supplier sahibi olaraq team member əlavə et
    await supabaseAdmin.from("supplier_team_members").insert({
      supplier_id: userId,
      user_id: userId,
      role: "owner",
      invited_by: userId,
      is_active: true,
    });
  }

  // Restaurant üçün əlavə cədvəl
  if (role === "restaurant") {
    const { error: restaurantError } = await supabaseAdmin
      .from("restaurant_profiles")
      .insert({
        id: userId,
        user_id: userId,
        restaurant_name: restaurantName,
        contact_person: fullName,
        email,
        phone: phone || "",
        approval_status: "approved",
      });

    if (restaurantError) {
      return {
        error: `Restoran profili xətası: ${restaurantError.message}`,
      };
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}
