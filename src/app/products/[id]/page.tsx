"use client";

export const dynamic = "force-dynamic";

import { WhatsAppButton } from "@/components/marketplace/WhatsAppButton";
import { PhoneRevealButton } from "@/components/marketplace/PhoneRevealButton";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProductListing } from "@/lib/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("product_listings")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          setProduct(data as unknown as ProductListing);
        }
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const tabs = [
    { id: "about", label: "Məhsul haqqında" },
    { id: "specs", label: "Texniki məlumatlar" },
    { id: "delivery", label: "Çatdırılma şərtləri" },
    { id: "supplier", label: "Təchizatçı haqqında" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F9] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-brand-soft-blue animate-spin">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Breadcrumb items={[{ label: "Məhsullar", href: "/products" }, { label: "Məhsul detalı" }]} />
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="aspect-square bg-white rounded-2xl border border-[#E9E8EE] flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-brand-soft-blue mb-4">inventory_2</span>
              <p className="text-brand-muted text-sm">Məhsul şəkli əlavə edilməyib</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-brand-muted uppercase tracking-wider bg-[#F3F2F7] px-3 py-1 rounded-full">
                  Kateqoriya
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-[#141647] mt-2">Məhsul adı</h1>
              </div>
              <FavoriteButton targetId="sample" targetType="product" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#141647]">0.00 ₼</span>
              <span className="text-brand-muted">/ vahid</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                <p className="text-xs text-brand-muted mb-1">Minimum sifariş</p>
                <p className="font-semibold text-[#141647]">-</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                <p className="text-xs text-brand-muted mb-1">Stok statusu</p>
                <p className="font-semibold text-[#141647]">-</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                <p className="text-xs text-brand-muted mb-1">Ölçü vahidi</p>
                <p className="font-semibold text-[#141647]">-</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                <p className="text-xs text-brand-muted mb-1">Çatdırılma</p>
                <p className="font-semibold text-[#141647]">-</p>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E9E8EE]">
              <WhatsAppButton label="WhatsApp ilə əlaqə" size="lg" />
              <PhoneRevealButton phone="" size="lg" />
              <button className="bg-[#141647] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#243786] transition-colors">
                Qiymət sorğusu göndər
              </button>
            </div>

            <Link href="/suppliers/1" className="inline-flex items-center gap-2 text-sm text-[#243786] hover:underline font-medium">
              <span className="material-symbols-outlined text-[18px]">business</span>
              Təchizatçı profilinə bax
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E9E8EE] overflow-hidden">
          <div className="px-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
          <div className="p-6 min-h-[300px] flex items-center justify-center text-brand-muted">
            <EmptyState icon="info" title="Bu bölmədə məlumat yoxdur" description="Məlumat əlavə edildikdə burada görünəcək." />
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[#141647] mb-6">Oxşar məhsullar</h3>
          <EmptyState icon="inventory_2" title="Hələ oxşar məhsul yoxdur" description="Bu məhsula bənzər elanlar burada görünəcək." />
        </div>
      </div>

      {/* Mobile Sticky Contact Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9E8EE] p-3 flex items-center gap-2 z-50">
        <WhatsAppButton size="sm" />
        <PhoneRevealButton phone="" size="sm" />
        <button className="flex-1 bg-[#141647] text-white py-2.5 rounded-lg font-semibold text-xs">Sorğu göndər</button>
      </div>
    </div>
  );
}
