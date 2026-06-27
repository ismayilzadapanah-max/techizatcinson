"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { getRestaurantOrders } from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";
import { OrderHistoryFilters, type OrderFilters } from "@/components/orders/OrderHistoryFilters";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderTable } from "@/components/orders/OrderTable";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order } from "@/lib/types";

const EMPTY_FILTERS: OrderFilters = {
  status: "",
  supplierName: "",
  productName: "",
  from: "",
  to: "",
  minRating: "",
};

const TABLE_COLS = [
  { key: "orderNumber", label: "Sifariş №" },
  { key: "supplier", label: "Təchizatçı" },
  { key: "amount", label: "Məbləğ" },
  { key: "status", label: "Status" },
  { key: "date", label: "Tarix" },
  { key: "actions", label: "" },
];

export default function RestaurantOrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS);

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

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filters.status && o.status !== filters.status) return false;
      if (filters.supplierName && !(o.supplierName?.toLowerCase().includes(filters.supplierName.toLowerCase()))) return false;
      if (filters.from && new Date(o.createdAt) < new Date(filters.from)) return false;
      if (filters.to && new Date(o.createdAt) > new Date(filters.to + "T23:59:59")) return false;
      if (filters.minRating && (o.qualityRating ?? 0) < Number(filters.minRating)) return false;
      return true;
    });
  }, [orders, filters]);

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
      <div>
        <h2 className="text-2xl font-bold text-[#141647]">Sifariş Tarixçəsi</h2>
        <p className="text-sm text-[#5D608B] mt-0.5">
          Hansı tarixdə, hansı təchizatçıdan, hansı məhsuldan nə qədər sifariş etdiyinizi izləyin.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Cəmi sifariş", value: orders.length, icon: "receipt_long" },
          { label: "Tamamlanan", value: orders.filter((o) => o.status === "completed").length, icon: "task_alt" },
          { label: "Ləğv edilən", value: orders.filter((o) => o.status === "cancelled" || o.status === "rejected").length, icon: "cancel" },
          {
            label: "Ort. keyfiyyət",
            value: (() => {
              const rated = orders.filter((o) => o.qualityRating);
              if (!rated.length) return "—";
              const avg = rated.reduce((s, o) => s + (o.qualityRating ?? 0), 0) / rated.length;
              return `${avg.toFixed(1)} ★`;
            })(),
            icon: "star",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E9E8EE] p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">{s.icon}</span>
            </div>
            <p className="text-xl font-bold text-[#141647]">{s.value}</p>
            <p className="text-xs text-[#5D608B] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <OrderHistoryFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {/* Results count */}
      {orders.length > 0 && (
        <p className="text-xs text-[#5D608B]">
          {filtered.length} nəticə göstərilir{" "}
          {filtered.length !== orders.length && `(${orders.length}-dən)`}
        </p>
      )}

      {/* Content */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
          <EmptyState
            icon="history"
            title="Sifariş tarixçəsi boşdur"
            description="Məhsul sifariş etdikdən sonra tarixçəniz burada görünəcək."
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
          <EmptyState
            icon="search_off"
            title="Filter nəticəsi tapılmadı"
            description="Seçdiyiniz filtrlərə uyğun sifariş yoxdur. Filtrləri dəyişib yenidən yoxlayın."
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
