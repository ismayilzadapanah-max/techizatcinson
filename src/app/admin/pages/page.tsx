import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
const pages = ["Ana səhifə","Restoranlar üçün","Təchizatçılar üçün","Əlaqə","Haqqımızda","Şərtlər","Məxfilik"];
export default function AdminPagesPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Sayt səhifələri</h2><p className="text-sm text-brand-muted">Public kontent səhifələrini idarə edin.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE]">
        {pages.map((p,i)=>(<div key={i} className="flex items-center justify-between px-6 py-4 border-b border-[#E9E8EE] last:border-none"><span className="text-sm text-[#141647] font-medium">{p}</span><button className="text-sm text-[#243786] hover:underline">Redaktə et</button></div>))}
      </div>
    </div>
  );
}
