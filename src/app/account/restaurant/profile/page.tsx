"use client";

import { useState } from "react";

export default function RestaurantProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Profilim</h2>
        <p className="text-sm text-brand-muted">Restoran məlumatlarınızı doldurun və yeniləyin.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Əsas məlumatlar */}
          <section>
            <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Restoran məlumatları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Restoran adı", placeholder: "Məs: Şəhər Dadı", icon: "restaurant" },
                { label: "Restoran tipi", placeholder: "Məs: Milli mətbəx", icon: "category" },
                { label: "Filial sayı", placeholder: "Məs: 3", icon: "numbers", type: "number" },
                { label: "Əlaqə şəxsi", placeholder: "Ad, Soyad", icon: "person" },
                { label: "Telefon", placeholder: "+994 (50) 000-00-00", icon: "call", type: "tel" },
                { label: "E-mail", placeholder: "restoran@mail.com", icon: "mail", type: "email" },
                { label: "Şəhər/Rayon", placeholder: "Məs: Bakı", icon: "location_on" },
                { label: "İş saatları", placeholder: "Məs: 09:00 - 23:00", icon: "schedule" },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-xs text-brand-muted font-semibold">{f.label}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-soft-blue text-sm">{f.icon}</span>
                    <input type={f.type || "text"} placeholder={f.placeholder} className="w-full pl-10 pr-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1">
              <label className="text-xs text-brand-muted font-semibold">Ünvan</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-brand-soft-blue text-sm">home</span>
                <textarea rows={2} placeholder="Küçə adı, bina nömrəsi, mənzil" className="w-full pl-10 pr-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] resize-none placeholder:text-brand-soft-blue" />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section>
            <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Restoran şəkli</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-[#F3F2F7] border-2 border-dashed border-[#E9E8EE] flex items-center justify-center text-brand-soft-blue">
                <span className="material-symbols-outlined text-4xl">restaurant</span>
              </div>
              <label className="border-2 border-dashed border-[#E9E8EE] rounded-xl px-6 py-4 text-center hover:border-[#243786]/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-2xl text-brand-soft-blue">cloud_upload</span>
                <p className="text-xs font-semibold text-[#141647] mt-1">Logo yüklə</p>
                <p className="text-[10px] text-brand-muted">JPG, PNG</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </section>

          <button type="submit" className="bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2">
            {saved ? (
              <><span className="material-symbols-outlined text-[18px]">check_circle</span> Saxlanıldı</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">save</span> Yadda saxla</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
