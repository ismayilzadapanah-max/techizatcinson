import { EmptyState } from "@/components/ui/EmptyState";

export default function RestaurantRFQPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#141647] mb-1">Sorğularım</h2>
          <p className="text-sm text-brand-muted">Təchizatçılara göndərdiyiniz qiymət sorğuları.</p>
        </div>
        <a href="/products" className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Yeni sorğu göndər
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E9E8EE] flex flex-wrap gap-3 items-center">
        <select className="bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg px-4 py-2.5 text-sm text-[#141647] outline-none">
          <option value="">Bütün statuslar</option>
          <option>Gözləyir</option>
          <option>Cavablandırılıb</option>
          <option>Qəbul edilib</option>
          <option>Bağlanıb</option>
        </select>
        <span className="text-sm text-brand-muted ml-auto">0 sorğu</span>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#E9E8EE]">
              {["Məhsul", "Təchizatçı", "Miqdar", "Çatdırılma", "Status", "Tarix", "Əməliyyat"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState icon="request_quote" title="Hələ sorğu göndərilməyib" description="Məhsul detal səhifəsindən təchizatçılara qiymət sorğusu göndərə bilərsiniz." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
