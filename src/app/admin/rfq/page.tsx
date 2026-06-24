"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface RFQ {
  id: string;
  restaurant_name: string;
  contact_email: string;
  product_name: string;
  quantity: number;
  unit: string;
  description: string;
  status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new:       { label: "Yeni",        color: "bg-blue-100 text-blue-700" },
  active:    { label: "Aktiv",       color: "bg-amber-100 text-amber-700" },
  closed:    { label: "Bağlandı",    color: "bg-green-100 text-green-700" },
  cancelled: { label: "Ləğv edildi", color: "bg-gray-100 text-gray-500" },
};

export default function AdminRFQPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<RFQ | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    let query = supabase.from("rfq_requests").select("*").order("created_at", { ascending: false });
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data } = await query;
    setRfqs((data as RFQ[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    const supabase = createClient();
    if (supabase) {
      await supabase.from("rfq_requests").update({ status }).eq("id", id);
      setRfqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Sorğular (RFQ)</h2>
          <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${rfqs.length} sorğu`}</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none self-start">
          <option value="">Hamısı</option>
          <option value="new">Yeni</option>
          <option value="active">Aktiv</option>
          <option value="closed">Bağlandı</option>
          <option value="cancelled">Ləğv edildi</option>
        </select>
      </div>

      {loading ? (
        <div className="p-16 flex items-center justify-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
        </div>
      ) : rfqs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">request_quote</span>
          <p className="text-[#5D608B] text-sm">Hələ sorğu yoxdur</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9E8EE]">
                  {["Restoran", "Məhsul", "Miqdar", "Status", "Tarix", "Əməliyyatlar"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-[#5D608B] uppercase font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8EE]">
                {rfqs.map(r => {
                  const st = STATUS_MAP[r.status] || { label: r.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={r.id} className="hover:bg-[#F3F2F7] transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                      <td className="px-4 py-3 text-sm font-semibold text-[#141647]">{r.restaurant_name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] max-w-[180px] truncate">{r.product_name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">{r.quantity ? `${r.quantity} ${r.unit || ""}` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#9DB1CA] whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("az-AZ")}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} disabled={updating}
                          className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-2 py-1 text-xs outline-none disabled:opacity-50">
                          <option value="new">Yeni</option>
                          <option value="active">Aktiv</option>
                          <option value="closed">Bağlandı</option>
                          <option value="cancelled">Ləğv edildi</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-[#141647]">{selected.product_name || "Sorğu"}</h3>
              <button onClick={() => setSelected(null)} className="p-1 text-[#9DB1CA] hover:text-[#5D608B]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#9DB1CA] uppercase font-semibold mb-0.5">Restoran</p>
                  <p className="text-[#141647]">{selected.restaurant_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9DB1CA] uppercase font-semibold mb-0.5">E-mail</p>
                  <p className="text-[#141647] truncate">{selected.contact_email || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9DB1CA] uppercase font-semibold mb-0.5">Miqdar</p>
                  <p className="text-[#141647]">{selected.quantity ? `${selected.quantity} ${selected.unit || ""}` : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9DB1CA] uppercase font-semibold mb-0.5">Tarix</p>
                  <p className="text-[#141647]">{new Date(selected.created_at).toLocaleDateString("az-AZ")}</p>
                </div>
              </div>
              {selected.description && (
                <div>
                  <p className="text-xs text-[#9DB1CA] uppercase font-semibold mb-1">Ətraflı</p>
                  <p className="text-sm text-[#5D608B] bg-[#F3F2F7] rounded-lg p-3 leading-relaxed">{selected.description}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {["new", "active", "closed", "cancelled"].map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={updating || selected.status === s}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${selected.status === s ? "bg-[#141647] text-white" : "bg-[#F3F2F7] text-[#5D608B] hover:bg-[#E9E8EE]"} disabled:opacity-50`}>
                  {(STATUS_MAP[s] || { label: s }).label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
