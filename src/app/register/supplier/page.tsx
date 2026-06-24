"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SupplierRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "", contactPerson: "", phone: "", email: "", password: "",
    city: "", category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.companyName) return;
    setLoading(true);
    const result = await register({
      fullName: form.contactPerson || form.companyName,
      email: form.email,
      phone: form.phone,
      role: "supplier",
      password: form.password,
      companyName: form.companyName,
      city: form.city,
      activityArea: form.category,
    });
    setLoading(false);
    if (result.error) { alert(result.error); return; }
    router.push("/account/supplier");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl glass-card rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-on-background mb-1">Təchizatçı Qeydiyyatı</h2>
          <p className="text-sm text-on-surface-variant">Biznesinizi böyütmək üçün məlumatları daxil edin</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Şirkət adı", name: "companyName", placeholder: "Məs: Global Supply MMC", icon: "business" },
              { label: "Əlaqə şəxsi", name: "contactPerson", placeholder: "Ad və Soyad", icon: "person" },
              { label: "Telefon", name: "phone", placeholder: "+994 (50) 000-00-00", icon: "call", type: "tel" },
              { label: "E-mail", name: "email", placeholder: "example@company.com", icon: "mail", type: "email" },
              { label: "Şifrə", name: "password", placeholder: "Minimum 8 simvol", icon: "lock", type: "password" },
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
            <div className="space-y-1">
              <label className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Fəaliyyət sahəsi</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors">
                <option value="">Seçin</option>
                <option>Qida və İçki</option>
                <option>Avadanlıqlar</option>
                <option>Xidmətlər</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "Gözləyin..." : "Qeydiyyatı tamamla"}
            <span className="material-symbols-outlined text-[18px]">{loading ? "sync" : "arrow_forward"}</span>
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          Artıq hesabınız var? <Link href="/login" className="text-secondary font-semibold hover:underline">Daxil ol</Link>
        </p>
      </div>
    </div>
  );
}
