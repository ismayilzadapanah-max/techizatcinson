"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

const STEPS = [
  { id: 1, label: "Məlumat" },
  { id: 2, label: "Qiymət" },
  { id: 3, label: "Çatdırılma" },
  { id: 4, label: "Şəkillər" },
  { id: 5, label: "Əlaqə" },
  { id: 6, label: "Önizləmə" },
];

const REGIONS = ["Bakı", "Sumqayıt", "Gəncə", "Abşeron"];

export default function CreateProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Step 1: Əsas məlumatlar
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Qiymət
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Kq");
  const [minOrder, setMinOrder] = useState("");
  const [negotiable, setNegotiable] = useState(false);

  // Step 3: Stok & çatdırılma
  const [stockQty, setStockQty] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Step 4: Şəkillər
  const [images, setImages] = useState<string[]>([]);

  // Step 5: Əlaqə
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const next = () => step < 6 && setStep(step + 1);
  const prev = () => step > 1 && setStep(step - 1);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!user) { setSaveError("Giriş tələb olunur."); return; }
    if (!productName) { setSaveError("Məhsul adı tələb olunur."); return; }
    if (!price) { setSaveError("Qiymət tələb olunur."); return; }

    setSaving(true);
    setSaveError("");

    const supabase = createClient();
    if (!supabase) { setSaveError("Bağlantı xətası."); setSaving(false); return; }

    const selectedCatName = CATEGORIES.find((c) => c.id === category)?.name || category;

    const { error } = await supabase.from("product_listings").insert({
      supplier_id: user.id,
      supplier_name: user.fullName,
      product_name: productName,
      category_id: category,
      category_name: selectedCatName,
      subcategory_id: subCategory,
      description: description,
      price: parseFloat(price) || 0,
      price_unit: unit,
      min_order_qty: parseFloat(minOrder) || 1,
      negotiable: negotiable,
      stock_qty: parseInt(stockQty) || 0,
      stock_status: stockQty && parseInt(stockQty) > 0 ? "in_stock" : "out_of_stock",
      delivery_regions: selectedRegions,
      delivery_time: deliveryTime,
      delivery_fee: parseFloat(deliveryFee) || 0,
      free_delivery: !deliveryFee || deliveryFee === "0",
      contact_person: contactPerson,
      contact_phone: contactPhone,
      contact_whatsapp: contactWhatsapp,
      contact_whatsapp_link: whatsappLink,
      contact_email: contactEmail,
      approval_status: "pending",
      is_active: true,
      view_count: 0,
    });

    setSaving(false);
    if (error) {
      setSaveError("Xəta baş verdi: " + error.message);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
        </div>
        <h3 className="text-2xl font-bold text-[#141647] mb-2">Məhsul göndərildi!</h3>
        <p className="text-brand-muted mb-6">Məhsulunuz moderator təsdiqinə göndərildi. 24 saat ərzində cavab alacaqsınız.</p>
        <a href="/account/supplier/products" className="inline-flex items-center gap-2 bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Məhsullarıma qayıt
        </a>
      </div>
    );
  }

  const selectedCat = CATEGORIES.find((c) => c.id === category);
  const categoryName = selectedCat?.name || category;
  const regionText = selectedRegions.length > 0 ? selectedRegions.join(", ") : "-";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Yeni məhsul əlavə et</h2>
        <p className="text-sm text-brand-muted">Addım-addım məhsul elanı yaradın.</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-[#E9E8EE]" />
          <div className="absolute top-5 left-0 h-[2px] bg-[#D47092] transition-all duration-500" style={{ width: `${((step - 1) / 5) * 100}%` }} />
          {STEPS.map((s) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 group cursor-pointer" onClick={() => s.id < step && setStep(s.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all text-sm font-bold ${
                  isCompleted || isActive ? "border-[#D47092] text-[#D47092] bg-white" : "border-[#E9E8EE] text-brand-soft-blue bg-[#F3F2F7]"
                }`}>
                  {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : s.id}
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? "text-[#D47092]" : "text-brand-muted"}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8 min-h-[400px]">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#141647]">Əsas məlumatlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Məhsulun adı</label>
                <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Məs: Təzə Qırmızı Pomidor" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Kateqoriya</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }} className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]">
                  <option value="">Seçin</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Alt kateqoriya</label>
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  placeholder={category ? "Özünüz yazın" : "Əvvəlcə kateqoriya seçin"}
                  className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] disabled:opacity-50 placeholder:text-brand-soft-blue"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-brand-muted font-semibold">Məhsul təsviri</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Məhsul haqqında ətraflı məlumat yazın..." className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] resize-none placeholder:text-brand-soft-blue" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#141647]">Qiymət və sifariş şərtləri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Qiymət (AZN)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Ölçü vahidi</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]">
                  <option>Kq</option><option>Ədəd</option><option>Litrlə</option><option>Qutu</option><option>Metr</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Minimum sifariş</label>
                <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="10" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#141647] cursor-pointer" onClick={() => setNegotiable(!negotiable)}>
              <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} className="rounded text-[#243786]" />
              Qiymət razılaşma ilədir
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#141647]">Stok və çatdırılma</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Stok miqdarı</label>
                <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} placeholder="100" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Çatdırılma müddəti</label>
                <input value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} placeholder="Məs: 1-2 iş günü" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Çatdırılma haqqı (AZN)</label>
                <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-brand-muted font-semibold">Çatdırılma bölgələri</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((c) => (
                  <label key={c} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                    selectedRegions.includes(c) ? "bg-[#243786] text-white" : "bg-[#F3F2F7] text-[#141647]"
                  }`} onClick={() => toggleRegion(c)}>
                    <input type="checkbox" checked={selectedRegions.includes(c)} onChange={() => {}} className="hidden" />
                    {selectedRegions.includes(c) && <span className="material-symbols-outlined text-[16px]">check</span>}
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#141647]">Məhsul şəkilləri</h3>
            <label className="border-2 border-dashed border-[#E9E8EE] rounded-2xl p-12 text-center hover:border-[#243786]/50 transition-colors cursor-pointer block">
              <span className="material-symbols-outlined text-5xl text-brand-soft-blue">cloud_upload</span>
              <p className="text-sm font-semibold text-[#141647] mt-4">Şəkilləri buraya sürükləyin</p>
              <p className="text-xs text-brand-muted mt-1">və ya fayl seçmək üçün klikləyin (Maks 5 şəkil)</p>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden relative group border-2 border-[#E9E8EE]">
                    <img src={img} alt={`Şəkil ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#243786] text-white px-2 py-0.5 rounded text-[10px] font-semibold">Əsas</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#141647]">Əlaqə məlumatları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Əlaqə şəxsi</label><input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Ad və Soyad" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" /></div>
              <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">Telefon nömrəsi</label><input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+994 (50) 000-00-00" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" /></div>
              <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">WhatsApp nömrəsi</label><input value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="+994 (50) 000-00-00" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" /></div>
              <div className="space-y-1"><label className="text-xs text-brand-muted font-semibold">E-mail</label><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="example@company.com" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" /></div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-brand-muted font-semibold">WhatsApp yönləndirmə linki</label>
              <input value={whatsappLink} onChange={(e) => setWhatsappLink(e.target.value)} placeholder="https://wa.me/994XXXXXXXXX" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue" />
              <p className="text-[10px] text-brand-muted italic mt-1">Bu linkə klik edən restoran birbaşa WhatsApp söhbətinə yönləndiriləcək.</p>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#141647]">Önizləmə və yayımlama</h3>
            <div className="bg-[#F3F2F7] rounded-xl p-6 border border-[#E9E8EE] flex flex-col md:flex-row gap-6">
              {/* Şəkil */}
              <div className="w-full md:w-1/3 aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[#E9E8EE]">
                {images.length > 0 ? (
                  <img src={images[0]} alt="Məhsul" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-brand-soft-blue">inventory_2</span>
                )}
              </div>
              {/* Məlumat */}
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-bold text-[#141647]">{productName || "Məhsul adı"}</h4>
                {category && (
                  <span className="inline-block px-3 py-1 bg-[#243786]/10 text-[#243786] text-xs rounded-full">{categoryName}{subCategory ? ` / ${subCategory}` : ""}</span>
                )}
                {price && (
                  <p className="text-2xl font-bold text-[#141647]">
                    {Number(price).toFixed(2)} ₼
                    <span className="text-sm text-brand-muted font-normal"> / {unit}</span>
                    {negotiable && <span className="text-xs text-green-600 ml-2">(razılaşma ilə)</span>}
                  </p>
                )}
                {!price && <p className="text-2xl font-bold text-[#141647]">— ₼ <span className="text-sm text-brand-muted font-normal">/ {unit}</span></p>}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-brand-muted">Min. Sifariş</p><p className="font-semibold">{minOrder ? `${minOrder} ${unit}` : "-"}</p></div>
                  <div><p className="text-xs text-brand-muted">Bölgə</p><p className="font-semibold">{regionText}</p></div>
                  {stockQty && <div><p className="text-xs text-brand-muted">Stok</p><p className="font-semibold">{stockQty} ədəd</p></div>}
                  {deliveryTime && <div><p className="text-xs text-brand-muted">Çatdırılma</p><p className="font-semibold">{deliveryTime}</p></div>}
                </div>
                {description && <p className="text-sm text-brand-muted line-clamp-3">{description}</p>}
                {contactPerson && <p className="text-xs text-brand-muted">Əlaqə: {contactPerson}{contactPhone ? ` / ${contactPhone}` : ""}</p>}
              </div>
            </div>

            {/* Xəbərdarlıq */}
            <div className="p-4 bg-[#FDF2F5] border border-[#D47092]/20 rounded-xl text-sm text-[#D47092] flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              Məhsul dərc edildikdən sonra moderator tərəfindən 24 saat ərzində təsdiqlənəcək.
            </div>

            {/* Xülasə cədvəli */}
            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E9E8EE] text-sm">
              <h4 className="font-semibold text-[#141647] mb-3">Xülasə</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-brand-muted">Məhsul:</span><span className="font-semibold">{productName || "—"}</span>
                <span className="text-brand-muted">Kateqoriya:</span><span className="font-semibold">{categoryName || "—"}</span>
                <span className="text-brand-muted">Qiymət:</span><span className="font-semibold">{price ? `${Number(price).toFixed(2)} ₼ / ${unit}` : "—"}</span>
                <span className="text-brand-muted">Min. sifariş:</span><span className="font-semibold">{minOrder ? `${minOrder} ${unit}` : "—"}</span>
                <span className="text-brand-muted">Stok:</span><span className="font-semibold">{stockQty || "—"}</span>
                <span className="text-brand-muted">Bölgələr:</span><span className="font-semibold">{regionText}</span>
                <span className="text-brand-muted">Şəkillər:</span><span className="font-semibold">{images.length} ədəd</span>
                <span className="text-brand-muted">Əlaqə:</span><span className="font-semibold">{contactPerson || "—"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Xəta mesajı */}
      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {saveError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={prev} disabled={step === 1} className={`flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E9E8EE] text-brand-muted font-semibold text-sm transition-all ${step === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F3F2F7]"}`}>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>Geri
        </button>
        {step < 6 ? (
          <button onClick={next} className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#243786] text-white font-semibold text-sm hover:bg-[#141647] transition-all">
            İrəli<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#D47092] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#D47092]/20 disabled:opacity-60"
          >
            {saving ? "Göndərilir..." : "Təsdiq et və dərc et"}
            <span className="material-symbols-outlined text-[18px]">{saving ? "sync" : "check_circle"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
