import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminRegionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end"><div><h2 className="text-2xl font-bold text-[#141647] mb-1">Bölgələr</h2><p className="text-sm text-brand-muted">Şəhər və rayonları idarə edin.</p></div>
        <button className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">add</span>Şəhər əlavə et</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
        <EmptyState icon="location_on" title="Hələ bölgə əlavə edilməyib" description="Çatdırılma bölgələrini əlavə edin." />
      </div>
    </div>
  );
}
