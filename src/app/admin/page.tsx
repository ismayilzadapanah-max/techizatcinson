"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  suppliers: number;
  restaurants: number;
  products: number;
  pendingSuppliers: number;
  pendingProducts: number;
}

interface PendingSupplier {
  id: string;
  company_name: string;
  activity_area: string;
  city: string;
  created_at: string;
}

interface RecentReg {
  id: string;
  name: string;
  type: "supplier" | "restaurant";
  city: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:  { label: "Gözləyir", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aktiv",    color: "bg-green-100 text-green-700" },
  rejected: { label: "Rədd",    color: "bg-red-100 text-red-700" },
  disabled: { label: "Deaktiv", color: "bg-gray-100 text-gray-500" },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ suppliers: 0, restaurants: 0, products: 0, pendingSuppliers: 0, pendingProducts: 0 });
  const [pendingSuppliers, setPendingSuppliers] = useState<PendingSupplier[]>([]);
  const [recentRegs, setRecentRegs] = useState<RecentReg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    async function load() {
      const [
        { count: supplierCount },
        { count: restaurantCount },
        { count: productCount },
        { count: pendingSupCount },
        { count: pendingProdCount },
        { data: pendingSup },
        { data: recentSup },
        { data: recentRest },
      ] = await Promise.all([
        supabase!.from("supplier_profiles").select("*", { count: "exact", head: true }),
        supabase!.from("restaurant_profiles").select("*", { count: "exact", head: true }),
        supabase!.from("product_listings").select("*", { count: "exact", head: true }),
        supabase!.from("supplier_profiles").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
        supabase!.from("product_listings").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
        supabase!.from("supplier_profiles").select("id, company_name, activity_area, city, created_at").eq("approval_status", "pending").order("created_at", { ascending: false }).limit(5),
        supabase!.from("supplier_profiles").select("id, company_name, city, created_at").order("created_at", { ascending: false }).limit(5),
        supabase!.from("restaurant_profiles").select("id, restaurant_name, city, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        suppliers: supplierCount || 0,
        restaurants: restaurantCount || 0,
        products: productCount || 0,
        pendingSuppliers: pendingSupCount || 0,
        pendingProducts: pendingProdCount || 0,
      });

      setPendingSuppliers((pendingSup as PendingSupplier[]) || []);

      const combined: RecentReg[] = [
        ...((recentSup || []) as { id: string; company_name: string; city: string; created_at: string }[]).map(s => ({ id: s.id, name: s.company_name, type: "supplier" as const, city: s.city, created_at: s.created_at })),
        ...((recentRest || []) as { id: string; restaurant_name: string; city: string; created_at: string }[]).map(r => ({ id: r.id, name: r.restaurant_name, type: "restaurant" as const, city: r.city, created_at: r.created_at })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
      setRecentRegs(combined);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Təchizatçılar", value: stats.suppliers, icon: "local_shipping", href: "/admin/suppliers", color: "text-[#243786]", bg: "bg-blue-50" },
    { label: "Restoranlar", value: stats.restaurants, icon: "restaurant", href: "/admin/restaurants", color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Məhsul elanları", value: stats.products, icon: "inventory_2", href: "/admin/products", color: "text-violet-700", bg: "bg-violet-50" },
    { label: "Gözləyən təsdiqlər", value: stats.pendingSuppliers + stats.pendingProducts, icon: "how_to_reg", href: "/admin/suppliers", color: "text-amber-700", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Admin Dashboard</h2>
        <p className="text-sm text-[#5D608B]">Platformanın cari vəziyyətinə nəzarət edin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl p-5 shadow-sm border border-[#E9E8EE] hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#141647]">{loading ? "—" : s.value}</p>
              <p className="text-xs text-[#5D608B]">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Son qeydiyyatlar */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9E8EE]">
            <h3 className="text-base font-semibold text-[#141647]">Son Qeydiyyatlar</h3>
            <span className="text-xs text-[#5D608B]">{loading ? "..." : `${recentRegs.length} nəticə`}</span>
          </div>
          {loading ? (
            <div className="p-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#9DB1CA] animate-spin">sync</span>
            </div>
          ) : recentRegs.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#5D608B]">Hələ qeydiyyat yoxdur</div>
          ) : (
            <div className="divide-y divide-[#E9E8EE]">
              {recentRegs.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F3F2F7] transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${r.type === "supplier" ? "bg-blue-100" : "bg-emerald-100"}`}>
                    <span className={`material-symbols-outlined text-sm ${r.type === "supplier" ? "text-blue-600" : "text-emerald-600"}`}>
                      {r.type === "supplier" ? "local_shipping" : "restaurant"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#141647] truncate">{r.name}</p>
                    <p className="text-xs text-[#5D608B]">{r.type === "supplier" ? "Təchizatçı" : "Restoran"} • {r.city}</p>
                  </div>
                  <p className="text-xs text-[#9DB1CA] flex-shrink-0">{new Date(r.created_at).toLocaleDateString("az-AZ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gözləyən təsdiqlər */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9E8EE]">
            <h3 className="text-base font-semibold text-[#141647]">Gözləyən Təsdiqlər</h3>
            {stats.pendingSuppliers > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingSuppliers}</span>
            )}
          </div>
          {loading ? (
            <div className="p-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#9DB1CA] animate-spin">sync</span>
            </div>
          ) : pendingSuppliers.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#5D608B]">
              <span className="material-symbols-outlined text-3xl text-green-400 block mb-2">check_circle</span>
              Gözləyən təsdiq yoxdur
            </div>
          ) : (
            <div className="divide-y divide-[#E9E8EE]">
              {pendingSuppliers.map((s) => (
                <div key={s.id} className="px-4 py-3 hover:bg-[#F3F2F7] transition-colors">
                  <p className="text-sm font-medium text-[#141647] truncate">{s.company_name}</p>
                  <p className="text-xs text-[#5D608B]">{s.activity_area} • {s.city}</p>
                  <Link href="/admin/suppliers" className="text-xs text-[#243786] font-medium hover:underline mt-1 inline-block">Bax →</Link>
                </div>
              ))}
              {stats.pendingSuppliers > 5 && (
                <div className="px-4 py-3 text-center">
                  <Link href="/admin/suppliers" className="text-xs text-[#243786] font-semibold hover:underline">
                    + {stats.pendingSuppliers - 5} daha çox
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
