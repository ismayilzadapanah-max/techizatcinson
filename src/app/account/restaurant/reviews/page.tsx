"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function RestaurantReviewsPage() {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<{ id: number; target: string; rating: number; comment: string; date: string }[]>([]);
  const [form, setForm] = useState({ target: "", rating: "5", comment: "" });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.target || !form.comment) return;
    setReviews([{ id: Date.now(), target: form.target, rating: Number(form.rating), comment: form.comment, date: new Date().toLocaleDateString("az") }, ...reviews]);
    setForm({ target: "", rating: "5", comment: "" });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Rəylərim</h2>
          <p className="text-sm text-brand-muted">Təchizatçılar və məhsullar haqqında yazdığınız rəylər.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">{showForm ? "close" : "add"}</span>
          {showForm ? "Bağla" : "Rəy yaz"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8">
          <h3 className="text-lg font-semibold text-[#141647] mb-6">Yeni rəy</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Təchizatçı / Məhsul</label>
                <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" required>
                  <option value="">Seçin</option>
                  <option>Təchizatçı A</option>
                  <option>Məhsul B</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Reytinq</label>
                <div className="flex gap-1 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: String(star) })}
                      className="material-symbols-outlined text-2xl transition-colors"
                      style={{
                        fontVariationSettings: star <= Number(form.rating) ? "'FILL' 1" : "'FILL' 0",
                        color: star <= Number(form.rating) ? "#F59E0B" : "#D1D1DB",
                      }}
                    >
                      star
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-brand-muted font-semibold">Rəyiniz</label>
              <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={4} placeholder="Təcrübənizi bölüşün..." className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] resize-none placeholder:text-brand-soft-blue" required />
            </div>
            <button type="submit" className="bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">send</span> Göndər
            </button>
            {saved && <p className="text-green-600 text-sm flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Rəy göndərildi!</p>}
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
          <EmptyState icon="star" title="Hələ rəy yazılmayıb" description="Təchizatçı və məhsullar haqqında rəy bildirərək digər restoranlara kömək edin." />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#141647] text-sm">{r.target}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]" style={{ color: i < r.rating ? "#F59E0B" : "#D1D1DB", fontVariationSettings: i < r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-brand-muted">{r.date}</span>
              </div>
              <p className="text-sm text-brand-muted">{r.comment}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
