import { APPROVAL_STATUSES } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
  type?: "approval" | "active" | "stock";
}

const DOT_COLORS: Record<string, string> = {
  pending: "bg-amber-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  disabled: "bg-gray-400",
  active: "bg-green-500",
  inactive: "bg-gray-400",
  in_stock: "bg-green-500",
  pre_order: "bg-amber-500",
  out_of_stock: "bg-red-500",
};

const LABELS: Record<string, string> = {
  pending: "Gözləyir",
  approved: "Təsdiqlənib",
  rejected: "Rədd edilib",
  disabled: "Deaktiv",
  active: "Aktiv",
  inactive: "Deaktiv",
  in_stock: "Mövcuddur",
  pre_order: "Ön sifariş",
  out_of_stock: "Stokda yoxdur",
};

export function StatusBadge({ status, type = "approval" }: StatusBadgeProps) {
  const approval = APPROVAL_STATUSES[status];
  const dotColor = DOT_COLORS[status] || "bg-gray-400";
  const label = LABELS[status] || status;

  if (type === "approval" && approval) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${approval.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {approval.label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
