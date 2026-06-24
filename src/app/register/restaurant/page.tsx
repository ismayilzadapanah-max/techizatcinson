"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RestaurantRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    restaurantName: "", contactPerson: "", phone: "", email: "", password: "",
    city: "", address: "", note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.restaurantName) return;
    setLoading(true);
    const result = await register({
      fullName: form.contactPerson || form.restaurantName,
      email: form.email,
      phone: form.phone,
      role: "restaurant",
      password: form.password,
      restaurantName: form.restaurantName,
      city: form.city,
      address: form.address,
    });
    setLoading(false);
    if (result.error) { alert(result.error); return; }
    router.push("/account/restaurant");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl glass-card rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-on-background mb-1">Restoran Qeydiyyatı</h2>
          <p className="text-sm text-on-surface-variant">Platformaya qoşulmaq üçün məlumatları doldurun</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Restoran adı", name: "restaurantName", placeholder: "Məs: Şəhər Dadı", icon: "restaurant" },
              { label: "Əlaqə şəxsi", name: "contactPerson", placeholder: "Ad, Soyad", icon: "person" },
              { label: "Telefon", name: "phone", placeholder: "(50) 000 00 00", icon: "call", type: "tel" },
              { label: "E-mail", name: "email", placeholder: "example@mail.com", icon: "mail", type: "email" },
              { label: "Şifrə", name: "password", placeholder: "••••••••", icon: "lock", type: "password" },
              { label: "Şəhər/Rayon", name: "city", placeholder: "Məs: Bakı", icon: "location_on" },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">{f.label}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">{f.icon}</span>
                  <input name={f.name} type={f.type || "text"} placeholder={f.placeholder} value={(form as Record<string, string>)[f.name] || ""} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors placeholder:text-outline/50" required />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Ünvan</label>
            <input name="address" type="text" placeholder="Küçə adı, bina, mənzil" value={form.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors placeholder:text-outline/50" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Qeyd</label>
            <textarea name="note" placeholder="Əlavə məlumat..." rows={3} value={form.note} onChange={handleChange} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors placeholder:text-outline/50 resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "Gözləyin..." : "Qeydiyyatı tamamla"}
            <span className="material-symbols-outlined text-[18px]">{loading ? "sync" : "arrow_forward"}</span>
          </button>
          <p className="text-xs text-on-surface-variant text-center opacity-60">Qeydiyyatdan keçməklə istifadə şərtlərini qəbul edirsiniz.</p>
        </form>

        <p className="text-center text-xs text-on-surface-variant mt-4">
          Artıq hesabınız var? <Link href="/login" className="text-secondary font-semibold hover:underline">Daxil ol</Link>
        </p>
      </div>
    </div>
  );
}
