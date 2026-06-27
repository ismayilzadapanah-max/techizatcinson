"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";

type UserRole = "admin" | "supplier" | "restaurant";

export async function createUserByAdmin(formData: FormData) {
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
      return {
        success: false,
        message: "E-mail, şifrə və rol mütləq doldurulmalıdır.",
      };
    }

    if (!["admin", "supplier", "restaurant"].includes(role)) {
      return {
        success: false,
        message: "Rol düzgün deyil.",
      };
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
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
      return {
        success: false,
        message: authError.message,
      };
    }

    const user = authData.user;

    if (!user) {
      return {
        success: false,
        message: "Auth istifadəçi yaradılmadı.",
      };
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: user.id,
        role,
        full_name: fullName,
        email,
        phone,
        is_active: true,
      });

    if (profileError) {
      return {
        success: false,
        message: profileError.message,
      };
    }

    if (role === "supplier") {
      const { data: supplierProfile, error: supplierError } =
        await supabaseAdmin
          .from("supplier_profiles")
          .upsert({
            user_id: user.id,
            company_name: companyName || fullName,
            contact_person: fullName,
            phone,
            email,
            is_active: true,
          })
          .select("id")
          .single();

      if (supplierError) {
        return {
          success: false,
          message: supplierError.message,
        };
      }

      if (supplierProfile?.id) {
        const { error: teamError } = await supabaseAdmin
          .from("supplier_team_members")
          .upsert({
            supplier_id: supplierProfile.id,
            user_id: user.id,
            member_role: "owner",
            status: "active",
          });

        if (teamError) {
          return {
            success: false,
            message: teamError.message,
          };
        }
      }
    }

    if (role === "restaurant") {
      const { error: restaurantError } = await supabaseAdmin
        .from("restaurant_profiles")
        .upsert({
          user_id: user.id,
          restaurant_name: restaurantName || fullName,
          contact_person: fullName,
          phone,
          email,
          is_active: true,
        });

      if (restaurantError) {
        return {
          success: false,
          message: restaurantError.message,
        };
      }
    }

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "İstifadəçi uğurla yaradıldı.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server xətası baş verdi.",
    };
  }
}
