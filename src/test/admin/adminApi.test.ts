import { describe, it, expect, beforeEach } from 'vitest';
import { adminApi } from '@/api/adminApi';
import {
  mockTenants, mockInvoices, mockTickets, mockPlans,
  mockCampaigns, mockSegments, mockCrmCustomers,
} from '../msw/fixtures';

describe('adminApi', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  // ── Tenants ─────────────────────────────────────────────────────────────

  describe('getTenants', () => {
    it('returns PaginatedResult with items array', async () => {
      const result = await adminApi.getTenants({ pageNumber: 1, pageSize: 50 });
      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.items[0].name).toBe(mockTenants.items[0].name);
    });

    it('returns tenant with required fields', async () => {
      const result = await adminApi.getTenants();
      const tenant = result.items[0];
      expect(tenant).toHaveProperty('id');
      expect(tenant).toHaveProperty('code');
      expect(tenant).toHaveProperty('status');
      expect(tenant).toHaveProperty('ownerName');
      expect(tenant).toHaveProperty('mrr');
    });
  });

  // ── Billing / Plans ──────────────────────────────────────────────────────

  describe('getPlans', () => {
    it('returns PaginatedResult with plan items', async () => {
      const result = await adminApi.getPlans();
      expect(result.items).toHaveLength(3);
      expect(result.items[0].name).toBe('Dùng thử');
      expect(result.items[0]).toHaveProperty('priceMonthly');
      expect(result.items[0]).toHaveProperty('maxStaff');
      expect(result.items[0]).toHaveProperty('features');
    });
  });

  // ── Billing / Invoices ───────────────────────────────────────────────────

  describe('getInvoices', () => {
    it('returns paginated invoices', async () => {
      const result = await adminApi.getInvoices({ pageNumber: 1, pageSize: 20 });
      expect(result.items).toHaveLength(2);
      expect(result.items[0].status).toBe('Failed');
      expect(result.items[1].status).toBe('Paid');
    });

    it('returns invoice with required fields', async () => {
      const result = await adminApi.getInvoices();
      const inv = result.items[0];
      expect(inv).toHaveProperty('invoiceNumber');
      expect(inv).toHaveProperty('tenantName');
      expect(inv).toHaveProperty('amount');
      expect(inv).toHaveProperty('createdAt');
    });
  });

  // ── Support Tickets ──────────────────────────────────────────────────────

  describe('getSupportTickets', () => {
    it('returns paginated support tickets', async () => {
      const result = await adminApi.getSupportTickets();
      expect(result.items).toHaveLength(3);
      expect(result.items[0].status).toBe('open');
      expect(result.items[0].priority).toBe('high');
    });

    it('returns ticket with required fields', async () => {
      const result = await adminApi.getSupportTickets();
      const ticket = result.items[0];
      expect(ticket).toHaveProperty('ticketNumber');
      expect(ticket).toHaveProperty('subject');
      expect(ticket).toHaveProperty('createdAt');
    });
  });

  // ── CRM / Campaigns ──────────────────────────────────────────────────────

  describe('getCampaigns', () => {
    it('returns PaginatedResult of campaigns', async () => {
      const result = await adminApi.getCampaigns();
      expect(result.items).toHaveLength(2);
      expect(result.items[0].type).toBe('Custom');
      expect(result.items[1].status).toBe('Scheduled');
    });
  });

  // ── CRM / Segments ────────────────────────────────────────────────────────

  describe('getSegments', () => {
    it('returns PaginatedResult of customer segments', async () => {
      const result = await adminApi.getSegments();
      expect(result.items).toHaveLength(3);
      expect(result.items[0]).toHaveProperty('customerCount');
      expect(result.items[0]).toHaveProperty('isAuto');
    });
  });

  // ── CRM / Customers ───────────────────────────────────────────────────────

  describe('getCrmCustomers', () => {
    it('returns PaginatedResult of CRM customers', async () => {
      const result = await adminApi.getCrmCustomers();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toHaveProperty('fullName');
      expect(result.items[0]).toHaveProperty('tier');
      expect(result.items[0]).toHaveProperty('healthScore');
    });
  });

  // ── Mutations ─────────────────────────────────────────────────────────────

  describe('mutations', () => {
    it('suspendTenant resolves without error', async () => {
      await expect(adminApi.suspendTenant('t1')).resolves.not.toThrow();
    });

    it('reactivateTenant resolves without error', async () => {
      await expect(adminApi.reactivateTenant('t1')).resolves.not.toThrow();
    });

    it('retryPayment resolves without error', async () => {
      await expect(adminApi.retryPayment('inv-1')).resolves.not.toThrow();
    });

    it('updatePlan returns updated plan', async () => {
      const result = await adminApi.updatePlan('plan-starter', { priceMonthly: 59 });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('priceMonthly');
    });

    it('createCampaign returns new campaign', async () => {
      const result = await adminApi.createCampaign({ name: 'Test', type: 'Custom', triggerType: 'manual' });
      expect(result).toHaveProperty('id');
      expect(result.type).toBe('Custom');
    });

    it('updateTicketStatus resolves without error', async () => {
      await expect(adminApi.updateTicketStatus('1042', { status: 'inprogress' })).resolves.not.toThrow();
    });
  });
});
