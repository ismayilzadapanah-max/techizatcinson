"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WhatsAppButton } from "@/components/marketplace/WhatsAppButton";
import { PhoneRevealButton } from "@/components/marketplace/PhoneRevealButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CATEGORIES } from "@/lib/constants";
import type { SupplierProfile } from "@/lib/types";

export default function SupplierProfilePage() {
  const { id } = useParams<{ id: string }>();
  const supabase = useMemo(() => createClient(), []);
  const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("supplier_profiles")
        .select("*")
        .eq("id", id)
        .single();
      setSupplier(data as any);
      setLoading(false);
    };
    load();
  }, [id]);

  // snake_case -> camelCase map
  const sup = supplier ? {
    id: (supplier as any).id,
    companyName: (supplier as any).company_name,
    category: (supplier as any).activity_area,
    city: (supplier as any).city,
    about: (supplier as any).about,
    contactPerson: (supplier as any).contact_person,
    phone: (supplier as any).phone,
    whatsapp: (supplier as any).whatsapp_number,
    whatsappLink: (supplier as any).whatsapp_link,
    email: (supplier as any).email,
    address: (supplier as any).address,
    workingHours: (supplier as any).working_hours,
    logoUrl: (supplier as any).logo_url,
    coverUrl: (supplier as any).cover_url,
    mapLink: (supplier as any).map_link,
    rating: (supplier as any).rating || 0,
    reviewCount: (supplier as any).review_count || 0,
    productCount: (supplier as any).product_count || 0,
    approvalStatus: (supplier as any).approval_status,
  } : null;

  const tabs = [
    { id: "products", label: "Məhsullar", icon: "inventory_2", count: sup?.productCount || 0 },
    { id: "about", label: "Haqqında", icon: "info" },
    { id: "delivery", label: "Çatdırılma", icon: "local_shipping" },
    { id: "reviews", label: "Rəylər", icon: "star", count: sup?.reviewCount || 0 },
    { id: "contact", label: "Əlaqə", icon: "call" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-brand-soft-blue animate-spin">sync</span>
      </div>
    );
  }

  if (!sup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState icon="person_off" title="Təchizatçı tapılmadı" description="Bu profil mövcud deyil və ya silinib." />
      </div>
    );
  }

  const catName = sup.category
    ? CATEGORIES.find((c) => c.id === sup.category)?.name || sup.category
    : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Breadcrumb items={[{ label: "Təchizatçılar", href: "/suppliers" }, { label: sup.companyName }]} />
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
        {/* Profile Header */}
        <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant shadow-sm mt-8">
          {sup.coverUrl ? (
            <img src={sup.coverUrl} alt="" className="h-32 w-full object-cover" />
          ) : (
            <div className="h-32 w-full bg-gradient-to-r from-[#243786]/30 to-[#D47092]/20" />
          )}
          <div className="px-6 pb-6 -mt-12 flex flex-col md:flex-row items-end gap-6">
            <div className="w-32 h-32 rounded-xl bg-white p-2 border-4 border-surface-container-low shadow-lg overflow-hidden">
              {sup.logoUrl ? (
                <img src={sup.logoUrl} alt={sup.companyName} className="w-full h-full rounded-lg object-cover" />
              ) : (
                <div className="w-full h-full rounded-lg bg-[#F3F2F7] flex items-center justify-center text-brand-muted">
                  <span className="material-symbols-outlined text-4xl">business</span>
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-on-background">{sup.companyName}</h2>
                {sup.approvalStatus === "approved" && (
                  <span className="material-symbols-outlined text-secondary text-lg" title="Təsdiqlənmiş">verified</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                {catName && (
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">category</span> {catName}</span>
                )}
                {sup.city && (
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {sup.city}</span>
                )}
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-secondary">star</span> {sup.rating || 0} ({sup.reviewCount || 0} rəy)</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">inventory_2</span> {sup.productCount || 0} Məhsul</span>
              </div>
            </div>

            <div className="flex gap-3 pb-2 w-full md:w-auto">
              {sup.whatsappLink && <WhatsAppButton link={sup.whatsappLink} label="WhatsApp" size="md" />}
              {sup.phone && <PhoneRevealButton phone={sup.phone} size="md" />}
              {sup.email && (
                <a href={`mailto:${sup.email}`} className="p-2.5 border border-outline-variant text-on-surface rounded-lg hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined">mail</span>
                </a>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 border-t border-outline-variant mt-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-12">
          {activeTab === "products" && (
            <EmptyState icon="inventory" title="Hələ məhsul yoxdur" description="Bu təchizatçı hələ məhsul əlavə etməyib." />
          )}
          {activeTab === "about" && (
            sup.about ? (
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8">
                <p className="text-on-surface-variant whitespace-pre-wrap">{sup.about}</p>
              </div>
            ) : (
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 flex items-center justify-center">
                <EmptyState icon="info" title="Məlumat yoxdur" description="Şirkət haqqında məlumat əlavə edilməyib." />
              </div>
            )
          )}
          {activeTab === "delivery" && (
            <EmptyState icon="local_shipping" title="Çatdırılma məlumatı yoxdur" description="Çatdırılma bölgələri əlavə edilməyib." />
          )}
          {activeTab === "reviews" && (
            <EmptyState icon="star" title="Hələ rəy yazılmayıb" description="İlk rəyi siz yazın." />
          )}
          {activeTab === "contact" && (
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-on-background">Əlaqə məlumatları</h4>
                  {sup.contactPerson || sup.phone || sup.email || sup.address ? (
                    <div className="space-y-3 text-sm">
                      {sup.contactPerson && (
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-brand-muted">person</span><span className="text-on-surface">{sup.contactPerson}</span></div>
                      )}
                      {sup.phone && (
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-brand-muted">call</span><span className="text-on-surface">{sup.phone}</span></div>
                      )}
                      {sup.whatsapp && (
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-[#25D366]">chat</span><span className="text-on-surface">{sup.whatsapp}</span></div>
                      )}
                      {sup.email && (
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-brand-muted">mail</span><span className="text-on-surface">{sup.email}</span></div>
                      )}
                      {sup.address && (
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-brand-muted">location_on</span><span className="text-on-surface">{sup.address}</span></div>
                      )}
                      {sup.workingHours && (
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-brand-muted">schedule</span><span className="text-on-surface">{sup.workingHours}</span></div>
                      )}
                    </div>
                  ) : (
                    <EmptyState icon="contacts" title="Əlaqə məlumatı əlavə edilməyib" description="Təchizatçı əlaqə məlumatlarını doldurduqda burada görünəcək." />
                  )}
                </div>
                <div className="bg-surface-container-highest rounded-lg flex items-center justify-center min-h-[200px] border-2 border-dashed border-outline-variant/50">
                  {sup.mapLink ? (
                    <iframe src={sup.mapLink} width="100%" height="100%" className="rounded-lg" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  ) : (
                    <div className="text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl">map</span>
                      <p className="text-sm mt-2">Xəritə yeri göstərilməyib</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
