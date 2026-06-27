"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getOrderDetail, getOrderReview } from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { OrderReviewForm } from "@/components/orders/OrderReviewForm";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order, OrderReview } from "@/lib/types";

export default function RestaurantOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [review, setReview] = useState<OrderReview | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  async function load() {
    setLoading(true);
    if (!user) return;

    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    const { data: rp } = await supabase
      .from("restaurant_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (rp) setRestaurantId(rp.id);

    const [orderData, reviewData] = await Promise.all([
      getOrderDetail(id),
      getOrderReview(id),
    ]);

    setOrder(orderData);
    setReview(reviewData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="material-symbols-outlined text-4xl text-[#243786] animate-spin">sync</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
        <EmptyState icon="receipt_long" title="Sifariş tapılmadı" description="Bu sifariş mövcud deyil." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[#5D608B] hover:bg-white border border-transparent hover:border-[#E9E8EE] transition-all"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#141647]">{order.orderNumber}</h2>
          <p className="text-xs text-[#5D608B] mt-0.5">Sifariş detalları</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order summary */}
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
            <h3 className="font-semibold text-[#141647] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">info</span>
              Sifariş məlumatları
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Sifariş nömrəsi</p>
                <p className="font-semibold text-[#141647]">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Təchizatçı</p>
                <p className="font-semibold text-[#141647]">{order.supplierName || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Sifariş tarixi</p>
                <p className="font-semibold text-[#141647]">
                  {new Date(order.createdAt).toLocaleDateString("az-AZ", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Çatdırılma tarixi</p>
                <p className="font-semibold text-[#141647]">
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString("az-AZ", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              {order.deliveryAddress && (
                <div className="col-span-2">
                  <p className="text-xs text-[#9DB1CA] mb-0.5">Çatdırılma ünvanı</p>
                  <p className="font-semibold text-[#141647]">{order.deliveryAddress}</p>
                </div>
              )}
              {order.note && (
                <div className="col-span-2">
                  <p className="text-xs text-[#9DB1CA] mb-0.5">Qeyd</p>
                  <p className="text-[#5D608B] italic">"{order.note}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
            <h3 className="font-semibold text-[#141647] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">inventory_2</span>
              Sifariş edilən məhsullar
            </h3>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3 border-b border-[#F4F5F9] last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-[#141647] text-sm">{item.productName}</p>
                      <p className="text-xs text-[#5D608B] mt-0.5">
                        {item.quantity} {item.unit || "ədəd"}
                        {item.unitPrice != null && item.unitPrice > 0 && (
                          <span> · {item.unitPrice.toFixed(2)} ₼/{item.unit || "vahid"}</span>
                        )}
                      </p>
                    </div>
                    <span className="font-bold text-[#141647] text-sm whitespace-nowrap">
                      {(item.totalPrice ?? 0).toFixed(2)} ₼
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold text-[#5D608B]">Ümumi məbləğ</span>
                  <span className="text-xl font-bold text-[#141647]">{order.totalAmount.toFixed(2)} ₼</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#5D608B] italic">Məhsul məlumatı yoxdur.</p>
            )}
          </div>

          {/* Review (only if completed) */}
          {order.status === "completed" && restaurantId && (
            <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
              <h3 className="font-semibold text-[#141647] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">star</span>
                {review ? "Qiymətləndirməniz" : "Sifarişi qiymətləndir"}
              </h3>
              <OrderReviewForm
                orderId={order.id}
                restaurantId={restaurantId}
                supplierId={order.supplierId}
                existingReview={review}
                onReviewed={load}
              />
            </div>
          )}
        </div>

        {/* Status timeline */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
            <h3 className="font-semibold text-[#141647] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">timeline</span>
              Status tarixçəsi
            </h3>
            <OrderTimeline history={order.statusHistory || []} />
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-3">
            <h3 className="font-semibold text-[#141647] text-sm">Əlaqəli linklər</h3>
            <Link
              href="/account/restaurant/orders"
              className="flex items-center gap-2 text-sm text-[#243786] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Bütün sifarişlər
            </Link>
            <Link
              href="/account/restaurant/order-history"
              className="flex items-center gap-2 text-sm text-[#243786] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              Sifariş tarixçəsi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
