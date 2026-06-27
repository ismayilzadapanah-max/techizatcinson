"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getOrderDetail, updateOrderStatus } from "@/lib/orders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order, OrderStatus } from "@/lib/types";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    const data = await getOrderDetail(id);
    setOrder(data);
    if (data) setSelectedStatus(data.status);
    setLoading(false);
  }

  async function handleStatusUpdate() {
    if (!selectedStatus || !user || !order || selectedStatus === order.status) return;
    setStatusUpdating(true);
    setStatusError("");
    const result = await updateOrderStatus(order.id, selectedStatus, user.id, adminNote || undefined);
    setStatusUpdating(false);
    if (result.error) {
      setStatusError(result.error);
      return;
    }
    setAdminNote("");
    load();
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
          <p className="text-xs text-[#5D608B] mt-0.5">Admin görünüşü</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Admin status control */}
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
            <h3 className="font-semibold text-[#141647] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">admin_panel_settings</span>
              Status idarəetməsi (Admin)
            </h3>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Yeni status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
                >
                  {Object.entries(ORDER_STATUSES).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">Admin qeydi</label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="İxtiyari qeyd..."
                  className="w-full px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
                />
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={statusUpdating || selectedStatus === order.status}
                className="px-5 py-2 bg-[#141647] text-white rounded-lg text-sm font-semibold hover:bg-[#243786] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">save</span>
                )}
                Yadda saxla
              </button>
            </div>
            {statusError && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{statusError}</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
            <h3 className="font-semibold text-[#141647] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">info</span>
              Sifariş məlumatları
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Sifariş №</p>
                <p className="font-semibold text-[#141647]">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Status</p>
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
              <div>
                <p className="text-xs text-[#9DB1CA] mb-0.5">Restoran</p>
                <p className="font-semibold text-[#141647]">{order.restaurantName || "—"}</p>
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
                <p className="text-xs text-[#9DB1CA] mb-0.5">Ümumi məbləğ</p>
                <p className="font-bold text-[#141647] text-lg">{order.totalAmount.toFixed(2)} ₼</p>
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
              Məhsullar
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
                    <span className="font-bold text-[#141647] text-sm">{(item.totalPrice ?? 0).toFixed(2)} ₼</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold text-[#5D608B]">Ümumi</span>
                  <span className="text-xl font-bold text-[#141647]">{order.totalAmount.toFixed(2)} ₼</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#5D608B] italic">Məhsul məlumatı yoxdur.</p>
            )}
          </div>

          {/* Rating if exists */}
          {order.qualityRating && (
            <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-3">
              <h3 className="font-semibold text-[#141647] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">reviews</span>
                Müştəri qiymətləndirməsi
              </h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`material-symbols-outlined text-[22px] ${i < (order.qualityRating ?? 0) ? "text-amber-400" : "text-gray-200"}`}>star</span>
                ))}
                <span className="text-sm text-[#5D608B] ml-1">{order.qualityRating}/5</span>
              </div>
              {order.satisfactionScore && (
                <p className="text-sm text-[#5D608B]">Məmnuniyyət: <strong>{order.satisfactionScore}/10</strong></p>
              )}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-4">
            <h3 className="font-semibold text-[#141647] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">timeline</span>
              Tam status tarixçəsi
            </h3>
            <OrderTimeline history={order.statusHistory || []} />
          </div>

          <div className="bg-white rounded-xl border border-[#E9E8EE] p-5 space-y-3">
            <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-[#243786] hover:underline">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Bütün sifarişlər
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
