import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminRestaurantsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Restoranlar</h2><p className="text-sm text-brand-muted">Bütün restoran profillərini idarə edin.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left"><thead><tr className="bg-[#E9E8EE]">{["Restoran adı","Şəhər","Əlaqə şəxsi","Telefon","WhatsApp","Status","Əməliyyatlar"].map(h=><th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={7}><EmptyState icon="restaurant" title="Hələ restoran yoxdur" description="Restoranlar qeydiyyatdan keçdikcə burada görünəcək." /></td></tr></tbody></table>
      </div>
    </div>
  );
}
