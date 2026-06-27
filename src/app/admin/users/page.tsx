"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UserRow {
  id: string;
  name: string;
  role: "admin" | "supplier" | "restaurant";
  email: string;
  phone: string;
  city: string;
  approval_status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:  { label: "Gözləyir", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aktiv",    color: "bg-green-100 text-green-700" },
  rejected: { label: "Rədd",    color: "bg-red-100 text-red-700" },
  disabled: { label: "Deaktiv", color: "bg-gray-100 text-gray-500" },
  active:   { label: "Aktiv",   color: "bg-green-100 text-green-700" },
};

const ROLE_MAP: Record<string, { label: string; color: string }> = {
  admin:      { label: "Admin",       color: "bg-purple-100 text-purple-700" },
  supplier:   { label: "Təchizatçı",  color: "bg-blue-100 text-blue-700" },
  restaurant: { label: "Restoran",    color: "bg-emerald-100 text-emerald-700" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    const [
      { data: suppliers },
      { data: restaurants },
      { data: admins },
    ] = await Promise.all([
      supabase
        .from("supplier_profiles")
        .select("id, company_name, email, phone, city, approval_status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("restaurant_profiles")
        .select("id, restaurant_name, email, phone, city, approval_status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, email, phone, is_active, created_at")
        .eq("role", "admin")
        .order("created_at", { ascending: false }),
    ]);

    let combined: UserRow[] = [
      ...((suppliers || []) as { id: string; company_name: string; email: string; phone: string; city: string; approval_status: string; created_at: string }[]).map(s => ({
        id: s.id,
        name: s.company_name,
        role: "supplier" as const,
        email: s.email,
        phone: s.phone,
        city: s.city,
        approval_status: s.approval_status,
        created_at: s.created_at,
      })),
      ...((restaurants || []) as { id: string; restaurant_name: string; email: string; phone: string; city: string; approval_status: string; created_at: string }[]).map(r => ({
        id: r.id,
        name: r.restaurant_name,
        role: "restaurant" as const,
        email: r.email,
        phone: r.phone,
        city: r.city,
        approval_status: r.approval_status,
        created_at: r.created_at,
      })),
      ...((admins || []) as { id: string; full_name: string; email: string; phone: string; is_active: boolean; created_at: string }[]).map(a => ({
        id: a.id,
        name: a.full_name || a.email,
        role: "admin" as const,
        email: a.email,
        phone: a.phone || "",
        city: "",
        approval_status: a.is_active ? "approved" : "disabled",
        created_at: a.created_at,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (search) combined = combined.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    if (roleFilter) combined = combined.filter(u => u.role === roleFilter);
    if (statusFilter) combined = combined.filter(u => u.approval_status === statusFilter);

    setUsers(combined);
    setLoading(false);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (user: UserRow, status: string) => {
    if (user.role === "admin") return;
    setActionId(user.id);
    const supabase = createClient();
    if (supabase) {
      const table = user.role === "supplier" ? "supplier_profiles" : "restaurant_profiles";
      await supabase.from(table).update({ approval_status: status }).eq("id", user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, approval_status: status } : u));
    }
    setActionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">İstifadəçilər</h2>
          <p className="text-sm text-[#5D608B]">
            {loading ? "Yüklənir..." : `${users.length} istifadəçi`}
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#141647] text-white text-sm font-semibold rounded-lg hover:bg-[#243786] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Yeni istifadəçi yarat
        </Link>
      </div>

      {/* Filterlər */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9DB1CA] text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Ad və ya e-mail axtar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none w-56"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"
        >
          <option value="">Bütün rollar</option>
          <option value="admin">Admin</option>
          <option value="supplier">Təchizatçı</option>
          <option value="restaurant">Restoran</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"
        >
          <option value="">Bütün statuslar</option>
          <option value="pending">Gözləyir</option>
          <option value="approved">Aktiv</option>
          <option value="rejected">Rədd</option>
          <option value="disabled">Deaktiv</option>
        </select>
      </div>

      {/* Cədvəl */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">
              sync
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">
              person_search
            </span>
            <p className="text-[#5D608B] text-sm">İstifadəçi tapılmadı</p>
            <Link
              href="/admin/users/create"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#243786] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              İlk istifadəçini yarat
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9E8EE]">
                  {["Ad / Şirkət", "Rol", "E-mail", "Telefon", "Şəhər", "Status", "Tarix", "Əməliyyatlar"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-[#5D608B] uppercase font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8EE]">
                {users.map(u => {
                  const st = STATUS_MAP[u.approval_status] || { label: u.approval_status, color: "bg-gray-100 text-gray-600" };
                  const rl = ROLE_MAP[u.role] || { label: u.role, color: "bg-gray-100 text-gray-600" };
                  const busy = actionId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#F3F2F7] transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-[#141647] max-w-[140px] truncate">
                        {u.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${rl.color}`}>
                          {rl.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] max-w-[160px] truncate">
                        {u.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">
                        {u.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5D608B] whitespace-nowrap">
                        {u.city || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#9DB1CA] whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString("az-AZ")}
                      </td>
                      <td className="px-4 py-3">
                        {u.role === "admin" ? (
                          <span className="text-xs text-[#9DB1CA]">—</span>
                        ) : (
                          <div className="flex gap-1">
                            {u.approval_status !== "approved" && (
                              <button
                                onClick={() => updateStatus(u, "approved")}
                                disabled={busy}
                                title="Təsdiqlə"
                                className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {busy ? "sync" : "check_circle"}
                                </span>
                              </button>
                            )}
                            {u.approval_status !== "rejected" && (
                              <button
                                onClick={() => updateStatus(u, "rejected")}
                                disabled={busy}
                                title="Rədd et"
                                className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40"
                              >
                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                              </button>
                            )}
                            {u.approval_status !== "disabled" ? (
                              <button
                                onClick={() => updateStatus(u, "disabled")}
                                disabled={busy}
                                title="Deaktiv et"
                                className="p-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
                              >
                                <span className="material-symbols-outlined text-[16px]">block</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => updateStatus(u, "pending")}
                                disabled={busy}
                                title="Aktiv et"
                                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-40"
                              >
                                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                              </button>
                            )}
                          </div>
                        )}
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
