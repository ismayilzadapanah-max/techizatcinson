import { StatsCard } from "@/components/ui/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";

const stats = [
  { label: "Məhsullarım", value: 0, icon: "inventory_2" },
  { label: "Aktiv elanlar", value: 0, icon: "campaign" },
  { label: "Gözləyən təsdiqlər", value: 0, icon: "pending_actions" },
  { label: "Gələn sorğular", value: 0, icon: "request_quote" },
  { label: "Baxış sayı", value: 0, icon: "visibility" },
  { label: "Favorit", value: 0, icon: "favorite" },
];

export default function SupplierDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Xoş gəlmisiniz</h2>
        <p className="text-sm text-brand-muted">Təchizatçı paneliniz üzrə ümumi statistika.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
        <EmptyState icon="history_toggle_off" title="Hələ fəaliyyət yoxdur" description="Hesabınızda hər hansı əməliyyat yarandıqda burada əks olunacaq." cta="İlk məhsulu əlavə edin" />
      </div>
    </div>
  );
}
