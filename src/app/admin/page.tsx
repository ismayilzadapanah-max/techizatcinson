import { StatsCard } from "@/components/ui/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";

const stats = [
  { label: "Təchizatçılar", value: 0, icon: "local_shipping" },
  { label: "Restoranlar", value: 0, icon: "restaurant" },
  { label: "Məhsul elanları", value: 0, icon: "inventory_2" },
  { label: "Gözləyən təsdiqlər", value: 0, icon: "how_to_reg", variant: "accent" as const },
  { label: "Qiymət sorğuları", value: 0, icon: "request_quote" },
  { label: "Şikayətlər", value: 0, icon: "report", variant: "accent" as const },
  { label: "Rəylər", value: 0, icon: "star" },
  { label: "Aktiv paketlər", value: 0, icon: "package_2" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Əsas Dashboard</h2>
        <p className="text-sm text-brand-muted">Sistemin cari vəziyyətinə nəzarət edin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} variant={s.variant} />
        ))}
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Registrations */}
        <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm border border-[#E9E8EE] min-h-[300px] flex items-center justify-center">
          <EmptyState icon="person_add" title="Son Qeydiyyatlar" description="Hələ ki, sistemdə yeni qeydiyyatdan keçmiş istifadəçi yoxdur." />
        </div>

        {/* Pending Supplier Approvals */}
        <div className="lg:col-span-4 bg-white rounded-xl p-8 shadow-sm border border-[#E9E8EE] min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#141647]">Təchizatçı Təsdiqləri</h3>
            <span className="material-symbols-outlined text-[#243786]">verified_user</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon="hourglass_empty" title="Hələ fəaliyyət yoxdur" description="" />
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="lg:col-span-12 bg-white rounded-xl p-8 shadow-sm border border-[#E9E8EE] min-h-[250px] flex items-center justify-center">
          <EmptyState icon="notification_important" title="Son Şikayətlər" description="Sistemdə hər hansı aktiv şikayət və ya problem qeydə alınmayıb." />
        </div>
      </div>
    </div>
  );
}
