import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "@/lib/types";

interface Props {
  order: Order;
  detailBase: string; // e.g. "/account/restaurant/orders" or "/account/supplier/orders"
  nameField?: "restaurantName" | "supplierName";
  nameLabel?: string;
}

export function OrderCard({ order, detailBase, nameField = "supplierName", nameLabel = "Təchizatçı" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#E9E8EE] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[#141647] text-sm">{order.orderNumber}</p>
          <p className="text-xs text-[#5D608B] mt-0.5">
            {nameLabel}: {order[nameField] || "—"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[#9DB1CA]">Məhsul sayı</span>
          <p className="font-medium text-[#141647]">{order.items?.length ?? 0}</p>
        </div>
        <div>
          <span className="text-[#9DB1CA]">Məbləğ</span>
          <p className="font-medium text-[#141647]">{order.totalAmount.toFixed(2)} ₼</p>
        </div>
        <div className="col-span-2">
          <span className="text-[#9DB1CA]">Tarix</span>
          <p className="font-medium text-[#141647]">
            {new Date(order.createdAt).toLocaleDateString("az-AZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <Link
        href={`${detailBase}/${order.id}`}
        className="block text-center text-xs font-semibold text-[#243786] border border-[#243786]/30 rounded-lg py-2 hover:bg-[#243786]/5 transition-colors"
      >
        Ətraflı bax
      </Link>
    </div>
  );
}
