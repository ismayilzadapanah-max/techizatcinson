import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">İstifadəçilər</h2>
          <p className="text-sm text-brand-muted">Bütün platform istifadəçilərini idarə edin.</p>
        </div>
        <button className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Yeni istifadəçi
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3">
        <input type="text" placeholder="Axtarış..." className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none w-48" />
        <select className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"><option value="">Bütün rollar</option><option>Təchizatçı</option><option>Restoran</option></select>
        <select className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2 text-sm outline-none"><option value="">Bütün statuslar</option></select>
      </div>

      {/* Table / Empty */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#E9E8EE]">
              {["Ad / Şirkət", "Rol", "E-mail", "Telefon", "Status", "Tarix", "Əməliyyatlar"].map((h) => (
                <th key={h} className="px-6 py-3 text-xs text-brand-muted uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState icon="person_add" title="Hələ istifadəçi yoxdur" description="Platformaya yeni istifadəçilər qeydiyyatdan keçdikcə burada görünəcək." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
