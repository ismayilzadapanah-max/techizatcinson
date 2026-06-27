"use client";

import { ORDER_STATUSES } from "@/lib/constants";

export interface OrderFilters {
  status: string;
  supplierName: string;
  productName: string;
  from: string;
  to: string;
  minRating: string;
}

interface Props {
  filters: OrderFilters;
  onChange: (filters: OrderFilters) => void;
  onReset: () => void;
}

export function OrderHistoryFilters({ filters, onChange, onReset }: Props) {
  function update(key: keyof OrderFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  const hasActive =
    filters.status || filters.supplierName || filters.productName || filters.from || filters.to || filters.minRating;

  return (
    <div className="bg-white rounded-xl border border-[#E9E8EE] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#141647] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">filter_list</span>
          Filterlər
        </h3>
        {hasActive && (
          <button
            onClick={onReset}
            className="text-xs text-[#D47092] hover:underline font-medium"
          >
            Sıfırla
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Status</label>
          <select
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          >
            <option value="">Hamısı</option>
            {Object.entries(ORDER_STATUSES).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Təchizatçı adı</label>
          <input
            type="text"
            value={filters.supplierName}
            onChange={(e) => update("supplierName", e.target.value)}
            placeholder="Axtar..."
            className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>

        {/* Product */}
        <div>
          <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Məhsul adı</label>
          <input
            type="text"
            value={filters.productName}
            onChange={(e) => update("productName", e.target.value)}
            placeholder="Axtar..."
            className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>

        {/* From date */}
        <div>
          <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Başlanğıc tarixi</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => update("from", e.target.value)}
            className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>

        {/* To date */}
        <div>
          <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Son tarix</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => update("to", e.target.value)}
            className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>

        {/* Min rating */}
        <div>
          <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Minimum reytinq</label>
          <select
            value={filters.minRating}
            onChange={(e) => update("minRating", e.target.value)}
            className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          >
            <option value="">Hamısı</option>
            <option value="1">⭐ 1+</option>
            <option value="2">⭐⭐ 2+</option>
            <option value="3">⭐⭐⭐ 3+</option>
            <option value="4">⭐⭐⭐⭐ 4+</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>
        </div>
      </div>
    </div>
  );
}
