"use server";

// handle_new_user() trigger bütün yeni auth user-lər üçün avtomatik işləyir:
// → profiles, supplier_profiles, restaurant_profiles yaradır (user_metadata-dan oxuyur)
// Bu action yalnız trigger-in etmədiklərini edir:
// → supplier_team_members yaratmaq
// → supplier_profiles-da approval_status='approved' qoymaq

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";

type UserRole = "admin" | "supplier" | "restaurant";

export async function createUserByAdmin(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const role = String(formData.get("role") || "").trim() as UserRole;
    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const companyName = String(formData.get("companyName") || "").trim();
    const restaurantName = String(formData.get("restaurantName") || "").trim();

    if (!email || !password || !role) {
      return { success: false, message: "E-mail, şifrə və rol mütləq doldurulmalıdır." };
    }
    if (password.length < 6) {
      return { success: false, message: "Şifrə minimum 6 simvol olmalıdır." };
    }
    if (!["admin", "supplier", "restaurant"].includes(role)) {
      return { success: false, message: "Rol düzgün seçilməyib." };
    }

    const supabase = getSupabaseAdmin();

    // ── Auth user yarat ───────────────────────────────────────────────────
    // handle_new_user() trigger avtomatik olaraq:
    //   profiles, supplier_profiles, restaurant_profiles yaradır
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role,
          full_name: fullName,
          phone,
          company_name: companyName,
          restaurant_name: restaurantName,
        },
      });

    if (authError) {
      console.error("[createUserByAdmin] Auth xətası:", authError);
      const msg = authError.message.toLowerCase().includes("already registered")
        ? "E-mail artıq mövcuddur."
        : authError.message;
      return { success: false, message: msg };
    }

    const user = authData?.user;
    if (!user) {
      return { success: false, message: "Auth istifadəçi yaradılmadı." };
    }

    // Trigger-in işləməsi üçün qısa gözləmə
    await new Promise((r) => setTimeout(r, 500));

    // ── Supplier: approval_status + team member ───────────────────────────
    if (role === "supplier") {
      // Trigger profili 'pending' ilə yaradır — biz 'approved' edirik
      const { error: approvalError } = await supabase
        .from("supplier_profiles")
        .update({ approval_status: "approved" })
        .eq("user_id", user.id);

      if (approvalError) {
        console.error("[createUserByAdmin] Approval update xətası:", approvalError);
      }

      // Team member — trigger bunu yaratmır
      const { data: sp } = await supabase
        .from("supplier_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (sp?.id) {
        const { error: teamError } = await supabase
          .from("supplier_team_members")
          .insert({
            supplier_id: sp.id,
            user_id: user.id,
            role: "owner",
            is_active: true,
            invited_by: user.id,
          });

        if (teamError) {
          console.error("[createUserByAdmin] Team member xətası:", teamError);
        }
      }
    }

    // ── Admin / Restaurant ────────────────────────────────────────────────
    // Trigger profiles (və restaurant_profiles) artıq yaratdı — əlavə iş yoxdur.

    revalidatePath("/admin/users");
    return { success: true, message: "İstifadəçi uğurla yaradıldı." };
  } catch (err) {
    console.error("[createUserByAdmin] Gözlənilməz xəta:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Server xətası baş verdi.",
    };
  }
}
