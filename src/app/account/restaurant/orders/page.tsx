"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getRestaurantOrders } from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderTable } from "@/components/orders/OrderTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order } from "@/lib/types";

const STATUS_TABS = [
  { key: "", label: "Hamısı" },
  { key: "pending", label: "Gözləyir" },
  { key: "accepted", label: "Qəbul edildi" },
  { key: "preparing", label: "Hazırlanır" },
  { key: "on_delivery", label: "Çatdırılmadadır" },
  { key: "completed", label: "Tamamlandı" },
  { key: "cancelled", label: "Ləğv edildi" },
];

const TABLE_COLS = [
  { key: "orderNumber", label: "Sifariş №" },
  { key: "supplier", label: "Təchizatçı" },
  { key: "items", label: "Məhsullar" },
  { key: "amount", label: "Məbləğ" },
  { key: "status", label: "Status" },
  { key: "date", label: "Tarix" },
  { key: "actions", label: "" },
];

export default function RestaurantOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!user) return;
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadOrders() {
    setLoading(true);
    if (!user) return;

    // Get restaurant profile ID
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    const { data: rp } = await supabase
      .from("restaurant_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!rp) { setLoading(false); return; }

    const data = await getRestaurantOrders(rp.id);
    setOrders(data);
    setLoading(false);
  }

  const filtered = activeTab
    ? orders.filter((o) => o.status === activeTab)
    : orders;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="material-symbols-outlined text-4xl text-[#243786] animate-spin">sync</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647]">Sifarişlərim</h2>
          <p className="text-sm text-[#5D608B] mt-0.5">Bütün sifarişləriniz burada sıralanıb.</p>
        </div>
        <span className="bg-[#F3F2F7] text-[#5D608B] text-xs font-semibold px-3 py-1.5 rounded-full">
          {orders.length} sifariş
        </span>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = tab.key ? orders.filter((o) => o.status === tab.key).length : orders.length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-[#141647] text-white"
                  : "bg-white border border-[#E9E8EE] text-[#5D608B] hover:border-[#243786] hover:text-[#243786]"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-[#F3F2F7] text-[#9DB1CA]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
          <EmptyState
            icon="shopping_bag"
            title={activeTab ? "Bu statusda sifariş yoxdur" : "Hələ sifariş yoxdur"}
            description={
              activeTab
                ? `${ORDER_STATUSES[activeTab]?.label} statusunda heç bir sifarişiniz yoxdur.`
                : "Məhsul səhifəsindən ilk sifarişinizi yerləşdirin."
            }
            cta={!activeTab ? "Məhsullara bax" : undefined}
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <OrderTable
              orders={filtered}
              detailBase="/account/restaurant/orders"
              columns={TABLE_COLS}
            />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                detailBase="/account/restaurant/orders"
                nameField="supplierName"
                nameLabel="Təchizatçı"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
