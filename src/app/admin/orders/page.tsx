"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { getAdminOrders } from "@/lib/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order } from "@/lib/types";

const TABLE_COLS = [
  { key: "orderNumber", label: "Sifariş №" },
  { key: "restaurant", label: "Restoran" },
  { key: "supplier", label: "Təchizatçı" },
  { key: "amount", label: "Məbləğ" },
  { key: "status", label: "Status" },
  { key: "date", label: "Tarix" },
  { key: "actions", label: "" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAdminOrders();
    setOrders(data);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (restaurantFilter && !(o.restaurantName?.toLowerCase().includes(restaurantFilter.toLowerCase()))) return false;
      if (supplierFilter && !(o.supplierName?.toLowerCase().includes(supplierFilter.toLowerCase()))) return false;
      if (fromFilter && new Date(o.createdAt) < new Date(fromFilter)) return false;
      if (toFilter && new Date(o.createdAt) > new Date(toFilter + "T23:59:59")) return false;
      return true;
    });
  }, [orders, statusFilter, restaurantFilter, supplierFilter, fromFilter, toFilter]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) => ["accepted", "preparing", "on_delivery", "delivered"].includes(o.status)).length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

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
        <h2 className="text-2xl font-bold text-[#141647]">Sifariş İdarəetməsi</h2>
        <p className="text-sm text-[#5D608B] mt-0.5">Platformadakı bütün sifarişlər.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cəmi sifariş", value: stats.total, icon: "receipt_long", color: "text-[#243786]" },
          { label: "Gözləyən", value: stats.pending, icon: "schedule", color: "text-amber-600" },
          { label: "Aktiv", value: stats.active, icon: "local_shipping", color: "text-blue-600" },
          { label: "Tamamlanan", value: stats.completed, icon: "task_alt", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E9E8EE] p-4">
            <span className={`material-symbols-outlined text-[22px] ${s.color}`}>{s.icon}</span>
            <p className="text-2xl font-bold text-[#141647] mt-1">{s.value}</p>
            <p className="text-xs text-[#5D608B]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E9E8EE] p-4 space-y-3">
        <h3 className="text-sm font-semibold text-[#141647] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">filter_list</span>
          Filterlər
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
          >
            <option value="">Bütün statuslar</option>
            {Object.entries(ORDER_STATUSES).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
            placeholder="Restoran adı..."
            className="px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
          />
          <input
            type="text"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            placeholder="Təchizatçı adı..."
            className="px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
          />
          <input
            type="date"
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
            className="px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
          />
          <input
            type="date"
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
            className="px-3 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]"
          />
        </div>
        {(statusFilter || restaurantFilter || supplierFilter || fromFilter || toFilter) && (
          <button
            onClick={() => {
              setStatusFilter("");
              setRestaurantFilter("");
              setSupplierFilter("");
              setFromFilter("");
              setToFilter("");
            }}
            className="text-xs text-[#D47092] hover:underline font-medium"
          >
            Filtrləri sıfırla
          </button>
        )}
      </div>

      {/* Results count */}
      {orders.length > 0 && (
        <p className="text-xs text-[#5D608B]">
          {filtered.length} nəticə{filtered.length !== orders.length && ` (${orders.length}-dən)`}
        </p>
      )}

      {/* Content */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
          <EmptyState icon="receipt_long" title="Hələ sifariş yoxdur" description="Restoranlar məhsul sifariş etdikdə burada görünəcək." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
          <EmptyState icon="search_off" title="Filter nəticəsi tapılmadı" description="Seçilmiş filtrlərə uyğun sifariş yoxdur." />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <OrderTable orders={filtered} detailBase="/admin/orders" columns={TABLE_COLS} />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} detailBase="/admin/orders" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
