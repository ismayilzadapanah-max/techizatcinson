import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Məhsul elanları</h2><p className="text-sm text-brand-muted">Bütün məhsul elanlarını idarə edin, təsdiqləyin və nəzarət edin.</p></div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3">
        <input type="text" placeholder="Məhsul adı..." className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none w-48" />
        <select className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"><option>Bütün statuslar</option></select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left"><thead><tr className="bg-[#E9E8EE]">{["Məhsul","Təchizatçı","Kateqoriya","Qiymət","Stok","Status","Tarix","Əməliyyatlar"].map(h=><th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={8}><EmptyState icon="inventory_2" title="Hələ məhsul elanı yoxdur" description="Təchizatçılar məhsul əlavə etdikcə burada görünəcək." /></td></tr></tbody></table>
      </div>
    </div>
  );
}
