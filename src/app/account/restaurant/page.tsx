import { StatsCard } from "@/components/ui/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

const stats = [
  { label: "Favorit məhsullar", value: 0, icon: "inventory_2" },
  { label: "Favorit təchizatçılar", value: 0, icon: "local_shipping" },
  { label: "Göndərilən sorğular", value: 0, icon: "request_quote" },
  { label: "Mesajlar", value: 0, icon: "forum" },
];

export default function RestaurantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Xoş gəlmisiniz</h2>
        <p className="text-sm text-brand-muted">Restoran paneliniz üzrə ümumi statistika.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12 flex items-center justify-center">
          <EmptyState icon="inventory_2" title="Favorit məhsullar" description="Hələ favorit məhsul əlavə edilməyib." />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12 flex items-center justify-center">
          <EmptyState icon="local_shipping" title="Favorit təchizatçılar" description="Hələ favorit təchizatçı əlavə edilməyib." />
        </div>
      </div>
      <div className="flex gap-3">
        <Link href="/products" className="bg-[#141647] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">Məhsulları kəşf et</Link>
        <Link href="/suppliers" className="border border-[#243786] text-[#243786] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#243786]/5 transition-all">Təchizatçıları araşdır</Link>
      </div>
    </div>
  );
}
