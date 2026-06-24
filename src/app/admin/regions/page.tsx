"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Region {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Region | null>(null);
  const [form, setForm] = useState({ name: "", type: "city" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("regions").select("*").order("type").order("name");
    setRegions((data as Region[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = regions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ name: "", type: "city" }); setModal(true); };
  const openEdit = (r: Region) => { setEditing(r); setForm({ name: r.name, type: r.type }); setModal(true); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    if (supabase) {
      if (editing) {
        await supabase.from("regions").update({ name: form.name, type: form.type }).eq("id", editing.id);
      } else {
        await supabase.from("regions").insert({ name: form.name, type: form.type });
      }
      await load();
    }
    setSaving(false);
    setModal(false);
  };

  const toggleActive = async (r: Region) => {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("regions").update({ is_active: !r.is_active }).eq("id", r.id);
      setRegions(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x));
    }
  };

  const del = async (id: string) => {
    if (!confirm("Bu bölgəni silmək istədiyinizdən əminsiniz?")) return;
    setDeletingId(id);
    const supabase = createClient();
    if (supabase) await supabase.from("regions").delete().eq("id", id);
    setRegions(prev => prev.filter(r => r.id !== id));
    setDeletingId(null);
  };

  const cities = filtered.filter(r => r.type === "city");
  const districts = filtered.filter(r => r.type === "district");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Bölgələr</h2>
          <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${regions.length} bölgə`}</p>
        </div>
        <button onClick={openAdd} className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all self-start md:self-auto">
          <span className="material-symbols-outlined text-[18px]">add</span>Bölgə əlavə et
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE]">
        <div className="relative max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9DB1CA] text-sm">search</span>
          <input type="text" placeholder="Bölgə axtar..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none w-full" />
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex items-center justify-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
        </div>
      ) : regions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">location_on</span>
          <p className="text-[#5D608B] text-sm mb-4">Hələ bölgə əlavə edilməyib</p>
          <button onClick={openAdd} className="bg-[#141647] text-white px-5 py-2 rounded-lg text-sm font-semibold">İlk bölgəni əlavə et</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ label: "Şəhərlər", type: "city", data: cities, icon: "location_city" }, { label: "Rayonlar", type: "district", data: districts, icon: "map" }].map(group => (
            <div key={group.type} className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9E8EE]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#243786] text-xl">{group.icon}</span>
                  <h3 className="font-semibold text-[#141647]">{group.label}</h3>
                  <span className="bg-[#F3F2F7] text-[#5D608B] text-xs font-semibold px-2 py-0.5 rounded-full">{group.data.length}</span>
                </div>
                <button onClick={() => { setForm({ name: "", type: group.type }); setEditing(null); setModal(true); }}
                  className="p-1.5 text-[#243786] hover:bg-[#F3F2F7] rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              {group.data.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#5D608B]">Hələ {group.label.toLowerCase()} yoxdur</div>
              ) : (
                <div className="divide-y divide-[#E9E8EE]">
                  {group.data.map(r => (
                    <div key={r.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F3F2F7] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#9DB1CA] text-sm">location_on</span>
                        <span className="text-sm text-[#141647]">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleActive(r)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {r.is_active ? "Aktiv" : "Deaktiv"}
                        </button>
                        <button onClick={() => openEdit(r)} className="p-1 text-[#5D608B] hover:text-[#243786] transition-colors">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => del(r.id)} disabled={deletingId === r.id} className="p-1 text-[#5D608B] hover:text-red-500 transition-colors disabled:opacity-40">
                          <span className="material-symbols-outlined text-[16px]">{deletingId === r.id ? "sync" : "delete"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <h3 className="text-lg font-bold text-[#141647] mb-5">{editing ? "Bölgəni düzəlt" : "Yeni bölgə"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Ad</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Bölgə adı" className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" />
              </div>
              <div>
                <label className="text-xs text-[#5D608B] font-semibold uppercase block mb-1">Növ</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]">
                  <option value="city">Şəhər</option>
                  <option value="district">Rayon</option>
                </select>
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
