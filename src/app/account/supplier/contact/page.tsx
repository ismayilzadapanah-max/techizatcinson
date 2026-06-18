"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

export default function SupplierContactPage() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    contactPerson: "", position: "", phone: "", phone2: "", email: "",
    address: "", workingHours: "", whatsapp: "", whatsappLink: "",
    whatsappMessage: "Salam, məhsullarınız haqqında məlumat almaq istəyirəm.",
    websiteUrl: "", instagramUrl: "", facebookUrl: "", linkedinUrl: "", mapLink: "",
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("supplier_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setForm((prev) => ({
          ...prev,
          contactPerson: data.contact_person || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp_number || "",
          whatsappLink: data.whatsapp_link || "",
          email: data.email || "",
          address: data.address || "",
          workingHours: data.working_hours || "",
          websiteUrl: data.website_url || "",
          instagramUrl: data.instagram_url || "",
          facebookUrl: data.facebook_url || "",
          linkedinUrl: data.linkedin_url || "",
          mapLink: data.map_link || "",
        }));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const row: Record<string, unknown> = {
        user_id: user.id,
        contact_person: form.contactPerson.trim(),
        phone: form.phone.trim(),
        whatsapp_number: form.whatsapp.trim(),
        whatsapp_link: form.whatsappLink.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        working_hours: form.workingHours.trim(),
        website_url: form.websiteUrl.trim(),
        instagram_url: form.instagramUrl.trim(),
        facebook_url: form.facebookUrl.trim(),
        linkedin_url: form.linkedinUrl.trim(),
        map_link: form.mapLink.trim(),
        is_public: true,
      };

      const { data: existing } = await supabase
        .from("supplier_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let saveError = null;
      if (existing?.id) {
        const { error: updateErr } = await supabase
          .from("supplier_profiles")
          .update(row)
          .eq("id", existing.id);
        saveError = updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("supplier_profiles")
          .insert({ ...row, company_name: user.fullName || "Şirkət" });
        saveError = insertErr;
      }

      if (saveError) {
        setError(saveError.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-16 flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-brand-soft-blue animate-spin">sync</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Əlaqə məlumatları</h2><p className="text-sm text-brand-muted">Restoranların sizinlə əlaqə saxlaması üçün məlumatları doldurun.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8 space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Əsas əlaqə</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Əlaqə şəxsi</label><input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Ad və Soyad" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Vəzifə</label><input name="position" value={form.position} onChange={handleChange} placeholder="Məs: Satış meneceri" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Əsas telefon</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="+994 (50) 000-00-00" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Əlavə telefon</label><input name="phone2" value={form.phone2} onChange={handleChange} placeholder="+994 (12) 000-00-00" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">E-mail</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@company.com" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Ünvan</label><input name="address" value={form.address} onChange={handleChange} placeholder="Küçə, bina, mənzil" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">İş saatları</label><input name="workingHours" value={form.workingHours} onChange={handleChange} placeholder="Məs: 09:00-18:00" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
          </div>
        </section>

        <section className="bg-[#F3F2F7] rounded-xl p-6 border border-[#25D366]/20">
          <h3 className="text-lg font-semibold text-[#141647] mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#25D366]">chat</span>WhatsApp yönləndirməsi</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">WhatsApp nömrəsi</label><input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+994 (50) 000-00-00" className="w-full px-4 py-2.5 bg-white border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#25D366]" /></div>
              <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">WhatsApp linki</label><input name="whatsappLink" value={form.whatsappLink} onChange={handleChange} placeholder="https://wa.me/994XXXXXXXXX" className="w-full px-4 py-2.5 bg-white border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#25D366]" /></div>
            </div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Hazır mesaj mətni</label><textarea name="whatsappMessage" value={form.whatsappMessage} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-white border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#25D366] resize-none" /></div>
            <p className="text-[10px] text-brand-muted">Bu link məhsul kartlarında, məhsul detalında və profil səhifəsində WhatsApp düyməsinə bağlanacaq.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Sosial şəbəkələr</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["websiteUrl","instagramUrl","facebookUrl","linkedinUrl","mapLink"].map((key) => {
              const labels: Record<string,string> = { websiteUrl:"Website", instagramUrl:"Instagram", facebookUrl:"Facebook", linkedinUrl:"LinkedIn", mapLink:"Xəritə linki" };
              return <div key={key} className="space-y-1"><label className="text-xs text-brand-muted font-semibold">{labels[key]}</label><input name={key} value={(form as any)[key]} onChange={handleChange} placeholder="https://" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>;
            })}
          </div>
        </section>

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving} className="bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-[18px]">{saving ? "sync" : "save"}</span>{saving ? "Saxlanır..." : "Yadda saxla"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">check_circle</span>Əlaqə məlumatları yadda saxlanıldı!</span>}
          {error && <span className="text-sm text-red-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">error</span>{error}</span>}
        </div>
      </div>
    </div>
  );
}
