"use client";

import { useState } from "react";

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, string | boolean>) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    region: "",
    minPrice: "",
    maxPrice: "",
    minOrder: "1",
    freeDelivery: false,
    verified: false,
  });

  const handleChange = (key: string, value: string | boolean) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const clearFilters = () => {
    const empty = {
      search: "",
      category: "",
      region: "",
      minPrice: "",
      maxPrice: "",
      minOrder: "1",
      freeDelivery: false,
      verified: false,
    };
    setFilters(empty);
    onFilterChange?.(empty);
  };

  return (
    <aside className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(20,22,71,0.04)] border border-[#E9E8EE] space-y-6">
      <h3 className="text-lg font-semibold text-[#141647] flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">filter_list</span>
        Filtrlər
      </h3>

      {/* Search */}
      <div>
        <label className="text-xs text-brand-muted mb-1.5 block font-semibold">Axtarış</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-soft-blue text-sm">search</span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Məhsul adı..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg focus:ring-1 focus:ring-[#243786] focus:border-[#243786] text-sm text-[#141647] outline-none transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs text-brand-muted mb-1.5 block font-semibold">Kateqoriya</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none"
        >
          <option value="">Bütün kateqoriyalar</option>
        </select>
      </div>

      {/* Region */}
      <div>
        <label className="text-xs text-brand-muted mb-1.5 block font-semibold">Bölgə</label>
        <div className="space-y-2">
          {["Bakı", "Sumqayıt", "Gəncə"].map((city) => (
            <label key={city} className="flex items-center gap-2 cursor-pointer group text-sm">
              <input type="checkbox" className="rounded text-[#243786] focus:ring-[#243786] border-[#D1D1DB]" />
              <span className="text-brand-muted group-hover:text-[#141647] transition-colors">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs text-brand-muted mb-1.5 block font-semibold">Qiymət aralığı (₼)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            placeholder="Min"
            className="w-1/2 px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none"
          />
          <span className="text-brand-soft-blue">-</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            placeholder="Max"
            className="w-1/2 px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none"
          />
        </div>
      </div>

      {/* Min Order */}
      <div>
        <label className="text-xs text-brand-muted mb-1.5 block font-semibold">Minimum sifariş</label>
        <input type="range" className="w-full accent-[#243786]" min="1" max="500" />
        <div className="flex justify-between text-[10px] text-brand-soft-blue font-semibold mt-1">
          <span>1 KG</span>
          <span>500 KG</span>
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="text-xs text-brand-muted mb-1.5 block font-semibold">Stok statusu</label>
        <div className="flex gap-2">
          <button className="flex-1 py-2 text-xs border border-[#243786] text-[#243786] rounded-lg hover:bg-[#243786]/5 transition-colors font-semibold">Stokda</button>
          <button className="flex-1 py-2 text-xs border border-[#D1D1DB] text-brand-muted rounded-lg font-semibold">Hamısı</button>
        </div>
      </div>

      {/* Free Delivery */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.freeDelivery}
          onChange={(e) => handleChange("freeDelivery", e.target.checked)}
          className="rounded text-[#243786] focus:ring-[#243786]"
        />
        <span className="text-sm text-brand-muted">Pulsuz çatdırılma</span>
      </label>

      {/* Actions */}
      <button className="w-full py-3 bg-[#141647] text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
        Filtrləri tətbiq et
      </button>
      <button
        onClick={clearFilters}
        className="w-full py-2 text-brand-muted text-xs hover:text-[#141647] transition-colors"
      >
        Təmizlə
      </button>
    </aside>
  );
}
