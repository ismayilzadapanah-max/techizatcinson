"use client";

import { useState } from "react";
import { SUPPLIER_STATUS_TRANSITIONS, ORDER_STATUSES } from "@/lib/constants";
import { updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  userId: string;
  onUpdated: (newStatus: OrderStatus) => void;
}

export function UpdateOrderStatusButton({ orderId, currentStatus, userId, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const availableTransitions = SUPPLIER_STATUS_TRANSITIONS[currentStatus] || [];

  if (availableTransitions.length === 0) return null;

  function handleSelect(status: string) {
    setSelectedStatus(status as OrderStatus);
    setShowConfirm(true);
    setError("");
  }

  async function handleConfirm() {
    if (!selectedStatus) return;
    setLoading(true);
    setError("");
    const result = await updateOrderStatus(orderId, selectedStatus, userId, noteInput || undefined);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setShowConfirm(false);
    setNoteInput("");
    onUpdated(selectedStatus);
  }

  return (
    <div className="space-y-3">
      {!showConfirm ? (
        <div className="flex flex-wrap gap-2">
          {availableTransitions.map((status) => {
            const cfg = ORDER_STATUSES[status];
            const isCancel = status === "cancelled" || status === "rejected";
            return (
              <button
                key={status}
                onClick={() => handleSelect(status)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isCancel
                    ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    : "bg-[#141647] text-white hover:bg-[#243786]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cfg?.icon || "arrow_forward"}</span>
                {cfg?.label || status}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#F4F5F9] border border-[#E9E8EE] rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#141647]">
            Status dəyişikliyi:{" "}
            <span className="text-[#243786]">
              {ORDER_STATUSES[selectedStatus]?.label || selectedStatus}
            </span>
          </p>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#5D608B] mb-1.5">
              Qeyd (ixtiyari)
            </label>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Status dəyişikliyi ilə bağlı qeyd..."
              className="w-full px-3 py-2 bg-white border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-[#141647] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#243786] transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  Yüklənir...
                </>
              ) : (
                "Təsdiqlə"
              )}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setSelectedStatus("");
                setNoteInput("");
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-[#5D608B] border border-[#E9E8EE] hover:bg-[#F4F5F9] transition-colors"
            >
              Ləğv et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
