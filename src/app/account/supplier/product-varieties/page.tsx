"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductVarietiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [varieties, setVarieties] = useState<{ id: number; name: string; size: string; price: string; stock: string; image: string | null }[]>([]);

  const [form, setForm] = useState({
    product: "", name: "", size: "", brand: "", quality: "",
    price: "", minOrder: "", stock: "", note: "", active: true,
  });
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImage(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    const newVariety = {
      id: Date.now(),
      name: form.name,
      size: form.size,
      price: form.price,
      stock: form.stock,
      image: image,
    };
    setVarieties([...varieties, newVariety]);
    setForm({ product: "", name: "", size: "", brand: "", quality: "", price: "", minOrder: "", stock: "", note: "", active: true });
    setImage(null);
    setShowForm(false);
  };

  const deleteVariety = (id: number) => {
    setVarieties(varieties.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Məhsul çeşidləri</h2>
          <p className="text-sm text-brand-muted">Məhsullarınızın müxtəlif variantlarını əlavə edin.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">{showForm ? "close" : "add"}</span>
          {showForm ? "Bağla" : "Yeni çeşid əlavə et"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8">
          <h3 className="text-lg font-semibold text-[#141647] mb-6">Yeni məhsul çeşidi</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Əsas məhsul", name: "product", type: "select", placeholder: "" },
                { label: "Çeşid adı", name: "name", placeholder: "Məs: 5 Kq-lıq paket" },
                { label: "Ölçü / Paket", name: "size", placeholder: "Məs: 5 Kq" },
                { label: "Marka", name: "brand", placeholder: "Məs: AzərMarka" },
                { label: "Keyfiyyət növü", name: "quality", placeholder: "Məs: Premium" },
                { label: "Qiymət (AZN)", name: "price", placeholder: "0.00", type: "number" },
                { label: "Minimum sifariş", name: "minOrder", placeholder: "10", type: "number" },
                { label: "Stok", name: "stock", placeholder: "100", type: "number" },
              ].map((f) => (
                <div key={f.name} className="space-y-1">
                  <label className="text-xs text-brand-muted font-semibold">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
                    >
                      <option value="">Məhsul seçin</option>
                      <option>Məhsul 1</option>
                      <option>Məhsul 2</option>
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] placeholder:text-brand-soft-blue"
                    />
                  )}
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Qeyd</label>
                <textarea
                  placeholder="Əlavə qeyd..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] resize-none placeholder:text-brand-soft-blue"
                />
              </div>
            </div>

            {/* Şəkil yükləmə */}
            <div className="space-y-3">
              <label className="text-xs text-brand-muted font-semibold">Çeşid şəkli</label>
              {image ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-[#243786]/30">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#E9E8EE] rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center hover:border-[#243786]/50 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-brand-soft-blue">add_a_photo</span>
                  <p className="text-sm font-semibold text-[#141647]">Şəkil yüklə</p>
                  <p className="text-xs text-brand-muted">JPG, PNG (max 2MB)</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Aktiv */}
            <label className="flex items-center gap-2 text-sm text-[#141647] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#243786]" />
              Aktiv
            </label>

            <button type="submit" className="bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Yadda saxla
            </button>
          </form>
        </div>
      )}

      {/* Varieties List */}
      {varieties.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
          <EmptyState icon="style" title="Hələ məhsul çeşidi əlavə edilməyib" description="Məhsul variantlarınızı (ölçü, paket, marka) əlavə edərək restoranlara daha çox seçim təqdim edin." />
        </div>
      ) : varieties.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#E9E8EE]">
                {["Şəkil", "Çeşid adı", "Ölçü", "Qiymət", "Stok", "Əməliyyatlar"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E8EE]">
              {varieties.map((v) => (
                <tr key={v.id} className="hover:bg-[#F3F2F7] transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F3F2F7] overflow-hidden flex items-center justify-center">
                      {v.image ? (
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-brand-soft-blue text-xl">image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#141647]">{v.name}</td>
                  <td className="px-4 py-3 text-sm text-brand-muted">{v.size}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#141647]">{v.price} ₼</td>
                  <td className="px-4 py-3 text-sm text-brand-muted">{v.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-brand-soft-blue hover:text-[#243786] transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => deleteVariety(v.id)} className="p-1.5 text-brand-soft-blue hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
