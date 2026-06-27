"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserByAdmin } from "./actions";

type Role = "admin" | "supplier" | "restaurant";

const ROLES: { value: Role; label: string; icon: string; desc: string }[] = [
  {
    value: "supplier",
    label: "Təchizatçı",
    icon: "local_shipping",
    desc: "Məhsul satan şirkət",
  },
  {
    value: "restaurant",
    label: "Restoran",
    icon: "restaurant",
    desc: "Məhsul alan müəssisə",
  },
  {
    value: "admin",
    label: "Admin",
    icon: "admin_panel_settings",
    desc: "Sistem idarəçisi",
  },
];

export default function AdminCreateUserPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<Role>("supplier");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createUserByAdmin(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/admin/users"), 1800);
      }
    });
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E9E8EE] p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-green-600">
              check_circle
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#141647] mb-1">
            İstifadəçi yaradıldı
          </h3>
          <p className="text-sm text-[#5D608B]">
            İstifadəçilər siyahısına yönləndirilirsiniz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="p-2 text-[#5D608B] hover:text-[#141647] hover:bg-white rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#141647]">
            Yeni istifadəçi yarat
          </h2>
          <p className="text-sm text-[#5D608B]">
            Supabase Auth + profil cədvəllərinə yazılır
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rol seçimi */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6">
          <h3 className="text-sm font-semibold text-[#141647] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#243786]">
              badge
            </span>
            Rol seçin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROLES.map((r) => (
              <label
                key={r.value}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === r.value
                    ? "border-[#243786] bg-[#F4F5F9]"
                    : "border-[#E9E8EE] hover:border-[#9DB1CA]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={role === r.value}
                  onChange={() => setRole(r.value)}
                  className="sr-only"
                />
                <span
                  className={`material-symbols-outlined text-2xl ${
                    role === r.value ? "text-[#243786]" : "text-[#9DB1CA]"
                  }`}
                >
                  {r.icon}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    role === r.value ? "text-[#141647]" : "text-[#5D608B]"
                  }`}
                >
                  {r.label}
                </span>
                <span className="text-[11px] text-[#9DB1CA] text-center">
                  {r.desc}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Hesab məlumatları */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#141647] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#243786]">
              lock
            </span>
            Hesab məlumatları
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#5D608B] mb-1.5">
              E-mail ünvanı <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="istifadeci@misal.az"
              className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5D608B] mb-1.5">
              Müvəqqəti şifrə <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Minimum 6 simvol"
              className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
            <p className="text-[11px] text-[#9DB1CA] mt-1">
              Şifrə yalnız Supabase Auth-da saxlanır, heç bir cədvəldə görünmür
            </p>
          </div>
        </div>

        {/* Profil məlumatları */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#141647] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#243786]">
              person
            </span>
            Profil məlumatları
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#5D608B] mb-1.5">
              Ad / Əlaqə şəxsi
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Tam ad"
              className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
          </div>

          {role === "supplier" && (
            <div>
              <label className="block text-xs font-medium text-[#5D608B] mb-1.5">
                Şirkət adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                required
                placeholder="MMC / SC / Fərdi müəssisə adı"
                className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
              />
            </div>
          )}

          {role === "restaurant" && (
            <div>
              <label className="block text-xs font-medium text-[#5D608B] mb-1.5">
                Restoran adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="restaurantName"
                required
                placeholder="Restoran / Kafe / Otel adı"
                className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#5D608B] mb-1.5">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+994 50 000 00 00"
              className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
          </div>
        </div>

        {/* Xəta mesajı */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5 flex-shrink-0">
              error
            </span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Düymələr */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#141647] text-white text-sm font-semibold rounded-lg hover:bg-[#243786] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${isPending ? "animate-spin" : ""}`}
            >
              {isPending ? "sync" : "person_add"}
            </span>
            {isPending ? "Yaradılır..." : "İstifadəçi yarat"}
          </button>
          <Link
            href="/admin/users"
            className="px-5 py-2.5 text-sm text-[#5D608B] hover:text-[#141647] border border-[#E9E8EE] rounded-lg hover:bg-white transition-all"
          >
            Ləğv et
          </Link>
        </div>
      </form>
    </div>
  );
}
