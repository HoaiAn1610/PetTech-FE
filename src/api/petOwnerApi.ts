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
    axiosInstance.get('/api/shop/loyalty/my-account'),

  getMyLoyaltyTransactions: (params?: { pageNumber?: number; pageSize?: number }) =>
    axiosInstance.get('/api/shop/loyalty/my-transactions', { params }),

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
};
