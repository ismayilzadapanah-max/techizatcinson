"use client";

import { useState } from "react";
import { createOrderReview } from "@/lib/orders";
import type { OrderReview } from "@/lib/types";

interface Props {
  orderId: string;
  restaurantId: string;
  supplierId: string;
  existingReview?: OrderReview | null;
  onReviewed: () => void;
}

export function OrderReviewForm({ orderId, restaurantId, supplierId, existingReview, onReviewed }: Props) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [satisfaction, setSatisfaction] = useState(existingReview?.satisfactionScore ?? 0);
  const [qualityNote, setQualityNote] = useState(existingReview?.qualityNote ?? "");
  const [deliveryNote, setDeliveryNote] = useState(existingReview?.deliveryNote ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(!!existingReview);

  if (done && existingReview) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-green-600">task_alt</span>
          <p className="font-semibold text-green-800 text-sm">Qiymətləndirməyə görə təşəkkürlər!</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-[20px] ${i < existingReview.rating ? "text-amber-400" : "text-gray-300"}`}
            >
              star
            </span>
          ))}
          <span className="text-sm text-[#5D608B] ml-2">{existingReview.rating}/5</span>
        </div>
        {existingReview.satisfactionScore != null && (
          <p className="text-sm text-[#5D608B]">
            Məmnuniyyət balı: <strong className="text-[#141647]">{existingReview.satisfactionScore}/10</strong>
          </p>
        )}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Zəhmət olmasa ulduz reytinqi seçin.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await createOrderReview({
      orderId,
      restaurantId,
      supplierId,
      rating,
      qualityNote: qualityNote.trim() || undefined,
      deliveryNote: deliveryNote.trim() || undefined,
      satisfactionScore: satisfaction > 0 ? satisfaction : undefined,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
    onReviewed();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      {/* Star rating */}
      <div>
        <label className="block text-xs font-semibold text-[#141647] mb-2">
          Keyfiyyət reytinqi <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <span
                className={`material-symbols-outlined text-3xl transition-colors ${
                  star <= rating ? "text-amber-400" : "text-[#E9E8EE]"
                }`}
              >
                star
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-[#5D608B] self-center">{rating > 0 ? `${rating}/5` : "Seçin"}</span>
        </div>
      </div>

      {/* Satisfaction score 1-10 */}
      <div>
        <label className="block text-xs font-semibold text-[#141647] mb-2">
          Məmnuniyyət balı (1–10)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSatisfaction(n)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                satisfaction === n
                  ? "bg-[#141647] text-white border-[#141647]"
                  : "bg-white text-[#5D608B] border-[#E9E8EE] hover:border-[#243786] hover:text-[#243786]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Quality note */}
      <div>
        <label className="block text-xs font-semibold text-[#141647] mb-1.5">Keyfiyyət haqqında qeyd</label>
        <textarea
          value={qualityNote}
          onChange={(e) => setQualityNote(e.target.value)}
          rows={2}
          placeholder="Məhsulun keyfiyyəti haqqında..."
          className="w-full px-3 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors resize-none"
        />
      </div>

      {/* Delivery note */}
      <div>
        <label className="block text-xs font-semibold text-[#141647] mb-1.5">Çatdırılma haqqında qeyd</label>
        <textarea
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          rows={2}
          placeholder="Çatdırılma xidməti haqqında..."
          className="w-full px-3 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-[#D47092] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
            Göndərilir...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">star</span>
            Qiymətləndirməni göndər
          </>
        )}
      </button>
    </form>
  );
}
