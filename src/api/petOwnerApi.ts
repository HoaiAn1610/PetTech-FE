import axiosInstance from './axiosInstance';

export interface UserProfileDto {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role: string;
  tenantId?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  memberSince: string;
  lastLoginAt?: string;
}

export interface ShopProductParams {
  Name?: string;
  Brand?: string;
  IsInStock?: boolean;
  CategoryId?: string;
  IsActive?: boolean;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  IsDescending?: boolean;
}

export interface ShopCategoryParams {
  IsActive?: boolean;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
}

export const petOwnerApi = {
  // ── Profile ───────────────────────────────────────────────────────────────
  getMe: (): Promise<UserProfileDto> =>
    axiosInstance.get('/api/Auth/me'),

  // ── Shop Products ─────────────────────────────────────────────────────────
  getProducts: (params?: ShopProductParams) =>
    axiosInstance.get('/api/shop/Products', { params }),

  // ── Shop Categories ───────────────────────────────────────────────────────
  getCategories: (params?: ShopCategoryParams) =>
    axiosInstance.get('/api/shop/Categories', { params }),

  // ── Customer Portal ───────────────────────────────────────────────────────
  getDashboard: () =>
    axiosInstance.get('/api/pet-owner/portal/dashboard'),

  getMedicalHistory: (params?: { pageNumber?: number; pageSize?: number }) =>
    axiosInstance.get('/api/pet-owner/portal/medical-history', { params }),

  getPortalInvoices: (params?: { pageNumber?: number; pageSize?: number }) =>
    axiosInstance.get('/api/pet-owner/portal/invoices', { params }),

  // ── Loyalty ───────────────────────────────────────────────────────────────
  getMyLoyaltyAccount: () =>
    axiosInstance.get('/api/shop/loyalty/account'),

  getMyLoyaltyTransactions: (params?: { page?: number; pageNumber?: number; pageSize?: number }) => {
    const apiParams = {
      page: params?.page ?? params?.pageNumber ?? 1,
      pageSize: params?.pageSize ?? 10,
    };
    return axiosInstance.get('/api/shop/loyalty/transactions', { params: apiParams });
  },

  getLoyaltyTiers: () =>
    axiosInstance.get('/api/shop/loyalty/tiers'),

  redeemLoyalty: (payload: { points: number; rewardDescription?: string }) =>
    axiosInstance.post('/api/shop/loyalty/redeem', payload),

  // ── Wallet ────────────────────────────────────────────────────────────────
  getMyWallet: () =>
    axiosInstance.get('/api/shop/wallets/my-wallet'),

  topUpWallet: (payload: { amount: number; returnUrl?: string }) =>
    axiosInstance.post('/api/shop/wallets/top-up', payload),

  // ── Notifications ─────────────────────────────────────────────────────────
  getNotifications: (params?: { pageNumber?: number; pageSize?: number }) =>
    axiosInstance.get('/api/notifications', { params }),

  getUnreadCount: () =>
    axiosInstance.get('/api/notifications/unread-count'),

  markNotificationRead: (id: string) =>
    axiosInstance.patch(`/api/notifications/${id}/read`),

  markAllNotificationsRead: () =>
    axiosInstance.patch('/api/notifications/read-all'),

  // ── Storefront Cart ───────────────────────────────────────────────────────
  getCart: () =>
    axiosInstance.get('/api/storefront/cart'),

  addToCart: (payload: { productId: string; quantity: number }) =>
    axiosInstance.post('/api/storefront/cart/items', payload),

  updateCartItem: (cartItemId: string, payload: { quantity: number }) =>
    axiosInstance.put(`/api/storefront/cart/items/${cartItemId}`, payload),

  deleteCartItem: (cartItemId: string) =>
    axiosInstance.delete(`/api/storefront/cart/items/${cartItemId}`),

  clearCart: () =>
    axiosInstance.delete('/api/storefront/cart'),

  // ── Storefront Checkout & Orders ──────────────────────────────────────────
  checkout: (payload: CheckoutRequest) =>
    axiosInstance.post('/api/storefront/checkout', payload),

  getOrders: (params?: { deliveryStatus?: string; page?: number; pageSize?: number }) =>
    axiosInstance.get('/api/storefront/orders', { params }),

  getOrderById: (id: string) =>
    axiosInstance.get(`/api/storefront/orders/${id}`),

  cancelOrder: (id: string, payload: CancelOrderRequest) =>
    axiosInstance.delete(`/api/storefront/orders/${id}`, { data: payload }),
};

// ── Storefront Interfaces ─────────────────────────────────────────────────────
export interface ShippingAddressRequest {
  recipientName: string;
  phone: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  deliveryNote?: string;
}

export interface CheckoutRequest {
  petId?: string;
  paymentMethod: 'cash' | 'online' | 'wallet';
  couponCode?: string;
  notes?: string;
  shippingAddress: ShippingAddressRequest;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface CheckoutResultDto {
  invoiceId: string;
  invoiceNumber?: string;
  total: number;
  status: string;
  paymentUrl?: string;
}

