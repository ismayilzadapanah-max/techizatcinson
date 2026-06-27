import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "@/lib/types";

interface Column {
  key: string;
  label: string;
}

interface Props {
  orders: Order[];
  detailBase: string;
  columns?: Column[];
}

const DEFAULT_COLS: Column[] = [
  { key: "orderNumber", label: "Sifariş №" },
  { key: "party", label: "Tərəf" },
  { key: "amount", label: "Məbləğ" },
  { key: "status", label: "Status" },
  { key: "date", label: "Tarix" },
  { key: "actions", label: "" },
];

export function OrderTable({ orders, detailBase, columns = DEFAULT_COLS }: Props) {
  if (orders.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E9E8EE] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E9E8EE] bg-[#F4F5F9]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-[#5D608B] uppercase tracking-wide whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E9E8EE]">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-[#F4F5F9]/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {col.key === "orderNumber" && (
                    <span className="font-semibold text-[#141647]">{order.orderNumber}</span>
                  )}
                  {col.key === "party" && (
                    <span className="text-[#5D608B]">
                      {order.supplierName || order.restaurantName || "—"}
                    </span>
                  )}
                  {col.key === "restaurant" && (
                    <span className="text-[#5D608B]">{order.restaurantName || "—"}</span>
                  )}
                  {col.key === "supplier" && (
                    <span className="text-[#5D608B]">{order.supplierName || "—"}</span>
                  )}
                  {col.key === "amount" && (
                    <span className="font-medium text-[#141647]">{order.totalAmount.toFixed(2)} ₼</span>
                  )}
                  {col.key === "status" && <OrderStatusBadge status={order.status} size="sm" />}
                  {col.key === "items" && (
                    <span className="text-[#5D608B]">{order.items?.length ?? 0} məhsul</span>
                  )}
                  {col.key === "date" && (
                    <span className="text-[#5D608B]">
                      {new Date(order.createdAt).toLocaleDateString("az-AZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {col.key === "actions" && (
                    <Link
                      href={`${detailBase}/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#243786] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      Ətraflı
                    </Link>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
