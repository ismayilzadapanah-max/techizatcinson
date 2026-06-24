"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const FIELDS = [
  { key: "site_name", label: "Sayt adı", icon: "language", placeholder: "Techizatcin.com" },
  { key: "contact_phone", label: "Əlaqə telefonu", icon: "call", placeholder: "+994 50 000 00 00" },
  { key: "whatsapp_number", label: "WhatsApp nömrəsi", icon: "chat", placeholder: "+994 50 000 00 00" },
  { key: "contact_email", label: "Əlaqə e-maili", icon: "mail", placeholder: "info@techizatcin.com" },
  { key: "seo_title", label: "SEO başlıq", icon: "title", placeholder: "Techizatcin — B2B Marketplace" },
  { key: "seo_description", label: "SEO açıqlaması", icon: "description", placeholder: "Restoranlar üçün təchizatçı platforması..." },
  { key: "logo_url", label: "Logo URL", icon: "image", placeholder: "https://..." },
  { key: "support_email", label: "Dəstək e-maili", icon: "support_agent", placeholder: "support@techizatcin.com" },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        (data as { key: string; value: string }[]).forEach(row => { map[row.key] = row.value; });
        setValues(map);
        setMaintenance(map["maintenance_mode"] === "true");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    if (supabase) {
      const upserts = [
        ...FIELDS.map(f => ({ key: f.key, value: values[f.key] || "", updated_at: new Date().toISOString() })),
        { key: "maintenance_mode", value: maintenance ? "true" : "false", updated_at: new Date().toISOString() },
      ];
      await supabase.from("site_settings").upsert(upserts, { onConflict: "key" });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Sayt Ayarları</h2>
        <p className="text-sm text-[#5D608B]">Ümumi sayt konfiqurasiyasını idarə edin.</p>
      </div>

      {loading ? (
        <div className="p-16 flex items-center justify-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Əsas məlumatlar */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6">
            <h3 className="text-base font-semibold text-[#141647] mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#243786]">settings</span>
              Əsas Məlumatlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FIELDS.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs text-[#5D608B] font-semibold uppercase tracking-wide flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-[#9DB1CA]">{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={values[f.key] || ""}
                    onChange={e => setValues({ ...values, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors placeholder:text-[#9DB1CA]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sistem */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6">
            <h3 className="text-base font-semibold text-[#141647] mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#243786]">build</span>
              Sistem
            </h3>
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <div className={`relative w-11 h-6 rounded-full transition-colors ${maintenance ? "bg-amber-500" : "bg-[#E9E8EE]"}`}
                onClick={() => setMaintenance(!maintenance)}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${maintenance ? "translate-x-5" : ""}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#141647]">Texniki işlər rejimi</p>
                <p className="text-xs text-[#5D608B]">Sayt ziyarətçilərə texniki işlər səhifəsi göstərilər</p>
              </div>
            </label>
          </div>

          {/* Saxla */}
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#141647] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">{saving ? "sync" : "save"}</span>
              {saving ? "Saxlanılır..." : "Yadda saxla"}
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Uğurla saxlanıldı!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
