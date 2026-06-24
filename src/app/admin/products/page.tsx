"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  product_name: string;
  supplier_name: string;
  category_name: string;
  price: number;
  price_unit: string;
  stock_qty: number;
  approval_status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:  { label: "Gözləyir", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aktiv",    color: "bg-green-100 text-green-700" },
  rejected: { label: "Rədd",    color: "bg-red-100 text-red-700" },
  disabled: { label: "Deaktiv", color: "bg-gray-100 text-gray-500" },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    let query = supabase
      .from("product_listings")
      .select("id, product_name, supplier_name, category_name, price, price_unit, stock_qty, approval_status, created_at")
      .order("created_at", { ascending: false });
    if (statusFilter) query = query.eq("approval_status", statusFilter);
    if (search) query = query.ilike("product_name", `%${search}%`);
    const { data } = await query;
    setProducts((data as Product[]) || []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    const supabase = createClient();
    if (supabase) {
      await supabase.from("product_listings").update({ approval_status: status }).eq("id", id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, approval_status: status } : p));
    }
    setActionId(null);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Bu məhsulu silmək istədiyinizdən əminsiniz?")) return;
    setActionId(id);
    const supabase = createClient();
    if (supabase) {
      await supabase.from("product_listings").delete().eq("id", id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    setActionId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Məhsul Elanları</h2>
        <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${products.length} məhsul elanı`}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9DB1CA] text-sm">search</span>
          <input
            type="text"
            placeholder="Məhsul adı axtar..."
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

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">inventory_2</span>
            <p className="text-[#5D608B] text-sm">Məhsul tapılmadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9E8EE]">
                  {["Məhsul", "Təchizatçı", "Kateqoriya", "Qiymət", "Stok", "Status", "Tarix", "Əməliyyatlar"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-[#5D608B] uppercase font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8EE]">
                {products.map(p => {
                  const st = STATUS_MAP[p.approval_status] || { label: p.approval_status, color: "bg-gray-100 text-gray-600" };
                  const busy = actionId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-[#F3F2F7] transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-[#141647] max-w-[150px] truncate">{p.product_name}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] max-w-[120px] truncate">{p.supplier_name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">{p.category_name || "—"}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#141647] whitespace-nowrap">{Number(p.price).toFixed(2)} ₼/{p.price_unit}</td>
                      <td className="px-4 py-3 text-sm text-[#5D608B]">{p.stock_qty}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#9DB1CA] whitespace-nowrap">
                        {new Date(p.created_at).toLocaleDateString("az-AZ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {p.approval_status !== "approved" && (
                            <button onClick={() => updateStatus(p.id, "approved")} disabled={busy} title="Təsdiqlə"
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40">
                              <span className="material-symbols-outlined text-[16px]">{busy ? "sync" : "check_circle"}</span>
                            </button>
                          )}
                          {p.approval_status !== "rejected" && (
                            <button onClick={() => updateStatus(p.id, "rejected")} disabled={busy} title="Rədd et"
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40">
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                            </button>
                          )}
                          <button onClick={() => deleteProduct(p.id)} disabled={busy} title="Sil"
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
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
