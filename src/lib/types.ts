// ============================================================
// Full Stack-Ready Data Models — B2B Restaurant-Supplier Marketplace
// ============================================================

export type UserRole = 'admin' | 'supplier' | 'supplier_staff' | 'restaurant';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'disabled';
export type StockStatus = 'in_stock' | 'pre_order' | 'out_of_stock';
export type RFQStatus = 'pending' | 'answered' | 'accepted' | 'rejected' | 'expired';
export type ComplaintStatus = 'new' | 'reviewing' | 'resolved' | 'rejected';
export type MessageStatus = 'unread' | 'read' | 'archived';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierProfile {
  id: string;
  userId: string;
  companyName: string;
  voen: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  whatsappLink: string;
  email: string;
  city: string;
  region: string;
  address: string;
  category: string;
  about: string;
  logoUrl?: string;
  coverUrl?: string;
  documentUrls: string[];
  rating: number;
  reviewCount: number;
  productCount: number;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  isPublic: boolean;
  workingHours?: string;
  mapLink?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantProfile {
  id: string;
  userId: string;
  restaurantName: string;
  companyType: string;
  branchCount: number;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  region: string;
  address: string;
  note: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListing {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierLogoUrl?: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  description: string;
  shortDescription: string;
  price: number;
  priceUnit: string;
  isPriceNegotiable: boolean;
  minOrderQty: number;
  wholesaleAvailable: boolean;
  stockStatus: StockStatus;
  stockQty: number;
  deliveryRegions: string[];
  deliveryTime: string;
  deliveryFee: number;
  contactPerson: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactWhatsappLink: string;
  contactEmail: string;
  images: ProductImage[];
  mainImageIndex: number;
  viewCount: number;
  favoriteCount: number;
  listingStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  size: string;
  brand: string;
  qualityType: string;
  price: number;
  minOrderQty: number;
  stock: number;
  note: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Region {
  id: string;
  name: string;
  type: 'city' | 'district';
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'product' | 'supplier';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  body: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatarUrl?: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface RFQ {
  id: string;
  restaurantId: string;
  restaurantName: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  quantity: number;
  deliveryAddress: string;
  requestedDate: string;
  contactPhone: string;
  contactWhatsapp: string;
  note: string;
  proposedPrice?: number;
  proposedMinOrder?: number;
  proposedDeliveryTime?: string;
  responseNote?: string;
  status: RFQStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  targetId: string;
  targetType: 'supplier' | 'product';
  rating: number;
  comment: string;
  isApproved: boolean;
  isHidden: boolean;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  targetType: 'supplier' | 'product' | 'user';
  targetId: string;
  reason: string;
  description: string;
  status: ComplaintStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  listingLimit: number;
  visibility: string;
  priorityRanking: boolean;
  profileBadge: string;
  price: number;
  isActive: boolean;
  createdAt: string;
}

// Dashboard & Stats
export interface AdminStats {
  totalSuppliers: number;
  totalRestaurants: number;
  totalProducts: number;
  pendingApprovals: number;
  totalRFQs: number;
  totalComplaints: number;
  totalReviews: number;
  activePackages: number;
}

export interface SupplierDashboardStats {
  totalProducts: number;
  activeListings: number;
  pendingApprovals: number;
  incomingRFQs: number;
  totalViews: number;
  favoriteCount: number;
}

export interface RestaurantDashboardStats {
  favoriteProducts: number;
  favoriteSuppliers: number;
  sentRFQs: number;
  unreadMessages: number;
}

// ============================================================
// Sifariş İzləmə — Order Tracking
// ============================================================

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'on_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface Order {
  id: string;
  restaurantId: string;
  supplierId: string;
  orderedBy?: string;
  orderNumber: string;
  status: OrderStatus;
  deliveryAddress?: string;
  deliveryDate?: string;
  note?: string;
  totalAmount: number;
  qualityRating?: number;
  satisfactionScore?: number;
  satisfactionNote?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  restaurantName?: string;
  supplierName?: string;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  review?: OrderReview | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  createdAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  oldStatus?: string;
  newStatus: string;
  changedBy?: string;
  note?: string;
  createdAt: string;
}

export interface OrderReview {
  id: string;
  orderId: string;
  restaurantId?: string;
  supplierId?: string;
  rating: number;
  qualityNote?: string;
  deliveryNote?: string;
  satisfactionScore?: number;
  createdAt: string;
}

export interface CreateOrderPayload {
  productId: string;
  productName: string;
  supplierId: string;
  restaurantId: string;
  orderedBy: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
  deliveryAddress: string;
  deliveryDate: string;
  note?: string;
}

// ─── Team Management ─────────────────────────────────────────
export type TeamRole =
  | 'owner'
  | 'manager'
  | 'orders_manager'
  | 'stock_manager'
  | 'product_manager'
  | 'finance_manager'
  | 'viewer';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface TeamMember {
  id: string;
  supplierId: string;
  userId: string;
  role: TeamRole;
  isActive: boolean;
  invitedBy?: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  // Joined
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface SupplierInvitation {
  id: string;
  supplierId: string;
  invitedBy?: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: TeamRole;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  // Joined
  invitedByName?: string;
  supplierName?: string;
}

export interface ActivityLog {
  id: string;
  supplierId: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
  // Joined
  userName?: string;
}

export interface CreateInvitationPayload {
  supplierId: string;
  invitedBy: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: Exclude<TeamRole, 'owner'>;
}
