"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  city: string;
  activity_area: string;
  phone: string;
  email: string;
  approval_status: string;
  product_count: number;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:  { label: "Gözləyir", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aktiv",    color: "bg-green-100 text-green-700" },
  rejected: { label: "Rədd",    color: "bg-red-100 text-red-700" },
  disabled: { label: "Deaktiv", color: "bg-gray-100 text-gray-500" },
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    let query = supabase
      .from("supplier_profiles")
      .select("id, company_name, contact_person, city, activity_area, phone, email, approval_status, product_count, created_at")
      .order("created_at", { ascending: false });
    if (statusFilter) query = query.eq("approval_status", statusFilter);
    if (search) query = query.ilike("company_name", `%${search}%`);
    const { data } = await query;
    setSuppliers((data as Supplier[]) || []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    const supabase = createClient();
    if (supabase) {
      await supabase.from("supplier_profiles").update({ approval_status: status }).eq("id", id);
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, approval_status: status } : s));
    }
    setActionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Təchizatçılar</h2>
          <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${suppliers.length} qeydiyyatlı təchizatçı`}</p>
        </div>
      </div>

      {/* Filterlər */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9DB1CA] text-sm">search</span>
          <input
            type="text"
            placeholder="Şirkət adı axtar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none w-52"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"
        >
          <option value="">Bütün statuslar</option>
          <option value="pending">Gözləyir</option>
          <option value="approved">Aktiv</option>
          <option value="rejected">Rədd edilmiş</option>
          <option value="disabled">Deaktiv</option>
        </select>
      </div>

      {/* Cədvəl */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">local_shipping</span>
            <p className="text-[#5D608B] text-sm">Təchizatçı tapılmadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9E8EE]">
                  {["Şirkət", "Şəhər", "Fəaliyyət sahəsi", "Telefon", "Məhsul", "Status", "Tarix", "Əməliyyatlar"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-[#5D608B] uppercase font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8EE]">
                {suppliers.map(s => {
                  const st = STATUS_MAP[s.approval_status] || { label: s.approval_status, color: "bg-gray-100 text-gray-600" };
                  const busy = actionId === s.id;
                  return (
                    <tr key={s.id} className="hover:bg-[#F3F2F7] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#141647]">{s.company_name}</p>
                        <p className="text-xs text-[#5D608B]">{s.contact_person}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">{s.city || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">{s.activity_area || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">{s.phone || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] text-center">{s.product_count || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#9DB1CA] whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString("az-AZ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {s.approval_status !== "approved" && (
                            <button
                              onClick={() => updateStatus(s.id, "approved")}
                              disabled={busy}
                              title="Təsdiqlə"
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <span className="material-symbols-outlined text-[16px]">{busy ? "sync" : "check_circle"}</span>
                            </button>
                          )}
                          {s.approval_status !== "rejected" && (
                            <button
                              onClick={() => updateStatus(s.id, "rejected")}
                              disabled={busy}
                              title="Rədd et"
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                            </button>
                          )}
                          {s.approval_status !== "disabled" ? (
                            <button
                              onClick={() => updateStatus(s.id, "disabled")}
                              disabled={busy}
                              title="Deaktiv et"
                              className="p-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <span className="material-symbols-outlined text-[16px]">block</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(s.id, "pending")}
                              disabled={busy}
                              title="Aktiv et"
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <span className="material-symbols-outlined text-[16px]">play_circle</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
