"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Review {
  id: string;
  reviewer_name: string;
  supplier_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (statusFilter === "approved") query = query.eq("is_approved", true);
    if (statusFilter === "pending") query = query.eq("is_approved", false);
    const { data } = await query;
    setReviews((data as Review[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const toggleApprove = async (r: Review) => {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("reviews").update({ is_approved: !r.is_approved }).eq("id", r.id);
      setReviews(prev => prev.map(x => x.id === r.id ? { ...x, is_approved: !r.is_approved } : x));
    }
  };

  const del = async (id: string) => {
    if (!confirm("Bu rəyi silmək istədiyinizdən əminsiniz?")) return;
    const supabase = createClient();
    if (supabase) await supabase.from("reviews").delete().eq("id", id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Rəylər</h2>
          <p className="text-sm text-[#5D608B]">{loading ? "Yüklənir..." : `${reviews.length} rəy`}</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none self-start">
          <option value="">Hamısı</option>
          <option value="approved">Təsdiqlənmiş</option>
          <option value="pending">Gözləyən</option>
        </select>
      </div>

      {loading ? (
        <div className="p-16 flex items-center justify-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-4xl text-[#9DB1CA] animate-spin">sync</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-[#E9E8EE]">
          <span className="material-symbols-outlined text-5xl text-[#E9E8EE] block mb-3">rate_review</span>
          <p className="text-[#5D608B] text-sm">Hələ rəy yoxdur</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className={`bg-white rounded-xl border p-5 transition-all ${r.is_approved ? "border-[#E9E8EE]" : "border-amber-200 bg-amber-50/30"}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#141647] text-sm">{r.reviewer_name || "İsimsiz"}</span>
                    <span className="text-[#9DB1CA] text-xs">→</span>
                    <span className="text-[#243786] text-sm font-medium">{r.supplier_name || "—"}</span>
                    <div className="flex gap-0.5 ml-2">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`material-symbols-outlined text-[14px] ${s <= (r.rating||0) ? "text-amber-400" : "text-[#E9E8EE]"}`}>star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#5D608B] leading-relaxed">{r.comment || "—"}</p>
                  <p className="text-xs text-[#9DB1CA] mt-2">{new Date(r.created_at).toLocaleDateString("az-AZ")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!r.is_approved && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-semibold rounded-full">Gözləyir</span>
                  )}
                  <button onClick={() => toggleApprove(r)} title={r.is_approved ? "Geri al" : "Təsdiqlə"}
                    className={`p-1.5 rounded-lg transition-colors ${r.is_approved ? "bg-gray-50 text-gray-400 hover:bg-gray-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                    <span className="material-symbols-outlined text-[16px]">{r.is_approved ? "undo" : "check_circle"}</span>
                  </button>
                  <button onClick={() => del(r.id)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
