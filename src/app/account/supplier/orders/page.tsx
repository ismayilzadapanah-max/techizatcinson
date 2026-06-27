"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getSupplierOrders } from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderTable } from "@/components/orders/OrderTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order } from "@/lib/types";

const STATUS_TABS = [
  { key: "pending", label: "Yeni" },
  { key: "accepted", label: "Qəbul edilmiş" },
  { key: "preparing", label: "Hazırlanır" },
  { key: "on_delivery", label: "Çatdırılmadadır" },
  { key: "delivered", label: "Çatdırıldı" },
  { key: "completed", label: "Tamamlanan" },
  { key: "cancelled", label: "Ləğv edilən" },
  { key: "rejected", label: "Rədd edilən" },
];

const TABLE_COLS = [
  { key: "orderNumber", label: "Sifariş №" },
  { key: "restaurant", label: "Restoran" },
  { key: "items", label: "Məhsullar" },
  { key: "amount", label: "Məbləğ" },
  { key: "status", label: "Status" },
  { key: "date", label: "Tarix" },
  { key: "actions", label: "" },
];

export default function SupplierOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!user) return;
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadOrders() {
    setLoading(true);
    if (!user) return;

    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    const { data: sp } = await supabase
      .from("supplier_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!sp) { setLoading(false); return; }

    const data = await getSupplierOrders(sp.id);
    setOrders(data);
    setLoading(false);
  }

  const filtered = orders.filter((o) => o.status === activeTab);

  const tabCount = (key: string) => orders.filter((o) => o.status === key).length;

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
          <h2 className="text-2xl font-bold text-[#141647]">Gələn Sifarişlər</h2>
          <p className="text-sm text-[#5D608B] mt-0.5">Restoranlardan gələn sifarişlər burada sıralanıb.</p>
        </div>
        <span className="bg-[#F3F2F7] text-[#5D608B] text-xs font-semibold px-3 py-1.5 rounded-full">
          {orders.length} sifariş
        </span>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = tabCount(tab.key);
          const isNew = tab.key === "pending" && count > 0;
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
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isNew && activeTab !== tab.key
                      ? "bg-[#D47092] text-white"
                      : activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-[#F3F2F7] text-[#9DB1CA]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
          <EmptyState
            icon="inbox"
            title={`Bu statusda sifariş yoxdur`}
            description={`${STATUS_TABS.find((t) => t.key === activeTab)?.label} statusunda heç bir sifariş yoxdur.`}
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <OrderTable
              orders={filtered}
              detailBase="/account/supplier/orders"
              columns={TABLE_COLS}
            />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                detailBase="/account/supplier/orders"
                nameField="restaurantName"
                nameLabel="Restoran"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
