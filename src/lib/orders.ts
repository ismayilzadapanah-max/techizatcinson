import { createClient } from "@/lib/supabase/client";
import type { Order, OrderReview, OrderStatus, CreateOrderPayload } from "@/lib/types";

function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${rand}`;
}

function mapOrder(row: Record<string, unknown>): Order {
  const rp = row.restaurant_profiles as Record<string, unknown> | null;
  const sp = row.supplier_profiles as Record<string, unknown> | null;
  return {
    id: row.id as string,
    restaurantId: row.restaurant_id as string,
    supplierId: row.supplier_id as string,
    orderedBy: row.ordered_by as string | undefined,
    orderNumber: row.order_number as string,
    status: row.status as OrderStatus,
    deliveryAddress: row.delivery_address as string | undefined,
    deliveryDate: row.delivery_date as string | undefined,
    note: row.note as string | undefined,
    totalAmount: Number(row.total_amount ?? 0),
    qualityRating: row.quality_rating as number | undefined,
    satisfactionScore: row.satisfaction_score as number | undefined,
    satisfactionNote: row.satisfaction_note as string | undefined,
    deliveredAt: row.delivered_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    restaurantName: rp?.restaurant_name as string | undefined,
    supplierName: sp?.company_name as string | undefined,
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ orderId?: string; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase bağlantısı yoxdur" };

  const orderNumber = generateOrderNumber();
  const totalAmount = (payload.unitPrice ?? 0) * payload.quantity;

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      restaurant_id: payload.restaurantId,
      supplier_id: payload.supplierId,
      ordered_by: payload.orderedBy,
      order_number: orderNumber,
      status: "pending",
      delivery_address: payload.deliveryAddress,
      delivery_date: payload.deliveryDate || null,
      note: payload.note || null,
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (orderErr) return { error: orderErr.message };

  const { error: itemErr } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: payload.productId,
    product_name: payload.productName,
    quantity: payload.quantity,
    unit: payload.unit || null,
    unit_price: payload.unitPrice || null,
    total_price: totalAmount,
  });

  if (itemErr) return { error: itemErr.message };

  const { error: histErr } = await supabase.from("order_status_history").insert({
    order_id: order.id,
    old_status: null,
    new_status: "pending",
    changed_by: payload.orderedBy,
    note: "Sifariş yaradıldı",
  });

  if (histErr) return { error: histErr.message };

  return { orderId: order.id };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  changedBy: string,
  note?: string
): Promise<{ error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase bağlantısı yoxdur" };

  const { data: current, error: fetchErr } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchErr) return { error: fetchErr.message };

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === "delivered") updateData.delivered_at = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (updateErr) return { error: updateErr.message };

  const { error: histErr } = await supabase.from("order_status_history").insert({
    order_id: orderId,
    old_status: current.status,
    new_status: newStatus,
    changed_by: changedBy,
    note: note || null,
  });

  if (histErr) return { error: histErr.message };

  return {};
}

export async function createOrderReview(params: {
  orderId: string;
  restaurantId: string;
  supplierId: string;
  rating: number;
  qualityNote?: string;
  deliveryNote?: string;
  satisfactionScore?: number;
}): Promise<{ error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase bağlantısı yoxdur" };

  const { error: reviewErr } = await supabase.from("order_reviews").insert({
    order_id: params.orderId,
    restaurant_id: params.restaurantId,
    supplier_id: params.supplierId,
    rating: params.rating,
    quality_note: params.qualityNote || null,
    delivery_note: params.deliveryNote || null,
    satisfaction_score: params.satisfactionScore || null,
  });

  if (reviewErr) return { error: reviewErr.message };

  const { error: updateErr } = await supabase
    .from("orders")
    .update({
      quality_rating: params.rating,
      satisfaction_score: params.satisfactionScore || null,
      satisfaction_note: params.deliveryNote || null,
    })
    .eq("id", params.orderId);

  if (updateErr) return { error: updateErr.message };

  return {};
}

export async function getRestaurantOrders(restaurantId: string): Promise<Order[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      supplier_profiles(company_name),
      order_items(id)
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const mapped = mapOrder(row as Record<string, unknown>);
    const items = row.order_items as unknown[];
    mapped.items = items
      ? (items as Record<string, unknown>[]).map((i) => ({
          id: i.id as string,
          orderId: row.id as string,
          productName: "",
          quantity: 0,
          createdAt: "",
        }))
      : [];
    return mapped;
  });
}

export async function getSupplierOrders(supplierId: string): Promise<Order[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      restaurant_profiles(restaurant_name),
      order_items(id)
    `)
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const mapped = mapOrder(row as Record<string, unknown>);
    const items = row.order_items as unknown[];
    mapped.items = items
      ? (items as Record<string, unknown>[]).map((i) => ({
          id: i.id as string,
          orderId: row.id as string,
          productName: "",
          quantity: 0,
          createdAt: "",
        }))
      : [];
    return mapped;
  });
}

export async function getOrderDetail(orderId: string): Promise<Order | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      restaurant_profiles(restaurant_name),
      supplier_profiles(company_name),
      order_items(*),
      order_status_history(*)
    `)
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const mapped = mapOrder(row);

  const rawItems = row.order_items as Record<string, unknown>[] | null;
  mapped.items = rawItems
    ? rawItems.map((i) => ({
        id: i.id as string,
        orderId: i.order_id as string,
        productId: i.product_id as string | undefined,
        productName: (i.product_name as string) || "",
        quantity: Number(i.quantity ?? 1),
        unit: i.unit as string | undefined,
        unitPrice: i.unit_price != null ? Number(i.unit_price) : undefined,
        totalPrice: i.total_price != null ? Number(i.total_price) : undefined,
        createdAt: i.created_at as string,
      }))
    : [];

  const rawHistory = row.order_status_history as Record<string, unknown>[] | null;
  mapped.statusHistory = rawHistory
    ? rawHistory
        .map((h) => ({
          id: h.id as string,
          orderId: h.order_id as string,
          oldStatus: h.old_status as string | undefined,
          newStatus: h.new_status as string,
          changedBy: h.changed_by as string | undefined,
          note: h.note as string | undefined,
          createdAt: h.created_at as string,
        }))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  return mapped;
}

export async function getAdminOrders(filters?: {
  status?: string;
  restaurantId?: string;
  supplierId?: string;
  from?: string;
  to?: string;
}): Promise<Order[]> {
  const supabase = createClient();
  if (!supabase) return [];

  let query = supabase
    .from("orders")
    .select(`
      *,
      restaurant_profiles(restaurant_name),
      supplier_profiles(company_name),
      order_items(id)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.restaurantId) query = query.eq("restaurant_id", filters.restaurantId);
  if (filters?.supplierId) query = query.eq("supplier_id", filters.supplierId);
  if (filters?.from) query = query.gte("created_at", filters.from);
  if (filters?.to) query = query.lte("created_at", filters.to);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => mapOrder(row as Record<string, unknown>));
}

export async function getOrderReview(orderId: string): Promise<OrderReview | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("order_reviews")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    restaurantId: row.restaurant_id as string | undefined,
    supplierId: row.supplier_id as string | undefined,
    rating: Number(row.rating),
    qualityNote: row.quality_note as string | undefined,
    deliveryNote: row.delivery_note as string | undefined,
    satisfactionScore: row.satisfaction_score != null ? Number(row.satisfaction_score) : undefined,
    createdAt: row.created_at as string,
  };
}
