import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { EmptyState } from "@/components/ui/EmptyState";
import { EMPTY_STATES } from "@/lib/constants";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      {/* Page Header */}
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Kateqoriyalar
          </h1>
          <p className="text-sm text-on-surface-variant">
            Bütün məhsul kateqoriyalarını kəşf edin və ehtiyacınıza uyğun
            təchizatçıları tapın.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
        {CATEGORIES.length === 0 ? (
          <EmptyState
            icon={EMPTY_STATES.noCategories.icon}
            title={EMPTY_STATES.noCategories.title}
            description={EMPTY_STATES.noCategories.description}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-6 hover:shadow-md hover:border-[#243786]/20 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#243786]/10 flex items-center justify-center mb-4 group-hover:bg-[#243786]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#243786] text-2xl">
                    {cat.icon}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#141647] group-hover:text-[#243786] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
