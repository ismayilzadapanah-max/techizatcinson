import Link from "next/link";
import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneRevealButton } from "./PhoneRevealButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { SupplierProfile } from "@/lib/types";

interface SupplierCardProps {
  supplier: SupplierProfile;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E9E8EE] overflow-hidden workspace-shadow group">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-[#243786]/20 to-[#D47092]/20" />
      {/* Logo & Info */}
      <div className="px-4 pb-4 -mt-10">
        <div className="w-16 h-16 rounded-xl bg-white p-1 border-2 border-white shadow-lg mb-3 overflow-hidden">
          {supplier.logoUrl ? (
            <img src={supplier.logoUrl} alt={supplier.companyName} className="w-full h-full object-contain rounded-lg" />
          ) : (
            <div className="w-full h-full rounded-lg bg-[#F3F2F7] flex items-center justify-center text-brand-muted">
              <span className="material-symbols-outlined text-2xl">business</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-[#141647]">{supplier.companyName}</h3>
          {supplier.approvalStatus === "approved" && (
            <span className="material-symbols-outlined text-[#243786] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-xs text-brand-muted mb-3">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">category</span>
            <span>{supplier.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span>{supplier.city}, {supplier.region}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">star</span>
            <span className="font-semibold text-[#141647]">{supplier.rating}</span>
            <span>({supplier.reviewCount} rəy)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">inventory_2</span>
            <span>{supplier.productCount} məhsul</span>
          </div>
        </div>

        {supplier.approvalStatus === "approved" && (
          <StatusBadge status="approved" type="approval" />
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E9E8EE]">
          <Link
            href={`/suppliers/${supplier.id}`}
            className="flex-1 text-center text-xs font-semibold text-[#243786] hover:bg-[#F3F2F7] py-2 rounded-lg transition-colors"
          >
            Profilə bax
          </Link>
          <WhatsAppButton phone={supplier.whatsapp} link={supplier.whatsappLink} size="sm" />
          <PhoneRevealButton phone={supplier.phone} size="sm" />
        </div>
      </div>
    </div>
  );
}
