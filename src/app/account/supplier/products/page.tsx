"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { EmptyState } from "@/components/ui/EmptyState";

interface Product {
  id: string;
  product_name: string;
  category_name: string;
  price: number;
  price_unit: string;
  min_order_qty: number;
  stock_qty: number;
  approval_status: string;
  view_count: number;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:  { label: "Gözləyir", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aktiv",    color: "bg-green-100 text-green-700" },
  rejected: { label: "Rədd",    color: "bg-red-100 text-red-700" },
  disabled: { label: "Deaktiv", color: "bg-gray-100 text-gray-500" },
};

export default function SupplierProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    supabase
      .from("product_listings")
      .select("id, product_name, category_name, price, price_unit, min_order_qty, stock_qty, approval_status, view_count, created_at")
      .eq("supplier_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, [user]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Bu məhsulu silmək istədiyinizdən əminsiniz?")) return;
    setDeletingId(id);
    const supabase = createClient();
    if (supabase) {
      await supabase.from("product_listings").delete().eq("id", id);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Məhsullarım</h2>
          <p className="text-sm text-brand-muted">
            {loading ? "Yüklənir..." : `${products.length} məhsul elanı`}
          </p>
        </div>
        <Link
          href="/account/supplier/products/create"
          className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Yeni məhsul əlavə et
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-brand-soft-blue animate-spin">sync</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon="inventory"
              title="Hələ məhsul əlavə edilməyib"
              description="Yeni məhsul əlavə etmək üçün yuxarıdakı düyməyə klikləyin."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9E8EE]">
                  {["Məhsul", "Kateqoriya", "Qiymət", "Min. Sifariş", "Stok", "Status", "Baxış", "Əməliyyatlar"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8EE]">
                {products.map((p) => {
                  const st = STATUS_MAP[p.approval_status] || { label: p.approval_status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={p.id} className="hover:bg-[#F3F2F7] transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-[#141647] max-w-[160px] truncate">{p.product_name}</td>
                      <td className="px-4 py-3 text-sm text-brand-muted">{p.category_name || "—"}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#141647] whitespace-nowrap">{Number(p.price).toFixed(2)} ₼/{p.price_unit}</td>
                      <td className="px-4 py-3 text-sm text-brand-muted whitespace-nowrap">{p.min_order_qty} {p.price_unit}</td>
                      <td className="px-4 py-3 text-sm text-brand-muted">{p.stock_qty ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-muted">{p.view_count || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Link
                            href={`/products/${p.id}`}
                            className="p-1.5 text-brand-soft-blue hover:text-[#243786] transition-colors"
                            title="Bax"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </Link>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-brand-soft-blue hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Sil"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {deletingId === p.id ? "sync" : "delete"}
                            </span>
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
