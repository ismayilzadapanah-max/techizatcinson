import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminSuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Təchizatçılar</h2>
          <p className="text-sm text-brand-muted">Bütün təchizatçı profillərini idarə edin.</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3">
        <input type="text" placeholder="Şirkət adı..." className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none w-48" />
        <select className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"><option value="">Təsdiq statusu</option></select>
        <select className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"><option value="">Aktivlik</option></select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="bg-[#E9E8EE]">{["Təchizatçı","VÖEN","Telefon","WhatsApp","Məhsul","Təsdiq","Status","Əməliyyatlar"].map(h=><th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={8}><EmptyState icon="local_shipping" title="Hələ təchizatçı yoxdur" description="Sistemə təchizatçı qeydiyyatdan keçdikcə burada görünəcək." /></td></tr></tbody>
        </table>
      </div>
    </div>
  );
}
