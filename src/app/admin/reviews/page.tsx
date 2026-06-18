import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Rəylər</h2><p className="text-sm text-brand-muted">İstifadəçi rəylərini nəzarətdə saxlayın.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
        <EmptyState icon="star" title="Hələ rəy yoxdur" description="İstifadəçilər rəy yazdıqca burada görünəcək." />
      </div>
    </div>
  );
}
