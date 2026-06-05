import axiosInstance from './axiosInstance';
import type {
  PaginatedResult, PaginationParams,
  TenantListParams, Tenant, CreateTenantRequest, UpdateTenantRequest,
  SubscriptionPlan, CreatePlanRequest, UpdatePlanRequest,
  Invoice, InvoiceListParams,
  SupportTicket, TicketListParams, UpdateTicketStatusRequest,
  Campaign, CreateCampaignRequest, CampaignListParams,
  CustomerSegment, CreateSegmentRequest, SegmentListParams,
  CrmCustomer, UpdateCustomerNotesRequest, CustomerListParams,
  AdminUser, InviteAdminUserRequest, UpdateAdminUserRequest, AdminUserListParams,
  SystemConfig, UpsertSystemConfigRequest,
  TenantSummary, BillingSummary, AdminDashboardKpi,
  ActivityLog, ActivityLogParams,
} from '@/types/admin';

const A = '/api/admin';

export const adminApi = {
  // ── Tenants ────────────────────────────────────────────────────────────
  // GET  /api/admin/tenants
  getTenants: (params?: TenantListParams): Promise<PaginatedResult<Tenant>> =>
    axiosInstance.get(`${A}/tenants`, { params }),

  // GET  /api/admin/tenants/{id}
  getTenant: (id: string): Promise<Tenant> =>
    axiosInstance.get(`${A}/tenants/${id}`),

  // POST /api/admin/tenants
  createTenant: (data: CreateTenantRequest): Promise<Tenant> =>
    axiosInstance.post(`${A}/tenants`, data),

  // PUT  /api/admin/tenants/{id}
  updateTenant: (id: string, data: UpdateTenantRequest): Promise<Tenant> =>
    axiosInstance.put(`${A}/tenants/${id}`, data),

  // POST /api/admin/tenants/{id}/suspend
  suspendTenant: (id: string): Promise<void> =>
    axiosInstance.post(`${A}/tenants/${id}/suspend`),

  // POST /api/admin/tenants/{id}/reactivate
  reactivateTenant: (id: string): Promise<void> =>
    axiosInstance.post(`${A}/tenants/${id}/reactivate`),

  // DELETE /api/admin/tenants/{id}
  deleteTenant: (id: string): Promise<void> =>
    axiosInstance.delete(`${A}/tenants/${id}`),

  // ── Billing / Plans ────────────────────────────────────────────────────
  // GET  /api/admin/billing/plans
  getPlans: (params?: PaginationParams): Promise<PaginatedResult<SubscriptionPlan>> =>
    axiosInstance.get(`${A}/billing/plans`, { params }),

  // GET  /api/admin/billing/plans/{id}
  getPlan: (id: string): Promise<SubscriptionPlan> =>
    axiosInstance.get(`${A}/billing/plans/${id}`),

  // POST /api/admin/billing/plans
  createPlan: (data: CreatePlanRequest): Promise<SubscriptionPlan> =>
    axiosInstance.post(`${A}/billing/plans`, data),

  // PUT  /api/admin/billing/plans/{id}
  updatePlan: (id: string, data: UpdatePlanRequest): Promise<SubscriptionPlan> =>
    axiosInstance.put(`${A}/billing/plans/${id}`, data),

  // DELETE /api/admin/billing/plans/{id}
  deletePlan: (id: string): Promise<void> =>
    axiosInstance.delete(`${A}/billing/plans/${id}`),

  // PATCH /api/admin/billing/plans/{id}/status
  updatePlanStatus: (id: string, isActive: boolean): Promise<void> =>
    axiosInstance.patch(`${A}/billing/plans/${id}/status`, isActive),

  // ── Billing / Invoices ─────────────────────────────────────────────────
  // GET  /api/admin/billing/invoices
  getInvoices: (params?: InvoiceListParams): Promise<PaginatedResult<Invoice>> =>
    axiosInstance.get(`${A}/billing/invoices`, { params }),

  // GET  /api/admin/billing/invoices/{id}
  getInvoice: (id: string): Promise<Invoice> =>
    axiosInstance.get(`${A}/billing/invoices/${id}`),

  // POST /api/admin/billing/invoices/{id}/retry
  retryPayment: (invoiceId: string): Promise<void> =>
    axiosInstance.post(`${A}/billing/invoices/${invoiceId}/retry`),

  // ── Support Tickets ────────────────────────────────────────────────────
  // GET  /api/admin/support-tickets
  getSupportTickets: (params?: TicketListParams): Promise<PaginatedResult<SupportTicket>> =>
    axiosInstance.get(`${A}/support-tickets`, { params }),

  // GET  /api/admin/support-tickets/{id}
  getTicket: (id: string): Promise<SupportTicket> =>
    axiosInstance.get(`${A}/support-tickets/${id}`),

  // PATCH /api/admin/support-tickets/{id}/status
  updateTicketStatus: (id: string, data: UpdateTicketStatusRequest): Promise<void> =>
    axiosInstance.patch(`${A}/support-tickets/${id}/status`, data),

  // ── CRM / Campaigns ────────────────────────────────────────────────────
  // GET  /api/admin/crm/campaigns
  getCampaigns: (params?: CampaignListParams): Promise<PaginatedResult<Campaign>> =>
    axiosInstance.get(`${A}/crm/campaigns`, { params }),

  // POST /api/admin/crm/campaigns
  createCampaign: (data: CreateCampaignRequest): Promise<Campaign> => {
    const typeMapping: Record<string, number> = {
      VaccineReminder: 0,
      Birthday: 1,
      ChurnWinback: 2,
      CartAbandonment: 3,
      PostVisit: 4,
      Custom: 5
    };

    const isGuid = (val?: string) => 
      val ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val) : false;

    const mappedPayload = {
      ...data,
      type: typeMapping[data.type] ?? 5,
      segmentId: isGuid(data.segmentId) ? data.segmentId : null
    };

    return axiosInstance.post(`${A}/crm/campaigns`, mappedPayload);
  },

  // DELETE /api/admin/crm/campaigns/{id}
  deleteCampaign: (id: string): Promise<void> =>
    axiosInstance.delete(`${A}/crm/campaigns/${id}`),

  // PUT /api/admin/crm/campaigns/{id}
  updateCampaign: (id: string, data: CreateCampaignRequest): Promise<Campaign> => {
    const typeMapping: Record<string, number> = {
      VaccineReminder: 0,
      Birthday: 1,
      ChurnWinback: 2,
      CartAbandonment: 3,
      PostVisit: 4,
      Custom: 5
    };

    const isGuid = (val?: string) => 
      val ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val) : false;

    const mappedPayload = {
      ...data,
      type: typeMapping[data.type] ?? 5,
      segmentId: isGuid(data.segmentId) ? data.segmentId : null
    };

    return axiosInstance.put(`${A}/crm/campaigns/${id}`, mappedPayload);
  },

  // POST /api/admin/crm/campaigns/{id}/execute
  executeCampaign: (id: string): Promise<void> =>
    axiosInstance.post(`${A}/crm/campaigns/${id}/execute`),

  // ── CRM / Segments ─────────────────────────────────────────────────────
  // GET  /api/admin/crm/segments
  getSegments: (params?: SegmentListParams): Promise<PaginatedResult<CustomerSegment>> =>
    axiosInstance.get(`${A}/crm/segments`, { params }),

  // POST /api/admin/crm/segments
  createSegment: (data: CreateSegmentRequest): Promise<CustomerSegment> =>
    axiosInstance.post(`${A}/crm/segments`, data),

  // PUT /api/admin/crm/segments/{id}
  updateSegment: (id: string, data: CreateSegmentRequest): Promise<CustomerSegment> =>
    axiosInstance.put(`${A}/crm/segments/${id}`, data),

  // DELETE /api/admin/crm/segments/{id}
  deleteSegment: (id: string): Promise<void> =>
    axiosInstance.delete(`${A}/crm/segments/${id}`),

  // ── CRM / Customers ────────────────────────────────────────────────────
  // GET /api/admin/crm/customers
  getCrmCustomers: (params?: CustomerListParams): Promise<PaginatedResult<CrmCustomer>> =>
    axiosInstance.get(`${A}/crm/customers`, { params }),

  // PUT /api/admin/crm/customers/{id}/notes
  updateCustomerNotes: (id: string, data: UpdateCustomerNotesRequest): Promise<void> =>
    axiosInstance.put(`${A}/crm/customers/${id}/notes`, data),

  // ── Admin Users ─────────────────────────────────────────────────────────────
  // GET /api/auth/admin/users
  getAdminUsers: (params?: AdminUserListParams): Promise<PaginatedResult<AdminUser>> =>
    axiosInstance.get('/api/auth/admin/users', { params }),

  // POST /api/auth/admin/users/invite
  inviteAdminUser: (data: InviteAdminUserRequest): Promise<AdminUser> =>
    axiosInstance.post('/api/auth/admin/users/invite', data),

  // PATCH /api/auth/admin/users/{id}
  updateAdminUser: (id: string, data: UpdateAdminUserRequest): Promise<AdminUser> =>
    axiosInstance.patch(`/api/auth/admin/users/${id}`, data),

  // DELETE /api/auth/admin/users/{id}
  deleteAdminUser: (id: string): Promise<void> =>
    axiosInstance.delete(`/api/auth/admin/users/${id}`),

  // ── System Config ───────────────────────────────────────────────────────────
  // GET /api/admin/system
  getSystemConfigs: (group?: string): Promise<SystemConfig[]> =>
    axiosInstance.get(`${A}/system`, { params: { group } }),

  // PUT /api/admin/system
  upsertSystemConfig: (data: UpsertSystemConfigRequest): Promise<SystemConfig> =>
    axiosInstance.put(`${A}/system`, data),

  // DELETE /api/admin/system/{key}
  deleteSystemConfig: (key: string): Promise<void> =>
    axiosInstance.delete(`${A}/system/${key}`),

  // ── Platform Analytics ──────────────────────────────────────────────────────
  // GET /api/analytics
  getPlatformAnalytics: (): Promise<AdminDashboardKpi> =>
    axiosInstance.get('/api/analytics'),

  // ── Activity Logs ───────────────────────────────────────────────────────────
  // GET /api/admin/logs
  getActivityLogs: (params?: ActivityLogParams): Promise<PaginatedResult<ActivityLog>> =>
    axiosInstance.get(`${A}/logs`, { params }),

  // ── Tenant & Billing Summaries ──────────────────────────────────────────────
  // GET /api/admin/tenants/summary
  getTenantSummary: (): Promise<TenantSummary> =>
    axiosInstance.get(`${A}/tenants/summary`),

  // GET /api/admin/billing/summary
  getBillingSummary: (): Promise<BillingSummary> =>
    axiosInstance.get(`${A}/billing/summary`),

  // ── Support Ticket Reply ────────────────────────────────────────────────────
  // POST /api/admin/support-tickets/{id}/reply
  replySupportTicket: (id: string, message: string): Promise<any> =>
    axiosInstance.post(`${A}/support-tickets/${id}/reply`, { message }),
};

