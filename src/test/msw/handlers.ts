import { http, HttpResponse } from 'msw';
import {
  mockTenants, mockInvoices, mockTickets, mockPlans,
  mockCampaigns, mockSegments, mockCrmCustomers,
} from './fixtures';

const BASE = 'https://api.pettech.io/v1';

export const handlers = [
  // ── Tenants ──────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/tenants`, () => HttpResponse.json({ data: mockTenants })),
  http.post(`${BASE}/api/admin/tenants`, () => HttpResponse.json({ data: mockTenants.items[0] }, { status: 201 })),
  http.get(`${BASE}/api/admin/tenants/:id`, ({ params }) => {
    const tenant = mockTenants.items.find(t => t.id === params.id) ?? mockTenants.items[0];
    return HttpResponse.json({ data: tenant });
  }),
  http.put(`${BASE}/api/admin/tenants/:id`, ({ params }) => {
    const tenant = mockTenants.items.find(t => t.id === params.id) ?? mockTenants.items[0];
    return HttpResponse.json({ data: tenant });
  }),
  http.post(`${BASE}/api/admin/tenants/:id/suspend`, () => HttpResponse.json({ data: null })),
  http.post(`${BASE}/api/admin/tenants/:id/reactivate`, () => HttpResponse.json({ data: null })),
  http.delete(`${BASE}/api/admin/tenants/:id`, () => new HttpResponse(null, { status: 204 })),

  // ── Billing / Plans ───────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/billing/plans`, () => HttpResponse.json({ data: mockPlans })),
  http.post(`${BASE}/api/admin/billing/plans`, () => HttpResponse.json({ data: mockPlans.items[0] }, { status: 201 })),
  http.get(`${BASE}/api/admin/billing/plans/:id`, ({ params }) => {
    const plan = mockPlans.items.find(p => p.id === params.id) ?? mockPlans.items[0];
    return HttpResponse.json({ data: plan });
  }),
  http.put(`${BASE}/api/admin/billing/plans/:id`, ({ params }) => {
    const plan = mockPlans.items.find(p => p.id === params.id) ?? mockPlans.items[0];
    return HttpResponse.json({ data: plan });
  }),
  http.delete(`${BASE}/api/admin/billing/plans/:id`, () => new HttpResponse(null, { status: 204 })),
  http.patch(`${BASE}/api/admin/billing/plans/:id/status`, () => HttpResponse.json({ data: null })),

  // ── Billing / Invoices ────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/billing/invoices`, () => HttpResponse.json({ data: mockInvoices })),
  http.get(`${BASE}/api/admin/billing/invoices/:id`, ({ params }) => {
    const invoice = mockInvoices.items.find(i => i.id === params.id) ?? mockInvoices.items[0];
    return HttpResponse.json({ data: invoice });
  }),
  http.post(`${BASE}/api/admin/billing/invoices/:id/retry`, () => HttpResponse.json({ data: null })),

  // ── Support Tickets ───────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/support-tickets`, ({ request }) => {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('searchTerm')?.toLowerCase();
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    let items = mockTickets.items;
    if (searchTerm) items = items.filter(t => t.subject.toLowerCase().includes(searchTerm) || (t.tenantName ?? '').toLowerCase().includes(searchTerm));
    if (status) items = items.filter(t => t.status === status);
    if (priority) items = items.filter(t => t.priority === priority);
    return HttpResponse.json({ data: { ...mockTickets, items, totalCount: items.length } });
  }),
  http.get(`${BASE}/api/admin/support-tickets/:id`, ({ params }) => {
    const ticket = mockTickets.items.find(t => t.id === params.id) ?? mockTickets.items[0];
    return HttpResponse.json({ data: ticket });
  }),
  http.patch(`${BASE}/api/admin/support-tickets/:id/status`, () => HttpResponse.json({ data: null })),

  // ── CRM / Campaigns ───────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/crm/campaigns`, () => HttpResponse.json({ data: mockCampaigns })),
  http.post(`${BASE}/api/admin/crm/campaigns`, () => HttpResponse.json({ data: mockCampaigns.items[0] }, { status: 201 })),
  http.delete(`${BASE}/api/admin/crm/campaigns/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/api/admin/crm/campaigns/:id/execute`, () => HttpResponse.json({ data: null })),

  // ── CRM / Segments ────────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/crm/segments`, () => HttpResponse.json({ data: mockSegments })),
  http.post(`${BASE}/api/admin/crm/segments`, () => HttpResponse.json({ data: mockSegments.items[0] }, { status: 201 })),
  http.delete(`${BASE}/api/admin/crm/segments/:id`, () => new HttpResponse(null, { status: 204 })),

  // ── CRM / Customers ───────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/crm/customers`, () => HttpResponse.json({ data: mockCrmCustomers })),
  http.put(`${BASE}/api/admin/crm/customers/:id/notes`, () => HttpResponse.json({ data: null })),
];
