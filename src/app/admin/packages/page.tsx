import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminPackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end"><div><h2 className="text-2xl font-bold text-[#141647] mb-1">Paketlər</h2><p className="text-sm text-brand-muted">Təchizatçılar üçün paket planlarını idarə edin.</p></div>
        <button className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">add</span>Yeni paket</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E9E8EE] text-center">
          <div className="w-12 h-12 bg-[#F3F2F7] rounded-lg flex items-center justify-center text-[#243786] mx-auto mb-4"><span className="material-symbols-outlined text-2xl">package_2</span></div>
          <p className="text-lg font-bold text-[#141647] mb-2">Plan adı</p>
          <div className="space-y-2 text-sm text-brand-muted mb-4">
            <p>Elan limiti: -</p><p>Görünürlük: -</p><p>Prioritet sıralama: -</p>
          </div>
          <button className="w-full py-2 border border-[#243786] text-[#243786] rounded-lg text-sm font-semibold hover:bg-[#243786]/5">Seç</button>
        </div>
        <div className="col-span-2 flex items-center justify-center"><EmptyState icon="package_2" title="Hələ paket əlavə edilməyib" description="" /></div>
      </div>
    </div>
  );
}
