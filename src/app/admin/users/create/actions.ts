"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";

type UserRole = "admin" | "supplier" | "restaurant";

export async function createUserByAdmin(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    // Admin yoxlaması
    await requireAdmin();

    // Form məlumatları
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const role = String(formData.get("role") || "").trim() as UserRole;
    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const companyName = String(formData.get("companyName") || "").trim();
    const restaurantName = String(formData.get("restaurantName") || "").trim();

    // Validasiya
    if (!email || !password || !role) {
      return {
        success: false,
        message: "E-mail, şifrə və rol mütləq doldurulmalıdır.",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Şifrə minimum 6 simvol olmalıdır.",
      };
    }

    if (!["admin", "supplier", "restaurant"].includes(role)) {
      return {
        success: false,
        message: "Rol düzgün seçilməyib.",
      };
    }

    const supabase = getSupabaseAdmin();

    // ── 1. Supabase Auth-da user yarat ───────────────────────────────────
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
      const msg = authError.message.includes("already registered")
        ? "E-mail artıq mövcuddur."
        : authError.message;
      return { success: false, message: msg };
    }

    const user = authData?.user;
    if (!user) {
      return { success: false, message: "Auth istifadəçi yaradılmadı." };
    }

    // ── 2. profiles cədvəli ───────────────────────────────────────────────
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      role,
      full_name: fullName,
      email,
      phone,
      is_active: true,
    });

    if (profileError) {
      console.error("[createUserByAdmin] Profil xətası:", profileError);
      return { success: false, message: `Profil yaradılmadı: ${profileError.message}` };
    }

    // ── 3. Supplier ───────────────────────────────────────────────────────
    if (role === "supplier") {
      // supplier_profiles
      const { data: supplierProfile, error: supplierError } = await supabase
        .from("supplier_profiles")
        .insert({
          user_id: user.id,
          company_name: companyName || fullName,
          contact_person: fullName,
          phone,
          email,
          approval_status: "approved",
          is_active: true,
        })
        .select("id")
        .single();

      if (supplierError) {
        console.error("[createUserByAdmin] Supplier profil xətası:", supplierError);
        return {
          success: false,
          message: `Təchizatçı profili yaradılmadı: ${supplierError.message}`,
        };
      }

      // supplier_team_members — DB sxeması: role, is_active (member_role/status yoxdur!)
      if (supplierProfile?.id) {
        const { error: teamError } = await supabase
          .from("supplier_team_members")
          .insert({
            supplier_id: supplierProfile.id,
            user_id: user.id,
            role: "owner",        // DB sütunu: role
            is_active: true,      // DB sütunu: is_active
            invited_by: user.id,
          });

        if (teamError) {
          console.error("[createUserByAdmin] Team member xətası:", teamError);
          return {
            success: false,
            message: `Team member yaradılmadı: ${teamError.message}`,
          };
        }
      }
    }

    // ── 4. Restaurant ─────────────────────────────────────────────────────
    // restaurant_profiles-da approval_status sütunu yoxdur
    if (role === "restaurant") {
      const { error: restaurantError } = await supabase
        .from("restaurant_profiles")
        .insert({
          user_id: user.id,
          restaurant_name: restaurantName || fullName,
          contact_person: fullName,
          phone,
          email,
          is_active: true,
        });

      if (restaurantError) {
        console.error("[createUserByAdmin] Restaurant profil xətası:", restaurantError);
        return {
          success: false,
          message: `Restoran profili yaradılmadı: ${restaurantError.message}`,
        };
      }
    }

    // ── 5. Admin — yalnız profiles ───────────────────────────────────────
    // profiles artıq yuxarıda yazıldı, əlavə iş yoxdur

    revalidatePath("/admin/users");

    return { success: true, message: "İstifadəçi uğurla yaradıldı." };
  } catch (err) {
    console.error("[createUserByAdmin] Gözlənilməz xəta:", err);
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Server xətası baş verdi.",
    };
  }
}
