// ─── Pagination ────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// ─── Tenants ────────────────────────────────────────────────────────────────
export type TenantPlan = 'Starter' | 'Growth' | 'Enterprise' | 'Trial';
export type TenantStatus = 'Active' | 'Trial' | 'Suspended' | 'Cancelled';

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  plan: TenantPlan;
  status: TenantStatus;
  mrr: number;
  staffCount: number;
  totalBookings: number;
  lastLoginAt: string;
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  plan: TenantPlan;
  defaultAdminPassword: string;
}

export interface UpdateTenantRequest {
  name?: string;
  plan?: TenantPlan;
}

export interface TenantListParams extends PaginationParams {
  plan?: TenantPlan | '';
  status?: TenantStatus | '';
}

// ─── Billing ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'Paid' | 'Failed' | 'Overdue' | 'Processing';

export interface BillingOverview {
  mrr: number;
  arr: number;
  churnRate: number;
  paymentFailures: number;
  totalInvoices: number;
  arpu: number;
  mrrTrend: { month: string; mrr: number; newRevenue: number; churn: number }[];
  planDistribution: { plan: string; mrr: number; count: number }[];
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  plan: TenantPlan;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
}

export interface InvoiceListParams extends PaginationParams {
  status?: InvoiceStatus | '';
}

// ─── Support Tickets ──────────────────────────────────────────────────────────
export type TicketStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketMessageRole = 'Tenant' | 'Admin' | 'System';

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: TicketMessageRole;
  content: string;
  sentAt: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeName?: string;
  messageCount: number;
  openedAt: string;
  messages?: TicketMessage[];
}

export interface TicketListParams extends PaginationParams {
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
}

export interface ReplyTicketRequest {
  content: string;
}

// ─── Admin Users ──────────────────────────────────────────────────────────────
export type AdminUserRole = 'SuperAdmin' | 'PlatformStaff';
export type AdminUserStatus = 'Active' | 'Inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  ticketsHandled: number;
  lastLoginAt: string;
  createdAt: string;
}

export interface InviteAdminRequest {
  name: string;
  email: string;
  role: AdminUserRole;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface PlatformAnalytics {
  dau: number;
  mau: number;
  avgSessionMinutes: number;
  featureAdoptionRate: number;
  tenantHealthScore: number;
  dauTrend: { date: string; value: number }[];
  sessionTrend: { month: string; value: number }[];
  accessBreakdown: { platform: string; percentage: number }[];
  featureUsage: { feature: string; sessions: number; adoption: number }[];
  topTenants: { id: string; name: string; logins: number; bookings: number; health: number }[];
}

// ─── System Settings ──────────────────────────────────────────────────────────
export interface SystemSettings {
  maintenanceMode: boolean;
  signupsEnabled: boolean;
  trialEnabled: boolean;
  emailVerificationRequired: boolean;
  twoFactorEnforced: boolean;
  rateLimitingEnabled: boolean;
  autoBackupEnabled: boolean;
  debugLogsEnabled: boolean;
  webhooksEnabled: boolean;
  appVersion?: string;
  dbVersion?: string;
  nodeVersion?: string;
  uptime?: string;
}

// ─── Subscription Plans ───────────────────────────────────────────────────────
export interface SubscriptionPlan {
  id: string;
  name: TenantPlan;
  price: number;
  features: string[];
  maxStaff: number;
  tenantCount: number;
  mrr: number;
}

export interface UpdatePlanRequest {
  price?: number;
  features?: string[];
  maxStaff?: number;
}

// ─── Activity Logs ────────────────────────────────────────────────────────────
export type LogEventType = 'Auth' | 'Tenant' | 'Billing' | 'Plan' | 'Support' | 'System';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: LogEventType;
  actor: string;
  action: string;
  ip?: string;
  tenantId?: string;
}

export interface LogListParams extends PaginationParams {
  type?: LogEventType | '';
  timeRange?: '24h' | '7d' | '30d';
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
export type CampaignStatus = 'Active' | 'Draft' | 'Scheduled';
export type CampaignTrigger = 'auto' | 'manual' | 'scheduled';

export interface Campaign {
  id: string;
  name: string;
  type: 'Email';
  status: CampaignStatus;
  recipientCount: number;
  triggerType: CampaignTrigger;
  scheduledAt?: string;
}

export interface CreateCampaignRequest {
  name: string;
  type: 'Email';
  triggerType: CampaignTrigger;
  scheduledAt?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  tenantCount: number;
  totalTenants: number;
}

// ─── Overview ─────────────────────────────────────────────────────────────────
export interface OverviewKPIs {
  mrr: number;
  mrrGrowth: number;
  activeTenants: number;
  activeTenantsGrowth: number;
  arpu: number;
  arpuGrowth: number;
  churnRate: number;
  openTickets: number;
  mrrTrend?: { month: string; mrr: number }[];
}
