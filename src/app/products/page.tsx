"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { GridListToggle } from "@/components/marketplace/GridListToggle";
import { EmptyState } from "@/components/ui/EmptyState";
import { EMPTY_STATES } from "@/lib/constants";

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const products: never[] = [];

  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      {/* Page Header */}
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Məhsullar</h1>
          <p className="text-sm text-on-surface-variant">Bütün məhsul elanlarını axtarın, filtrləyin və müqayisə edin.</p>
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3 hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Main */}
          <div className="col-span-12 lg:col-span-9">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm border border-[#E9E8EE]">
              <span className="text-sm text-[#141647] font-semibold">
                Nəticələr: <span className="text-[#243786]">0 tapıldı</span>
              </span>
              <div className="flex items-center gap-4">
                <select className="bg-transparent border-none text-sm font-semibold text-[#141647] focus:ring-0 cursor-pointer">
                  <option>Ən yenilər</option>
                  <option>Qiymət: Ucuzdan bahaya</option>
                  <option>Qiymət: Bahadan ucuza</option>
                </select>
                <div className="h-6 w-px bg-[#E9E8EE]" />
                <GridListToggle view={view} onChange={setView} />
              </div>
            </div>

            {/* Content */}
            {products.length === 0 ? (
              <EmptyState
                icon={EMPTY_STATES.noResults.icon}
                title={EMPTY_STATES.noResults.title}
                description={EMPTY_STATES.noResults.description}
              />
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {/* Product cards would render here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
