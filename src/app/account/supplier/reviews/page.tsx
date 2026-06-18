import { EmptyState } from "@/components/ui/EmptyState";
export default function SupplierReviewsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Rəylər</h2><p className="text-sm text-brand-muted">Restoranların sizin haqqınızda yazdığı rəylər.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
        <EmptyState icon="star" title="Hələ rəy yoxdur" description="Restoranlar məhsullarınızı sifariş etdikcə rəy bildirə bilərlər." />
      </div>
    </div>
  );
}
