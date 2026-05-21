import axiosInstance from './axiosInstance';
import type {
  PaginatedResult, TenantListParams, Tenant, CreateTenantRequest, UpdateTenantRequest,
  BillingOverview, Invoice, InvoiceListParams,
  SupportTicket, TicketListParams, UpdateTicketRequest, ReplyTicketRequest,
  AdminUser, InviteAdminRequest,
  PlatformAnalytics,
  SystemSettings,
  SubscriptionPlan, UpdatePlanRequest,
  ActivityLog, LogListParams,
  Campaign, CreateCampaignRequest, CustomerSegment,
  OverviewKPIs,
} from '@/types/admin';

const A = '/api/admin';

export const adminApi = {
  // ── Overview ───────────────────────────────────────────────────────────
  getOverviewKPIs: (): Promise<OverviewKPIs> =>
    axiosInstance.get(`${A}/overview`),

  getRecentActivity: (limit = 10): Promise<ActivityLog[]> =>
    axiosInstance.get(`${A}/logs`, { params: { pageSize: limit, page: 1 } }),

  // ── Tenants ────────────────────────────────────────────────────────────
  getTenants: (params?: TenantListParams): Promise<PaginatedResult<Tenant>> =>
    axiosInstance.get(`${A}/tenants`, { params }),

  getTenant: (id: string): Promise<Tenant> =>
    axiosInstance.get(`${A}/tenants/${id}`),

  createTenant: (data: CreateTenantRequest): Promise<Tenant> =>
    axiosInstance.post(`${A}/tenants`, data),

  updateTenant: (id: string, data: UpdateTenantRequest): Promise<Tenant> =>
    axiosInstance.put(`${A}/tenants/${id}`, data),

  suspendTenant: (id: string): Promise<void> =>
    axiosInstance.post(`${A}/tenants/${id}/suspend`),

  reactivateTenant: (id: string): Promise<void> =>
    axiosInstance.post(`${A}/tenants/${id}/reactivate`),

  deleteTenant: (id: string): Promise<void> =>
    axiosInstance.delete(`${A}/tenants/${id}`),

  // ── Billing ────────────────────────────────────────────────────────────
  getBillingOverview: (): Promise<BillingOverview> =>
    axiosInstance.get(`${A}/billing`),

  getInvoices: (params?: InvoiceListParams): Promise<PaginatedResult<Invoice>> =>
    axiosInstance.get(`${A}/billing/invoices`, { params }),

  retryPayment: (invoiceId: string): Promise<void> =>
    axiosInstance.post(`${A}/billing/invoices/${invoiceId}/retry`),

  // ── Support Tickets ────────────────────────────────────────────────────
  getSupportTickets: (params?: TicketListParams): Promise<PaginatedResult<SupportTicket>> =>
    axiosInstance.get(`${A}/support-tickets`, { params }),

  getTicket: (id: string): Promise<SupportTicket> =>
    axiosInstance.get(`${A}/support-tickets/${id}`),

  updateTicket: (id: string, data: UpdateTicketRequest): Promise<SupportTicket> =>
    axiosInstance.put(`${A}/support-tickets/${id}`, data),

  replyTicket: (id: string, data: ReplyTicketRequest): Promise<void> =>
    axiosInstance.post(`${A}/support-tickets/${id}/reply`, data),

  // ── Admin Users ────────────────────────────────────────────────────────
  getAdminUsers: (): Promise<AdminUser[]> =>
    axiosInstance.get('/api/auth/admin/users'),

  inviteAdmin: (data: InviteAdminRequest): Promise<void> =>
    axiosInstance.post('/api/auth/admin/users/invite', data),

  deleteAdmin: (id: string): Promise<void> =>
    axiosInstance.delete(`/api/auth/admin/users/${id}`),

  // ── Analytics ──────────────────────────────────────────────────────────
  getAnalytics: (): Promise<PlatformAnalytics> =>
    axiosInstance.get('/api/analytics'),

  // ── System Settings ────────────────────────────────────────────────────
  getSystemSettings: (): Promise<SystemSettings> =>
    axiosInstance.get(`${A}/system`),

  updateSystemSettings: (data: Partial<SystemSettings>): Promise<SystemSettings> =>
    axiosInstance.put(`${A}/system`, data),

  // ── Subscription Plans ─────────────────────────────────────────────────
  getPlans: (): Promise<SubscriptionPlan[]> =>
    axiosInstance.get(`${A}/plans`),

  updatePlan: (id: string, data: UpdatePlanRequest): Promise<SubscriptionPlan> =>
    axiosInstance.put(`${A}/plans/${id}`, data),

  // ── Activity Logs ──────────────────────────────────────────────────────
  getActivityLogs: (params?: LogListParams): Promise<PaginatedResult<ActivityLog>> =>
    axiosInstance.get(`${A}/logs`, { params }),

  // ── CRM ────────────────────────────────────────────────────────────────
  getCampaigns: (): Promise<Campaign[]> =>
    axiosInstance.get(`${A}/crm/campaigns`),

  createCampaign: (data: CreateCampaignRequest): Promise<Campaign> =>
    axiosInstance.post(`${A}/crm/campaigns`, data),

  updateCampaign: (id: string, data: Partial<CreateCampaignRequest>): Promise<Campaign> =>
    axiosInstance.put(`${A}/crm/campaigns/${id}`, data),

  getSegments: (): Promise<CustomerSegment[]> =>
    axiosInstance.get(`${A}/crm/segments`),
};
