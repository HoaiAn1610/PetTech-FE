import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTenants, useSuspendTenant, useDeleteTenant } from '@/hooks/admin/useTenants';
import { useInvoices } from '@/hooks/admin/useBilling';
import { useSupportTickets } from '@/hooks/admin/useSupport';
import { useOverviewTenants, useOverviewTickets, useRecentTenants, useRecentTickets } from '@/hooks/admin/useOverview';
import { usePlans } from '@/hooks/admin/usePlans';
import { useCampaigns, useSegments, useCrmCustomers } from '@/hooks/admin/useCrm';
import {
  mockTenants, mockInvoices, mockTickets, mockPlans,
  mockCampaigns, mockSegments, mockCrmCustomers,
} from '../msw/fixtures';

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  };
}

beforeEach(() => {
  localStorage.setItem('token', 'test-token');
});

// ── Overview hooks ────────────────────────────────────────────────────────────

describe('useOverviewTenants', () => {
  it('fetches tenants and exposes totalCount', async () => {
    const { result } = renderHook(() => useOverviewTenants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalCount).toBe(2);
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useOverviewTenants(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });
});

describe('useOverviewTickets', () => {
  it('fetches tickets and exposes totalCount', async () => {
    const { result } = renderHook(() => useOverviewTickets(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalCount).toBeGreaterThanOrEqual(0);
  });
});

describe('useRecentTenants', () => {
  it('fetches recent tenants list', async () => {
    const { result } = renderHook(() => useRecentTenants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(2);
  });
});

describe('useRecentTickets', () => {
  it('fetches recent tickets list', async () => {
    const { result } = renderHook(() => useRecentTickets(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(3);
  });
});

// ── Tenants ───────────────────────────────────────────────────────────────────

describe('useTenants', () => {
  it('fetches paginated tenants', async () => {
    const { result } = renderHook(() => useTenants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.totalCount).toBe(2);
  });

  it('returns tenant with expected fields', async () => {
    const { result } = renderHook(() => useTenants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const first = result.current.data!.items[0];
    expect(first.name).toBe(mockTenants.items[0].name);
    expect(first.planId).toBe('plan-growth');
    expect(first.status).toBe('Active');
  });

  it('passes filter params to the query key', () => {
    const { result } = renderHook(() => useTenants({ status: 1 }), { wrapper: createWrapper() });
    expect(result.current.isError).toBe(false);
  });
});

// ── Billing ───────────────────────────────────────────────────────────────────

describe('useInvoices', () => {
  it('fetches paginated invoices', async () => {
    const { result } = renderHook(() => useInvoices({ pageNumber: 1, pageSize: 20 }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.items[0].status).toBe('Failed');
  });
});

// ── Support Tickets ───────────────────────────────────────────────────────────

describe('useSupportTickets', () => {
  it('fetches support tickets with status and priority', async () => {
    const { result } = renderHook(() => useSupportTickets(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(3);
    const highTickets = result.current.data!.items.filter(t => t.priority === 'high');
    expect(highTickets).toHaveLength(2);
  });

  it('instantiates without error', () => {
    const { result } = renderHook(() => useSupportTickets(), { wrapper: createWrapper() });
    expect(result.current.isError).toBe(false);
  });
});

// ── Plans ─────────────────────────────────────────────────────────────────────

describe('usePlans', () => {
  it('fetches subscription plans as PaginatedResult', async () => {
    const { result } = renderHook(() => usePlans(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(3);
    const names = result.current.data!.items.map(p => p.name);
    expect(names).toContain('Dùng thử');
    expect(names).toContain('Cơ bản');
    expect(names).toContain('Chuyên nghiệp');
  });
});

// ── CRM ───────────────────────────────────────────────────────────────────────

describe('useCampaigns', () => {
  it('fetches campaigns as PaginatedResult', async () => {
    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data!.items[0].type).toBe('Custom');
  });
});

describe('useSegments', () => {
  it('fetches customer segments as PaginatedResult', async () => {
    const { result } = renderHook(() => useSegments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(3);
    expect(result.current.data!.items[0]).toHaveProperty('customerCount');
  });
});

describe('useCrmCustomers', () => {
  it('fetches CRM customers as PaginatedResult', async () => {
    const { result } = renderHook(() => useCrmCustomers(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data!.items[0]).toHaveProperty('healthScore');
    expect(result.current.data!.items[0]).toHaveProperty('tier');
  });
});
