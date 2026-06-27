"use client";

export const dynamic = "force-dynamic";

import { WhatsAppButton } from "@/components/marketplace/WhatsAppButton";
import { PhoneRevealButton } from "@/components/marketplace/PhoneRevealButton";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CreateOrderModal } from "@/components/orders/CreateOrderModal";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

interface RawProduct {
  id: string;
  product_name?: string;
  supplier_id?: string;
  supplier_name?: string;
  category_name?: string;
  description?: string;
  short_description?: string;
  price?: number;
  price_unit?: string;
  unit?: string;
  min_order_qty?: number;
  stock_status?: string;
  delivery_time?: string;
  delivery_fee?: number;
  is_price_negotiable?: boolean;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_whatsapp_link?: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<RawProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const supabase = createClient()!;
        const { data } = await supabase
          .from("product_listings")
          .select("*")
          .eq("id", id)
          .single();
        if (data) setProduct(data as unknown as RawProduct);
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  // Fetch restaurant profile ID if user is restaurant
  useEffect(() => {
    if (role !== "restaurant" || !user) return;
    const fetch = async () => {
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase
        .from("restaurant_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (data) setRestaurantId(data.id);
    };
    fetch();
  }, [role, user]);

  const tabs = [
    { id: "about", label: "Məhsul haqqında" },
    { id: "specs", label: "Texniki məlumatlar" },
    { id: "delivery", label: "Çatdırılma şərtləri" },
    { id: "supplier", label: "Təchizatçı haqqında" },
  ];

  function handleOrderClick() {
    if (!user) {
      router.push("/login");
      return;
    }
    setOrderModalOpen(true);
  }

  const canOrder = role === "restaurant";
  const productName = product?.product_name || "Məhsul";
  const supplierId = product?.supplier_id || "";
  const supplierName = product?.supplier_name || "";
  const price = product?.price ?? 0;
  const priceUnit = product?.price_unit || product?.unit || "vahid";
  const stockLabel =
    product?.stock_status === "in_stock"
      ? "Stokda var"
      : product?.stock_status === "out_of_stock"
      ? "Stokda yoxdur"
      : product?.stock_status === "pre_order"
      ? "Ön sifariş"
      : "—";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F9] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-brand-soft-blue animate-spin">sync</span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F4F5F9]">
        <div className="bg-background pt-8 pb-6 border-b border-white/5">
          <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
            <Breadcrumb
              items={[
                { label: "Məhsullar", href: "/products" },
                { label: productName },
              ]}
            />
          </div>
        </div>

        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square bg-white rounded-2xl border border-[#E9E8EE] flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-brand-soft-blue mb-4">inventory_2</span>
                <p className="text-brand-muted text-sm">Məhsul şəkli əlavə edilməyib</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {product?.category_name && (
                    <span className="text-xs text-brand-muted uppercase tracking-wider bg-[#F3F2F7] px-3 py-1 rounded-full">
                      {product.category_name}
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-[#141647] mt-2">{productName}</h1>
                  {supplierName && (
                    <p className="text-sm text-[#5D608B] mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">business</span>
                      {supplierName}
                    </p>
                  )}
                </div>
                <FavoriteButton targetId={id} targetType="product" />
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                {price > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-[#141647]">{price.toFixed(2)} ₼</span>
                    <span className="text-brand-muted">/ {priceUnit}</span>
                    {product?.is_price_negotiable && (
                      <span className="text-xs text-[#D47092] bg-[#D47092]/10 px-2 py-0.5 rounded-full ml-1">
                        Danışıqlı
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-lg text-[#5D608B]">Qiymət razılaşma ilə</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                  <p className="text-xs text-brand-muted mb-1">Minimum sifariş</p>
                  <p className="font-semibold text-[#141647]">
                    {product?.min_order_qty ? `${product.min_order_qty} ${priceUnit}` : "—"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                  <p className="text-xs text-brand-muted mb-1">Stok statusu</p>
                  <p className="font-semibold text-[#141647]">{stockLabel}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                  <p className="text-xs text-brand-muted mb-1">Ölçü vahidi</p>
                  <p className="font-semibold text-[#141647]">{priceUnit}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E9E8EE]">
                  <p className="text-xs text-brand-muted mb-1">Çatdırılma</p>
                  <p className="font-semibold text-[#141647]">{product?.delivery_time || "—"}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E9E8EE]">
                <WhatsAppButton label="WhatsApp ilə əlaqə" size="lg" />
                <PhoneRevealButton phone={product?.contact_phone || ""} size="lg" />
                {canOrder ? (
                  <button
                    onClick={handleOrderClick}
                    disabled={product?.stock_status === "out_of_stock"}
                    className="inline-flex items-center gap-2 bg-[#D47092] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    Sifariş et
                  </button>
                ) : !user ? (
                  <button
                    onClick={() => router.push("/login")}
                    className="inline-flex items-center gap-2 bg-[#D47092] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    Sifariş et
                  </button>
                ) : (
                  <button className="bg-[#141647] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#243786] transition-colors">
                    Qiymət sorğusu göndər
                  </button>
                )}
              </div>

              {supplierId && (
                <Link
                  href={`/suppliers/${supplierId}`}
                  className="inline-flex items-center gap-2 text-sm text-[#243786] hover:underline font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">business</span>
                  Təchizatçı profilinə bax
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 bg-white rounded-2xl border border-[#E9E8EE] overflow-hidden">
            <div className="px-6">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>
            <div className="p-6 min-h-[200px]">
              {activeTab === "about" && (
                <>
                  {product?.description || product?.short_description ? (
                    <p className="text-[#5D608B] text-sm leading-relaxed">
                      {product.description || product.short_description}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <EmptyState
                        icon="info"
                        title="Bu bölmədə məlumat yoxdur"
                        description="Məlumat əlavə edildikdə burada görünəcək."
                      />
                    </div>
                  )}
                </>
              )}
              {activeTab === "delivery" && (
                <div className="space-y-3">
                  {product?.delivery_time && (
                    <div className="flex gap-3 text-sm">
                      <span className="material-symbols-outlined text-[18px] text-[#9DB1CA] flex-shrink-0">schedule</span>
                      <p>
                        <strong className="text-[#141647]">Çatdırılma müddəti:</strong> {product.delivery_time}
                      </p>
                    </div>
                  )}
                  {product?.delivery_fee != null && (
                    <div className="flex gap-3 text-sm">
                      <span className="material-symbols-outlined text-[18px] text-[#9DB1CA] flex-shrink-0">local_shipping</span>
                      <p>
                        <strong className="text-[#141647]">Çatdırılma haqqı:</strong>{" "}
                        {product.delivery_fee > 0 ? `${product.delivery_fee} ₼` : "Pulsuz"}
                      </p>
                    </div>
                  )}
                  {!product?.delivery_time && product?.delivery_fee == null && (
                    <div className="flex items-center justify-center h-40">
                      <EmptyState
                        icon="local_shipping"
                        title="Çatdırılma məlumatı yoxdur"
                        description="Çatdırılma şərtləri əlavə edildikdə burada görünəcək."
                      />
                    </div>
                  )}
                </div>
              )}
              {(activeTab === "specs" || activeTab === "supplier") && (
                <div className="flex items-center justify-center h-40">
                  <EmptyState
                    icon="info"
                    title="Bu bölmədə məlumat yoxdur"
                    description="Məlumat əlavə edildikdə burada görünəcək."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#141647] mb-6">Oxşar məhsullar</h3>
            <EmptyState
              icon="inventory_2"
              title="Hələ oxşar məhsul yoxdur"
              description="Bu məhsula bənzər elanlar burada görünəcək."
            />
          </div>
        </div>

        {/* Mobile Sticky Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9E8EE] p-3 flex items-center gap-2 z-50">
          <WhatsAppButton size="sm" />
          <PhoneRevealButton phone={product?.contact_phone || ""} size="sm" />
          {canOrder ? (
            <button
              onClick={handleOrderClick}
              disabled={product?.stock_status === "out_of_stock"}
              className="flex-1 bg-[#D47092] text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[15px]">shopping_cart</span>
              Sifariş et
            </button>
          ) : (
            <button
              onClick={() => !user && router.push("/login")}
              className="flex-1 bg-[#141647] text-white py-2.5 rounded-lg font-semibold text-xs"
            >
              {!user ? "Sifariş et" : "Sorğu göndər"}
            </button>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {canOrder && user && restaurantId && product && (
        <CreateOrderModal
          open={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          productId={product.id}
          productName={productName}
          supplierId={supplierId}
          supplierName={supplierName}
          unitPrice={price > 0 ? price : undefined}
          unit={priceUnit}
          restaurantId={restaurantId}
          userId={user.id}
        />
      )}
    </>
  );
}
