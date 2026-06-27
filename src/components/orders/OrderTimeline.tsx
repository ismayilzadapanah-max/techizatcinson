import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatusHistory } from "@/lib/types";

interface Props {
  history: OrderStatusHistory[];
}

export function OrderTimeline({ history }: Props) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-[#5D608B] italic">Status tarixçəsi yoxdur.</p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-6 bottom-0 w-px bg-[#E9E8EE]" />

      <div className="space-y-4">
        {history.map((entry, idx) => {
          const cfg = ORDER_STATUSES[entry.newStatus];
          const isLast = idx === history.length - 1;
          return (
            <div key={entry.id} className="flex gap-4 relative">
              {/* Dot */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                  isLast
                    ? "bg-[#243786] border-[#243786]"
                    : "bg-white border-[#E9E8EE]"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[15px] ${
                    isLast ? "text-white" : "text-[#9DB1CA]"
                  }`}
                >
                  {cfg?.icon || "circle"}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[#141647]">
                    {cfg?.label || entry.newStatus}
                  </span>
                  {entry.oldStatus && (
                    <span className="text-xs text-[#9DB1CA]">
                      ({ORDER_STATUSES[entry.oldStatus]?.label || entry.oldStatus} → {cfg?.label || entry.newStatus})
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5D608B] mt-0.5">
                  {new Date(entry.createdAt).toLocaleString("az-AZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {entry.note && (
                  <p className="text-xs text-[#5D608B] mt-1 italic">"{entry.note}"</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
