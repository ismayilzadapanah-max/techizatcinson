import Link from "next/link";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { CategoryBar } from "@/components/marketplace/CategoryBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { HERO_CONTENT, EMPTY_STATES } from "@/lib/constants";

const categories: never[] = [];
const products: never[] = [];
const suppliers: never[] = [];

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {HERO_CONTENT.title}
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">
            {HERO_CONTENT.subtitle}
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Category Bar */}
      <CategoryBar categories={categories} />

      {/* Statistics */}
      <section className="py-12 max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["0", "Təchizatçılar", "local_shipping"],
            ["0", "Məhsul elanları", "inventory_2"],
            ["0", "Restoranlar", "restaurant"],
            ["0", "Kateqoriyalar", "category"],
          ].map(([value, label, icon]) => (
            <div key={label} className="bg-surface-container-highest p-6 rounded-xl border border-white/5 text-center group hover:border-[#D47092]/30 transition-all">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{value}</div>
              <div className="text-xs text-on-surface-variant uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 space-y-12">
        {/* Recent Products */}
        <div>
          <div className="flex items-center justify-between mb-6 border-l-4 border-[#D47092] pl-4">
            <h2 className="text-2xl font-bold text-white">Son məhsul elanları</h2>
            <Link href="/products" className="text-primary hover:text-[#D47092] transition-colors text-sm font-semibold">Hamısına bax</Link>
          </div>
          <EmptyState icon={EMPTY_STATES.noProducts.icon} title={EMPTY_STATES.noProducts.title} description={EMPTY_STATES.noProducts.description} />
        </div>

        {/* Suppliers */}
        <div>
          <div className="flex items-center justify-between mb-6 border-l-4 border-[#D47092] pl-4">
            <h2 className="text-2xl font-bold text-white">Təchizatçılar</h2>
            <Link href="/suppliers" className="text-primary hover:text-[#D47092] transition-colors text-sm font-semibold">Bütün siyahı</Link>
          </div>
          <EmptyState icon={EMPTY_STATES.noSuppliers.icon} title={EMPTY_STATES.noSuppliers.title} description={EMPTY_STATES.noSuppliers.description} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#243786] to-surface-container-lowest p-8 md:p-12 border border-white/10">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-[#D47092]/20 blur-[100px] rounded-full" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Təchizat zəncirinizi bu gün rəqəmsallaşdırın</h2>
            <p className="text-lg text-on-surface-variant mb-8">İstər böyük restoran şəbəkəsi, istərsə də butik kafe — Techizatcin.com ən uyğun tərəfdaşları bir araya gətirir.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register/restaurant" className="bg-[#D47092] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#D47092]/20 hover:scale-105 transition-transform text-sm">Restoran kimi qoşul</Link>
              <Link href="/register/supplier" className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all text-sm">Təchizatçı ol</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
