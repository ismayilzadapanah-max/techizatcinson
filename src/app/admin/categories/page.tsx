"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const ICONS = ["category", "restaurant", "local_shipping", "inventory_2", "kitchen", "liquor", "agriculture", "bakery_dining", "set_meal", "coffee", "cake", "grass", "egg", "water_drop", "cleaning_services", "handyman", "storefront"];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "category", order_index: 0 });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("categories").select("*").order("order_index").order("name");
    setCats((data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", icon: "category", order_index: cats.length }); setModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, icon: c.icon, order_index: c.order_index }); setModal(true); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    if (supabase) {
      const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (editing) {
        await supabase.from("categories").update({ name: form.name, icon: form.icon, order_index: form.order_index, slug }).eq("id", editing.id);
      } else {
        await supabase.from("categories").insert({ name: form.name, icon: form.icon, order_index: form.order_index, slug });
      }
      await load();
    }
    setSaving(false);
    setModal(false);
  };

  const toggleActive = async (c: Category) => {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("categories").update({ is_active: !c.is_active }).eq("id", c.id);
      setCats(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !c.is_active } : x));
    }
  };

  const del = async (id: string) => {
    if (!confirm("Bu kateqoriyanı silmək istədiyinizdən əminsiniz?")) return;
    setDeletingId(id);
    const supabase = createClient();
    if (supabase) { await supabase.from("categories").delete().eq("id", id); }
    setCats(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Kateqoriyalar</h2>
          <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${cats.length} kateqoriya`}</p>
        </div>
        <button onClick={openAdd} className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all self-start md:self-auto">
          <span className="material-symbols-outlined text-[18px]">add</span>Kateqoriya əlavə et
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
          </div>
        ) : cats.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">category</span>
            <p className="text-[#5D608B] text-sm mb-4">Hələ kateqoriya əlavə edilməyib</p>
            <button onClick={openAdd} className="bg-[#141647] text-white px-5 py-2 rounded-lg text-sm font-semibold">İlk kateqoriyanı əlavə et</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9E8EE]">
                  {["İkon", "Ad", "Sıra", "Status", "Tarix", "Əməliyyatlar"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-[#5D608B] uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8EE]">
                {cats.map(c => (
                  <tr key={c.id} className="hover:bg-[#F3F2F7] transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 bg-[#F3F2F7] rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#243786] text-xl">{c.icon}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#141647]">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-[#5D608B]">{c.order_index}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(c)} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${c.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                        {c.is_active ? "Aktiv" : "Deaktiv"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#9DB1CA]">{new Date(c.created_at).toLocaleDateString("az-AZ")}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Düzəliş et">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => del(c.id)} disabled={deletingId === c.id} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40" title="Sil">
                          <span className="material-symbols-outlined text-[16px]">{deletingId === c.id ? "sync" : "delete"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3 className="text-lg font-bold text-[#141647] mb-5">{editing ? "Kateqoriyanı düzəlt" : "Yeni kateqoriya"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Ad</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Kateqoriya adı" className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" />
              </div>
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-2">İkon</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICONS.map(ico => (
                    <button key={ico} onClick={() => setForm({ ...form, icon: ico })}
                      className={`p-2 rounded-lg flex items-center justify-center transition-colors ${form.icon === ico ? "bg-[#141647] text-white" : "bg-[#F3F2F7] text-[#5D608B] hover:bg-[#E9E8EE]"}`}>
                      <span className="material-symbols-outlined text-xl">{ico}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Sıra nömrəsi</label>
                <input type="number" value={form.order_index} onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 border border-[#E9E8EE] rounded-lg text-sm font-semibold text-[#5D608B] hover:bg-[#F3F2F7]">Ləğv et</button>
              <button onClick={save} disabled={saving || !form.name.trim()} className="flex-1 py-2.5 bg-[#141647] text-white rounded-lg text-sm font-semibold hover:bg-[#243786] disabled:opacity-50">
                {saving ? "Saxlanılır..." : editing ? "Yadda saxla" : "Əlavə et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
