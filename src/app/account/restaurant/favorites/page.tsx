"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

function FavoritesContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "product";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">
          {type === "product" ? "Favorit məhsullar" : "Favorit təchizatçılar"}
        </h2>
        <p className="text-sm text-brand-muted">
          {type === "product"
            ? "Bəyəndiyiniz məhsullar burada saxlanılır."
            : "Etibarlı təchizatçılarınız burada saxlanılır."}
        </p>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-[#E9E8EE] w-fit">
        <a
          href="?type=product"
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            type === "product"
              ? "bg-[#141647] text-white shadow-sm"
              : "text-brand-muted hover:text-[#141647]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px] align-middle mr-1.5">inventory_2</span>
          Məhsullar
        </a>
        <a
          href="?type=supplier"
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            type === "supplier"
              ? "bg-[#141647] text-white shadow-sm"
              : "text-brand-muted hover:text-[#141647]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px] align-middle mr-1.5">local_shipping</span>
          Təchizatçılar
        </a>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
        <EmptyState
          icon={type === "product" ? "inventory_2" : "local_shipping"}
          title={type === "product" ? "Hələ favorit məhsul əlavə edilməyib" : "Hələ favorit təchizatçı əlavə edilməyib"}
          description={
            type === "product"
              ? "Məhsul kartlarındakı ürək ikonuna klikləyərək məhsulları favoritlərinizə əlavə edin."
              : "Təchizatçı profillərindəki ürək ikonuna klikləyərək təchizatçıları favoritlərinizə əlavə edin."
          }
        />
      </div>
    </div>
  );
}

export default function RestaurantFavoritesPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-16 flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-brand-soft-blue animate-spin">sync</span>
      </div>
    }>
      <FavoritesContent />
    </Suspense>
  );
}
