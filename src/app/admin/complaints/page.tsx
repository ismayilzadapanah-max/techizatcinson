import { EmptyState } from "@/components/ui/EmptyState";
export default function AdminComplaintsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Şikayətlər</h2><p className="text-sm text-brand-muted">İstifadəçi şikayətlərini idarə edin.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-12">
        <EmptyState icon="report" title="Hələ şikayət yoxdur" description="Sistemdə hər hansı aktiv şikayət qeydə alınmayıb." />
      </div>
    </div>
  );
}
