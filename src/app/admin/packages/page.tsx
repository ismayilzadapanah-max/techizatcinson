"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Plan {
  id: string;
  name: string;
  price: number;
  listing_limit: number;
  features: string[];
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
}

export default function AdminPackagesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", price: "", listing_limit: "10", features: "", is_featured: false });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("subscription_plans").select("*").order("order_index").order("price");
    setPlans((data as Plan[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", price: "", listing_limit: "10", features: "", is_featured: false }); setModal(true); };
  const openEdit = (p: Plan) => {
    setEditing(p);
    setForm({ name: p.name, price: String(p.price), listing_limit: String(p.listing_limit), features: (p.features || []).join("\n"), is_featured: p.is_featured });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    if (supabase) {
      const featuresArr = form.features.split("\n").map(f => f.trim()).filter(Boolean);
      const payload = {
        name: form.name,
        price: parseFloat(form.price) || 0,
        listing_limit: parseInt(form.listing_limit) || 10,
        features: featuresArr,
        is_featured: form.is_featured,
        order_index: editing ? editing.order_index : plans.length,
      };
      if (editing) await supabase.from("subscription_plans").update(payload).eq("id", editing.id);
      else await supabase.from("subscription_plans").insert(payload);
      await load();
    }
    setSaving(false);
    setModal(false);
  };

  const toggleActive = async (p: Plan) => {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("subscription_plans").update({ is_active: !p.is_active }).eq("id", p.id);
      setPlans(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x));
    }
  };

  const del = async (id: string) => {
    if (!confirm("Bu paketi silmək istədiyinizdən əminsiniz?")) return;
    setDeletingId(id);
    const supabase = createClient();
    if (supabase) await supabase.from("subscription_plans").delete().eq("id", id);
    setPlans(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Abunəlik Paketləri</h2>
          <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${plans.length} paket`}</p>
        </div>
        <button onClick={openAdd} className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all self-start md:self-auto">
          <span className="material-symbols-outlined text-[18px]">add</span>Yeni paket
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex items-center justify-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">package_2</span>
          <p className="text-[#5D608B] text-sm mb-4">Hələ paket əlavə edilməyib</p>
          <button onClick={openAdd} className="bg-[#141647] text-white px-5 py-2 rounded-lg text-sm font-semibold">İlk paketi yarad</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${p.is_featured ? "border-[#D47092] ring-2 ring-[#D47092]/20" : "border-[#E9E8EE]"}`}>
              {p.is_featured && (
                <div className="bg-[#D47092] text-white text-xs font-semibold text-center py-1.5">Populyar</div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#141647]">{p.name}</h3>
                    <p className="text-2xl font-black text-[#243786] mt-1">{p.price === 0 ? "Pulsuz" : `${p.price} ₼`}<span className="text-sm font-normal text-[#5D608B]">/ay</span></p>
                  </div>
                  <button onClick={() => toggleActive(p)} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.is_active ? "Aktiv" : "Deaktiv"}
                  </button>
                </div>

                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center gap-2 text-sm text-[#5D608B]">
                    <span className="material-symbols-outlined text-green-500 text-[16px]">check</span>
                    {p.listing_limit} məhsul elanı
                  </div>
                  {(p.features || []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#5D608B]">
                      <span className="material-symbols-outlined text-green-500 text-[16px]">check</span>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#E9E8EE]">
                  <button onClick={() => openEdit(p)} className="flex-1 py-2 border border-[#E9E8EE] text-[#5D608B] rounded-lg text-sm font-semibold hover:bg-[#F3F2F7] transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">edit</span>Düzəlt
                  </button>
                  <button onClick={() => del(p.id)} disabled={deletingId === p.id} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                    <span className="material-symbols-outlined text-[18px]">{deletingId === p.id ? "sync" : "delete"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#141647] mb-5">{editing ? "Paketi düzəlt" : "Yeni paket"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Paket adı</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Məs: Standart, Premium..." className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Qiymət (₼/ay)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" />
                </div>
                <div>
                  <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Elan limiti</label>
                  <input type="number" value={form.listing_limit} onChange={e => setForm({ ...form, listing_limit: e.target.value })} placeholder="10" className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Xüsusiyyətlər (hər sətirdə bir)</label>
                <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={4} placeholder={"Prioritet görünüm\nWhatsApp dəstəyi\nAnalitika paneli"} className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786] resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                <span className="text-sm text-[#141647]">Populyar kimi göstər</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 border border-[#E9E8EE] rounded-lg text-sm font-semibold text-[#5D608B] hover:bg-[#F3F2F7]">Ləğv et</button>
              <button onClick={save} disabled={saving || !form.name.trim()} className="flex-1 py-2.5 bg-[#141647] text-white rounded-lg text-sm font-semibold hover:bg-[#243786] disabled:opacity-50">
                {saving ? "Saxlanılır..." : editing ? "Yadda saxla" : "Yarad"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
