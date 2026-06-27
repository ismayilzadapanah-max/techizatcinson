"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/orders";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  unitPrice?: number;
  unit?: string;
  restaurantId: string;
  userId: string;
}

export function CreateOrderModal({
  open,
  onClose,
  productId,
  productName,
  supplierId,
  supplierName,
  unitPrice,
  unit,
  restaurantId,
  userId,
}: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = (unitPrice ?? 0) * quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!deliveryAddress.trim()) {
      setError("Çatdırılma ünvanı tələb olunur.");
      return;
    }
    if (quantity < 1) {
      setError("Miqdar 1-dən az ola bilməz.");
      return;
    }

    setLoading(true);
    const result = await createOrder({
      productId,
      productName,
      supplierId,
      restaurantId,
      orderedBy: userId,
      quantity,
      unit,
      unitPrice,
      deliveryAddress: deliveryAddress.trim(),
      deliveryDate,
      note: note.trim() || undefined,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onClose();
    router.push("/account/restaurant/orders");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9E8EE]">
          <div>
            <h2 className="font-bold text-[#141647]">Sifariş yarat</h2>
            <p className="text-xs text-[#5D608B] mt-0.5 truncate max-w-[240px]">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5D608B] hover:bg-[#F4F5F9] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Supplier info */}
        <div className="px-5 py-3 bg-[#F4F5F9] border-b border-[#E9E8EE]">
          <p className="text-xs text-[#5D608B]">
            <span className="font-medium text-[#141647]">Təchizatçı:</span> {supplierName}
          </p>
          {unitPrice != null && unitPrice > 0 && (
            <p className="text-xs text-[#5D608B] mt-0.5">
              <span className="font-medium text-[#141647]">Vahid qiymət:</span>{" "}
              {unitPrice.toFixed(2)} ₼{unit ? ` / ${unit}` : ""}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-[#141647] mb-1.5">
              Miqdar {unit ? `(${unit})` : ""} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
              placeholder="1"
            />
          </div>

          {/* Delivery address */}
          <div>
            <label className="block text-xs font-semibold text-[#141647] mb-1.5">
              Çatdırılma ünvanı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
              placeholder="Çatdırılma ünvanını daxil edin"
            />
          </div>

          {/* Delivery date */}
          <div>
            <label className="block text-xs font-semibold text-[#141647] mb-1.5">
              Çatdırılma tarixi
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-[#141647] mb-1.5">Qeyd</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors resize-none"
              placeholder="Əlavə məlumat..."
            />
          </div>

          {/* Total */}
          {unitPrice != null && unitPrice > 0 && (
            <div className="flex items-center justify-between py-3 border-t border-[#E9E8EE]">
              <span className="text-sm text-[#5D608B]">Ümumi məbləğ</span>
              <span className="text-lg font-bold text-[#141647]">{totalAmount.toFixed(2)} ₼</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#141647] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#243786] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                Göndərilir...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                Sifarişi təsdiqlə
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
