"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { CATEGORIES } from "@/lib/constants";

export default function SupplierProfilePage() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient()!, []);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    voen: "",
    category: "",
    city: "",
    region: "",
    address: "",
    about: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    whatsappLink: "",
    email: "",
    websiteUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    linkedinUrl: "",
    mapLink: "",
    workingHours: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [docFiles, setDocFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("supplier_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setForm({
          companyName: data.company_name || "",
          voen: data.tax_id || "",
          category: data.activity_area || "",
          city: data.city || "",
          region: data.region || "",
          address: data.address || "",
          about: data.about || "",
          contactPerson: data.contact_person || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp_number || "",
          whatsappLink: data.whatsapp_link || "",
          email: data.email || "",
          websiteUrl: data.website_url || "",
          instagramUrl: data.instagram_url || "",
          facebookUrl: data.facebook_url || "",
          linkedinUrl: data.linkedin_url || "",
          mapLink: data.map_link || "",
          workingHours: data.working_hours || "",
        });
        if (data.logo_url) setLogoPreview(data.logo_url);
        if (data.cover_url) setCoverPreview(data.cover_url);
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handleDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setDocFiles(Array.from(files));
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const filePath = `${path}_${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.companyName.trim()) {
      setError("Şirkət adı mütləq doldurulmalıdır.");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      let logo_url = logoPreview || "";
      let cover_url = coverPreview || "";
      const document_urls: string[] = [];

      if (logoFile) logo_url = await uploadFile(logoFile, "avatars", `${user.id}/logo`);
      if (coverFile) cover_url = await uploadFile(coverFile, "avatars", `${user.id}/cover`);
      for (const doc of docFiles) {
        const url = await uploadFile(doc, "documents", `${user.id}/${doc.name}`);
        document_urls.push(url);
      }

      const row: Record<string, unknown> = {
        user_id: user.id,
        company_name: form.companyName.trim(),
        tax_id: form.voen.trim(),
        contact_person: form.contactPerson.trim() || user.fullName || "",
        phone: form.phone.trim() || user.phone || "",
        whatsapp_number: form.whatsapp.trim() || "",
        whatsapp_link: form.whatsappLink.trim() || "",
        email: form.email.trim() || user.email || "",
        city: form.city.trim(),
        region: form.region.trim(),
        address: form.address.trim(),
        activity_area: form.category,
        about: form.about.trim(),
        website_url: form.websiteUrl.trim(),
        instagram_url: form.instagramUrl.trim(),
        facebook_url: form.facebookUrl.trim(),
        linkedin_url: form.linkedinUrl.trim(),
        map_link: form.mapLink.trim(),
        working_hours: form.workingHours.trim(),
        is_public: true,
        is_active: true,
      };

      if (logo_url) row.logo_url = logo_url;
      if (cover_url) row.cover_url = cover_url;
      if (document_urls.length > 0) row.document_urls = document_urls;

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
          .insert(row);
        saveError = insertErr;
      }

      if (saveError) {
        setError(saveError.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Saxlama zamanı xəta baş verdi.");
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
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Profilim</h2>
        <p className="text-sm text-brand-muted">Şirkət məlumatlarınızı doldurun və yeniləyin.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8 space-y-8">
        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Şirkət məlumatları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Şirkət adı *</label><input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Məs: Global Supply MMC" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">VÖEN</label><input name="voen" value={form.voen} onChange={handleChange} placeholder="10 rəqəmli VÖEN nömrəsi" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Fəaliyyət sahəsi</label><select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"><option value="">Seçin</option>{CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
            <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Şəhər/Rayon</label><input name="city" value={form.city} onChange={handleChange} placeholder="Məs: Bakı" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1 md:col-span-2"><label className="text-xs text-brand-muted font-semibold">Ünvan</label><input name="address" value={form.address} onChange={handleChange} placeholder="Küçə, bina, mənzil" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" /></div>
            <div className="space-y-1 md:col-span-2"><label className="text-xs text-brand-muted font-semibold">Şirkət haqqında</label><textarea name="about" value={form.about} onChange={handleChange} rows={4} placeholder="Şirkətinizin fəaliyyəti, təcrübəsi və üstünlükləri haqqında məlumat yazın..." className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] resize-none" /></div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Vizual məlumatlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-[#E9E8EE] rounded-xl p-6 text-center hover:border-[#243786]/50 transition-colors cursor-pointer">
              {logoPreview ? <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-lg object-cover mx-auto" /> : <><span className="material-symbols-outlined text-3xl text-brand-soft-blue">image</span><p className="text-sm font-semibold text-brand-muted mt-2">Logo yüklə</p></>}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <label className="border-2 border-dashed border-[#E9E8EE] rounded-xl p-6 text-center hover:border-[#243786]/50 transition-colors cursor-pointer">
              {coverPreview ? <img src={coverPreview} alt="Cover" className="w-full h-20 rounded-lg object-cover" /> : <><span className="material-symbols-outlined text-3xl text-brand-soft-blue">photo</span><p className="text-sm font-semibold text-brand-muted mt-2">Cover şəkil yüklə</p></>}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Hüquqi sənədlər</h3>
          <label className="border-2 border-dashed border-[#E9E8EE] rounded-xl p-8 text-center hover:border-[#243786]/50 transition-colors cursor-pointer block">
            <span className="material-symbols-outlined text-4xl text-brand-soft-blue">cloud_upload</span>
            <p className="text-sm font-semibold text-brand-muted mt-2">{docFiles.length > 0 ? `${docFiles.length} fayl seçildi` : "Sənəd yükləyin"}</p>
            <p className="text-xs text-outline mt-1">PDF, JPG, PNG (max 5MB)</p>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleDocsUpload} className="hidden" />
          </label>
        </section>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-[18px]">{saving ? "sync" : "save"}</span>
            {saving ? "Saxlanır..." : "Yadda saxla"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">check_circle</span>Profil yadda saxlanıldı!</span>}
          {error && <span className="text-sm text-red-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">error</span>{error}</span>}
        </div>
      </div>
    </div>
  );
}
