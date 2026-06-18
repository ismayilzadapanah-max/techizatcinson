import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SupplierProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Məhsullarım</h2><p className="text-sm text-brand-muted">Əlavə etdiyiniz bütün məhsul elanları.</p></div>
        <Link href="/account/supplier/products/create" className="bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span>Yeni məhsul əlavə et
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="bg-[#E9E8EE]">{["Məhsul","Kateqoriya","Qiymət","Min. Sifariş","Stok","Status","Baxış","Əməliyyatlar"].map(h=><th key={h} className="px-4 py-3 text-xs text-brand-muted uppercase font-semibold">{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={8}><EmptyState icon="inventory" title="Hələ məhsul əlavə edilməyib" description="Yeni məhsul əlavə etmək üçün yuxarıdakı düyməyə klikləyin." /></td></tr></tbody>
        </table>
      </div>
    </div>
  );
}
