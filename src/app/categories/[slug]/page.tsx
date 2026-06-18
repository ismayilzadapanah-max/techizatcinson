import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, EMPTY_STATES } from "@/lib/constants";
import { EmptyState } from "@/components/ui/EmptyState";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products: never[] = []; // Məhsullar gələcəkdə DB-dən gələcək

  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      {/* Page Header */}
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors mb-3"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Bütün kateqoriyalar
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#243786]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#243786] text-3xl">
                {category.icon}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {category.name}
              </h1>
              <p className="text-sm text-on-surface-variant">
                Bu kateqoriyada olan bütün məhsulları kəşf edin
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
        {/* Məhsullar */}
        {products.length === 0 ? (
          <EmptyState
            icon="inventory_2"
            title="Bu kateqoriyada hələ məhsul yoxdur"
            description={`"${category.name}" kateqoriyası üzrə məhsul elanı hələ yerləşdirilməyib. İlk elanı siz verin.`}
            cta="Elan yerləşdir"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Product cards would render here */}
          </div>
        )}
      </div>
    </div>
  );
}
