"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { EMPTY_STATES, CATEGORIES } from "@/lib/constants";

interface SupplierRow {
  id: string;
  company_name: string;
  activity_area?: string;
  city?: string;
  rating?: number;
  product_count?: number;
  review_count?: number;
  logo_url?: string;
  is_public?: boolean;
  is_active?: boolean;
}

export default function SuppliersPage() {
  const supabase = useMemo(() => createClient()!, []);
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("supplier_profiles")
          .select("*")
          .eq("is_public", true)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (search) query = query.ilike("company_name", `%${search}%`);
        if (categoryFilter) query = query.eq("activity_area", categoryFilter);
        if (cityFilter) query = query.ilike("city", `%${cityFilter}%`);

        const { data } = await query;
        setSuppliers((data as SupplierRow[]) || []);
      } catch {
        setSuppliers([]);
      }
      setLoading(false);
    };
    load();
  }, [search, categoryFilter, cityFilter]);

  const cities = [...new Set(suppliers.map((s) => s.city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Təchizatçılar</h1>
          <p className="text-sm text-on-surface-variant">Platformadakı bütün təchizatçı profillərini axtarın və müqayisə edin.</p>
        </div>
      </div>

      <div className="bg-white border-b border-[#E9E8EE] py-4">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="Şirkət adı..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#243786] w-48" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2.5 text-sm outline-none">
            <option value="">Bütün kateqoriyalar</option>
            {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2.5 text-sm outline-none">
            <option value="">Bütün bölgələr</option>
            {cities.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <span className="text-sm text-brand-muted ml-auto">{loading ? "Axtarılır..." : `${suppliers.length} təchizatçı tapıldı`}</span>
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined text-3xl text-brand-soft-blue animate-spin">sync</span></div>
        ) : suppliers.length === 0 ? (
          <EmptyState icon={EMPTY_STATES.noSuppliers.icon} title={EMPTY_STATES.noSuppliers.title} description={EMPTY_STATES.noSuppliers.description} cta={EMPTY_STATES.noSuppliers.cta} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((s) => (
              <Link key={s.id} href={`/suppliers/${s.id}`} className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6 hover:shadow-md hover:border-[#243786]/20 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-[#F3F2F7] flex items-center justify-center overflow-hidden">
                    {s.logo_url ? <img src={s.logo_url} alt={s.company_name} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-2xl text-brand-muted">business</span>}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#141647]">{s.company_name}</h3>
                    <p className="text-xs text-brand-muted">{s.activity_area ? CATEGORIES.find((c) => c.id === s.activity_area)?.name || s.activity_area : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-brand-muted">
                  {s.city && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{s.city}</span>}
                  {s.rating ? <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-secondary">star</span>{s.rating}</span> : null}
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">inventory_2</span>{s.product_count || 0} məhsul</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
