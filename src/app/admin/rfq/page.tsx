import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminRFQPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Qiymət sorğuları</h2><p className="text-sm text-brand-muted">Restoranların təchizatçılara göndərdiyi qiymət sorğuları.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left"><thead><tr className="bg-[#E9E8EE]">{["ID","Restoran","Təchizatçı","Məhsul","Miqdar","Status","Tarix","Əməliyyatlar"].map(h=><th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={8}><EmptyState icon="request_quote" title="Hələ sorğu yoxdur" description="Qiymət sorğuları göndərildikcə burada görünəcək." /></td></tr></tbody></table>
      </div>
    </div>
  );
}
