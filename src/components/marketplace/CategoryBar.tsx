import type { Category } from "@/lib/types";

interface CategoryBarProps {
  categories: Category[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  if (categories.length === 0) {
    return (
      <div className="w-full bg-surface-container-low py-3 border-y border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[#D47092]" style={{ fontVariationSettings: "'FILL' 1" }}>
            info
          </span>
          <span className="text-sm text-on-surface-variant italic">Hələ kateqoriya əlavə edilməyib</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-container-low py-3 border-y border-white/5">
      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all text-sm whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">{cat.icon || "category"}</span>
              <span>{cat.name}</span>
              <span className="text-xs text-outline ml-1">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
