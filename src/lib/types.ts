// ============================================================
// Full Stack-Ready Data Models — B2B Restaurant-Supplier Marketplace
// ============================================================

export type UserRole = 'admin' | 'supplier' | 'restaurant';
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
