// ─── Pagination ────────────────────────────────────────────────────────────
// Matches backend PagedResult<T>
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  isDescending?: boolean;
}

// ─── Tenants ────────────────────────────────────────────────────────────────
// Matches backend TenantStatus enum
export type TenantStatus = 'Active' | 'Trial' | 'Suspended' | 'Cancelled';

// Matches backend TenantDto
export interface Tenant {
  id: string;
  code: string;
  name: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  status?: TenantStatus;
  mrr: number;
  planId?: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface CreateTenantRequest {
  code: string;
  name: string;
  ownerName?: string;
  email: string;
  phone?: string;
  planId?: string;
  durationMonths?: number;
  defaultAdminPassword: string;
}

export interface UpdateTenantRequest {
  name: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  status?: string;
  planId?: string;
  adminAction?: 'Override' | 'UpgradeWithInvoice' | 'DowngradeWithRefund';
  durationMonths?: number;
}

export interface TenantListParams extends PaginationParams {
  code?: string;
  name?: string;
  status?: number | '';  // TenantStatus enum: 0=Trial 1=Active 2=Suspended 3=Cancelled
  planId?: string;
}

// ─── Billing / Plans ─────────────────────────────────────────────────────────
// Matches backend PlanFeatures JSON object
export interface PlanFeatures {
  aiAllergy: boolean;
  crmAutomation: boolean;
  liveTracking: boolean;
  customDomain: boolean;
  apiAccess: boolean;
}

// Matches backend SubscriptionPlanDto
export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  maxStaff: number;
  maxProducts: number;
  maxBookingsMo: number;
  isActive: boolean;
  features?: PlanFeatures;
}

export interface CreatePlanRequest {
  name: string;
  priceMonthly: number;
  maxStaff: number;
  maxProducts: number;
  maxBookingsMo: number;
  features?: Partial<PlanFeatures>;
}

export interface UpdatePlanRequest {
  name?: string;
  priceMonthly?: number;
  maxStaff?: number;
  maxProducts?: number;
  maxBookingsMo?: number;
  isActive?: boolean;
  features?: Partial<PlanFeatures>;
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
// Matches backend PlatformInvoiceDto
export type InvoiceStatus = 'Paid' | 'Failed' | 'Overdue' | 'Processing' | 'Pending';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  planId?: string;
  planName?: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: string;
  paidAt?: string;
}

export interface InvoiceListParams extends PaginationParams {
  invoiceNumber?: string;
  status?: InvoiceStatus | '';
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
}

// ─── Support Tickets ──────────────────────────────────────────────────────────
// Backend stores plain lowercase strings — no enum
export type TicketStatus = 'open' | 'inprogress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

// Matches backend SupportTicketDto
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category?: string;
  createdAt: string;
  resolvedAt?: string;
  tenantId?: string;
  tenantName?: string;
  submittedBy?: string;
  submittedByName?: string;
  assignedTo?: string;
}

export interface TicketListParams extends PaginationParams {
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  category?: string;
  tenantId?: string;
}

// Only status can be updated (PATCH /status)
export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
// Matches backend CampaignType enum
export type CampaignType = 'VaccineReminder' | 'Birthday' | 'ChurnWinback' | 'CartAbandonment' | 'PostVisit' | 'Custom';
export type CampaignStatus = 'Active' | 'Draft' | 'Scheduled';
export type CampaignTrigger = 'manual' | 'scheduled';
export type CampaignChannel = 'email' | 'zalo' | 'sms';

export interface CampaignStats {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalErrors: number;
}

// Matches backend CampaignDto
export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  channel?: CampaignChannel;
  triggerType?: CampaignTrigger;
  templateContent?: string;
  segmentId?: string;
  status?: CampaignStatus;
  stats?: CampaignStats;
}

export interface CreateCampaignRequest {
  name: string;
  type: CampaignType;
  channel?: CampaignChannel;
  triggerType?: CampaignTrigger;
  templateContent?: string;
  segmentId?: string;
}

export interface CampaignListParams extends PaginationParams {
  name?: string;
  status?: CampaignStatus | '';
  type?: CampaignType | '';
}

// Matches backend CustomerSegmentDto
export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  customerCount: number;
  isAuto: boolean;
}

export interface CreateSegmentRequest {
  name: string;
  description?: string;
  isAuto?: boolean;
}

export interface SegmentListParams extends PaginationParams {
  name?: string;
}

// Matches backend CustomerProfileDto
export interface CrmCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalSpent: number;
  totalVisits: number;
  lastVisit?: string;
  tier: string;
  ltv: number;
  healthScore: number;
  churnRiskLevel?: string;
  crmNotes?: string;
}

export interface UpdateCustomerNotesRequest {
  notes: string;
}

export interface CustomerListParams extends PaginationParams {
  email?: string;
  displayName?: string;
}
