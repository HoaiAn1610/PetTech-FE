import type {
  Tenant, Invoice, SupportTicket, PaginatedResult,
  SubscriptionPlan, Campaign, CustomerSegment, CrmCustomer,
} from '@/types/admin';

// PagedResult wrapper helper
function paged<T>(items: T[]): PaginatedResult<T> {
  return { items, totalCount: items.length, pageNumber: 1, pageSize: 50, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
}

export const mockTenants: PaginatedResult<Tenant> = paged([
  { id: 't1', code: 'paws', name: 'Paws & Claws Clinic', ownerName: 'Dr. Smith', email: 'smith@paws.com', phone: '0901234567', status: 'Active', mrr: 249000, planId: 'plan-growth', createdAt: '2026-01-15T00:00:00Z', isDeleted: false },
  { id: 't2', code: 'clear', name: 'Clearview Vet Group', ownerName: 'Dr. Lee', email: 'lee@clearview.com', phone: '0912345678', status: 'Active', mrr: 399000, planId: 'plan-enterprise', createdAt: '2025-11-01T00:00:00Z', isDeleted: false },
]);

export const mockInvoices: PaginatedResult<Invoice> = paged([
  { id: 'inv-1', invoiceNumber: 'INV-2026-091', tenantId: 't1', tenantName: 'Paws & Claws Clinic', planId: 'plan-growth', planName: 'Cơ bản', amount: 249000, status: 'Failed', createdAt: '2026-03-01T00:00:00Z' },
  { id: 'inv-2', invoiceNumber: 'INV-2026-090', tenantId: 't2', tenantName: 'Clearview Vet Group', planId: 'plan-enterprise', planName: 'Chuyên nghiệp', amount: 399000, status: 'Paid', createdAt: '2026-03-01T00:00:00Z', paidAt: '2026-03-02T00:00:00Z' },
]);

export const mockTickets: PaginatedResult<SupportTicket> = paged([
  { id: '1042', ticketNumber: 'TK-1042', tenantId: 't1', tenantName: 'Vet Harmony Clinic', subject: 'Sự cố kết nối API', description: 'API không phản hồi', status: 'open', priority: 'high', createdAt: '2026-03-06T09:14:00Z' },
  { id: '1041', ticketNumber: 'TK-1041', tenantId: 't2', tenantName: 'Paws & Claws Clinic', subject: 'Lỗi cổng thanh toán', description: 'Lỗi khi thanh toán', status: 'inprogress', priority: 'high', createdAt: '2026-03-05T16:30:00Z' },
  { id: '1038', ticketNumber: 'TK-1038', tenantId: 't3', tenantName: 'PetHealth Partners', subject: 'Báo cáo thời gian lỗi', description: 'Báo cáo thời gian', status: 'inprogress', priority: 'low', createdAt: '2026-03-03T15:45:00Z' },
]);

export const mockPlans: PaginatedResult<SubscriptionPlan> = paged([
  { id: 'plan-starter', name: 'Dùng thử', priceMonthly: 0, maxStaff: 3, maxProducts: 50, maxBookingsMo: 200, isActive: true, features: { aiAllergy: false, crmAutomation: false, liveTracking: false, customDomain: false, apiAccess: false } },
  { id: 'plan-growth', name: 'Cơ bản', priceMonthly: 249000, maxStaff: 10, maxProducts: 500, maxBookingsMo: 2000, isActive: true, features: { aiAllergy: false, crmAutomation: false, liveTracking: true, customDomain: false, apiAccess: false } },
  { id: 'plan-enterprise', name: 'Chuyên nghiệp', priceMonthly: 399000, maxStaff: 999, maxProducts: 9999, maxBookingsMo: 99999, isActive: true, features: { aiAllergy: true, crmAutomation: true, liveTracking: true, customDomain: true, apiAccess: true } },
]);

export const mockCampaigns: PaginatedResult<Campaign> = paged([
  { id: 'c1', name: 'Thông báo tính năng Q1', type: 'Custom', channel: 'email', status: 'Active', triggerType: 'manual', stats: { totalSent: 142, totalDelivered: 138, totalRead: 89, totalErrors: 4 } },
  { id: 'c2', name: 'Nhắc nhở gia hạn gói', type: 'ChurnWinback', channel: 'email', status: 'Scheduled', triggerType: 'scheduled', stats: { totalSent: 0, totalDelivered: 0, totalRead: 0, totalErrors: 0 } },
]);

export const mockSegments: PaginatedResult<CustomerSegment> = paged([
  { id: 's1', name: 'Sắp hết hạn (30 ngày)', customerCount: 14, isAuto: true },
  { id: 's2', name: 'Gói Trial', customerCount: 12, isAuto: false },
  { id: 's3', name: 'Không hoạt động 7 ngày', customerCount: 8, isAuto: true },
]);

export const mockCrmCustomers: PaginatedResult<CrmCustomer> = paged([
  { id: 'cu1', fullName: 'Nguyễn Văn An', email: 'an@example.com', phone: '0901234567', totalSpent: 4500000, totalVisits: 12, tier: 'Gold', ltv: 9000000, healthScore: 85, churnRiskLevel: 'Low' },
]);
