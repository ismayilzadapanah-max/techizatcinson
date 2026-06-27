import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

interface Props {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "md" }: Props) {
  const cfg = ORDER_STATUSES[status];
  if (!cfg) return null;

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${cfg.color} ${sizeClass}`}
    >
      <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
