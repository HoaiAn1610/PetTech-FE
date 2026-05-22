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
  createCampaign: (data: CreateCampaignRequest): Promise<Campaign> =>
    axiosInstance.post(`${A}/crm/campaigns`, data),

  // DELETE /api/admin/crm/campaigns/{id}
  deleteCampaign: (id: string): Promise<void> =>
    axiosInstance.delete(`${A}/crm/campaigns/${id}`),

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
};

