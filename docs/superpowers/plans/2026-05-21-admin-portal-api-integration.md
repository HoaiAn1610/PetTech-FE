# Admin Portal API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded mock data in 7 existing admin pages with real backend API calls, add 3 new admin pages (Plans, Logs, CRM), and upgrade UX to production quality (skeleton loading, toasts, error boundary, confirm dialogs).

**Architecture:** API Service Layer First — a single `adminApi.ts` exports all admin endpoints; 9 React Query hooks in `src/hooks/admin/` consume the API and provide data + mutations to pages; pages become thin presentational layers wired to hooks.

**Tech Stack:** React 18 + TypeScript + `@tanstack/react-query` v5 (to install) + `sonner` (already installed) + `@radix-ui/react-alert-dialog` (already installed) + MUI Skeleton (already installed) + Recharts (already installed) + Axios (already installed)

**Backend base URL:** Read from `VITE_API_URL` env var (see `.env` — `http://51.210.176.94:5001`)

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `src/types/admin.ts` | All TypeScript interfaces for admin domain (Tenant, Invoice, Ticket, etc.) |
| `src/api/adminApi.ts` | All admin HTTP calls — single source of truth |
| `src/hooks/admin/useTenants.ts` | React Query hooks for tenant CRUD |
| `src/hooks/admin/useBilling.ts` | Hooks for billing overview + invoices |
| `src/hooks/admin/useSupport.ts` | Hooks for support tickets + replies |
| `src/hooks/admin/useAnalytics.ts` | Hook for platform analytics |
| `src/hooks/admin/useAdminUsers.ts` | Hooks for admin user management |
| `src/hooks/admin/useSystem.ts` | Hooks for system settings |
| `src/hooks/admin/usePlans.ts` | Hooks for subscription plans |
| `src/hooks/admin/useLogs.ts` | Hook for activity logs |
| `src/hooks/admin/useCrm.ts` | Hooks for CRM campaigns + segments |
| `src/pages/admin/AdminPlansPage.tsx` | New page: subscription plan management |
| `src/pages/admin/AdminLogsPage.tsx` | New page: activity/audit logs |
| `src/pages/admin/AdminCrmPage.tsx` | New page: CRM campaigns & segments |
| `src/components/admin/AdminErrorBoundary.tsx` | React error boundary for admin pages |

### Modified files
| File | Change |
|------|--------|
| `src/App.tsx` | Wrap with `QueryClientProvider` + add `<Toaster />` |
| `src/components/admin/AdminWidgets.tsx` | Add `SkeletonCard`, `ConfirmDialog` exports |
| `src/components/admin/AdminSidebar.tsx` | Add 3 new nav items (Plans, Logs, CRM) |
| `src/routes.tsx` | Register 3 new admin routes |
| `src/pages/admin/AdminTenantsPage.tsx` | Replace `TENANTS` const with `useTenants` hook |
| `src/pages/admin/AdminBillingPage.tsx` | Replace mock data with `useBilling` hook |
| `src/pages/admin/AdminSupportPage.tsx` | Replace mock data with `useSupport` hook |
| `src/pages/admin/AdminAnalyticsPage.tsx` | Replace mock data with `useAnalytics` hook |
| `src/pages/admin/AdminUsersPage.tsx` | Replace mock data with `useAdminUsers` hook |
| `src/pages/admin/AdminSystemPage.tsx` | Replace mock data with `useSystem` hook |
| `src/pages/admin/AdminOverviewPage.tsx` | Replace mock data with hooks |

---

## Task 1: Install React Query + Setup QueryClientProvider

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Install @tanstack/react-query**

```bash
cd d:/FPT/Ky-8/EXE201/PetTech-FE
pnpm add @tanstack/react-query
```

Expected output: packages installed successfully.

- [ ] **Step 2: Update App.tsx to wrap with QueryClientProvider and add Toaster**

Replace the entire content of `src/App.tsx`:

```tsx
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import "@/styles/fonts.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 3: Verify app still loads**

Run `pnpm dev` and open `http://localhost:5173`. The app should load without console errors. The Toaster is invisible until used — that's expected.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx package.json pnpm-lock.yaml
git commit -m "feat: install react-query v5 and add QueryClientProvider + Toaster"
```

---

## Task 2: Create TypeScript Types for Admin Domain

**Files:**
- Create: `src/types/admin.ts`

- [ ] **Step 1: Create the types file**

Create `src/types/admin.ts` with this content:

```typescript
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
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm build 2>&1 | head -20
```

Expected: no TypeScript errors in `src/types/admin.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/types/admin.ts
git commit -m "feat: add admin domain TypeScript types"
```

---

## Task 3: Create adminApi.ts

**Files:**
- Create: `src/api/adminApi.ts`

- [ ] **Step 1: Create the API service file**

Create `src/api/adminApi.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm build 2>&1 | head -20
```

Expected: no errors. If `Cannot find module '@/types/admin'` appears, confirm `tsconfig.json` has `"@/*": ["./src/*"]` path alias.

- [ ] **Step 3: Commit**

```bash
git add src/api/adminApi.ts
git commit -m "feat: add adminApi.ts with all admin endpoints"
```

---

## Task 4: Add SkeletonCard and ConfirmDialog to AdminWidgets.tsx

**Files:**
- Modify: `src/components/admin/AdminWidgets.tsx`

- [ ] **Step 1: Add imports at the top of AdminWidgets.tsx**

Open `src/components/admin/AdminWidgets.tsx`. At the very top, after the existing imports, add:

```tsx
import { Skeleton } from "@mui/material";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
```

- [ ] **Step 2: Add SkeletonCard component at the bottom of the file (before the last closing brace or after all existing exports)**

```tsx
// ─── SkeletonCard ──────────────────────────────────────────────────────────
interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div className={className} style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 12, padding: 20,
    }}>
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      {lines > 2 && <Skeleton variant="text" width="30%" height={16} />}
    </div>
  );
}

// ─── SkeletonTable ──────────────────────────────────────────────────────────
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={44} sx={{ borderRadius: 1 }} />
      ))}
    </div>
  );
}

// ─── ConfirmDialog ──────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = 'Xác nhận', cancelLabel = 'Hủy',
  destructive = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)', zIndex: 500,
        }} />
        <AlertDialog.Content style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff', borderRadius: 16,
          padding: '28px 28px 24px',
          maxWidth: 440, width: '90vw',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          zIndex: 501,
          fontFamily: 'Inter, sans-serif',
        }}>
          <AlertDialog.Title style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 24 }}>
            {description}
          </AlertDialog.Description>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <AlertDialog.Cancel asChild>
              <button onClick={onCancel} style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                background: '#fff', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500, color: '#374151',
              }}>
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={onConfirm} style={{
                padding: '8px 18px', borderRadius: 8, border: 'none',
                background: destructive ? '#dc2626' : '#6366f1',
                color: '#fff', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600,
              }}>
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm build 2>&1 | head -20
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminWidgets.tsx
git commit -m "feat: add SkeletonCard, SkeletonTable, ConfirmDialog to AdminWidgets"
```

---

## Task 5: Create AdminErrorBoundary

**Files:**
- Create: `src/components/admin/AdminErrorBoundary.tsx`

- [ ] **Step 1: Create the error boundary component**

```tsx
import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AdminErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 400,
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            background: '#fff', border: '1px solid #fecaca',
            borderRadius: 16, padding: 40, maxWidth: 480,
            textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <AlertTriangle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 16 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              Đã xảy ra lỗi
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 24 }}>
              {this.state.message || 'Lỗi không xác định. Thử tải lại trang.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', borderRadius: 8,
                background: '#6366f1', color: '#fff',
                border: 'none', fontSize: '0.875rem',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              Thử lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminErrorBoundary.tsx
git commit -m "feat: add AdminErrorBoundary component"
```

---

## Task 6: Create useTenants hook + Update AdminTenantsPage

**Files:**
- Create: `src/hooks/admin/useTenants.ts`
- Modify: `src/pages/admin/AdminTenantsPage.tsx`

- [ ] **Step 1: Create useTenants hook**

Create `src/hooks/admin/useTenants.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { TenantListParams, CreateTenantRequest, UpdateTenantRequest } from "@/types/admin";

const KEYS = {
  list: (p?: TenantListParams) => ['admin', 'tenants', p] as const,
  detail: (id: string) => ['admin', 'tenants', id] as const,
};

export function useTenants(params?: TenantListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => adminApi.getTenants(params),
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => adminApi.getTenant(id),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantRequest) => adminApi.createTenant(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      toast.success('Tenant đã được tạo thành công');
    },
    onError: () => toast.error('Tạo tenant thất bại'),
  });
}

export function useUpdateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantRequest }) =>
      adminApi.updateTenant(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      toast.success('Đã cập nhật tenant');
    },
    onError: () => toast.error('Cập nhật tenant thất bại'),
  });
}

export function useSuspendTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.suspendTenant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      toast.success('Tenant đã bị tạm khóa');
    },
    onError: () => toast.error('Không thể tạm khóa tenant'),
  });
}

export function useReactivateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.reactivateTenant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      toast.success('Tenant đã được kích hoạt lại');
    },
    onError: () => toast.error('Không thể kích hoạt tenant'),
  });
}

export function useDeleteTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteTenant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      toast.success('Đã xóa tenant');
    },
    onError: () => toast.error('Xóa tenant thất bại'),
  });
}
```

- [ ] **Step 2: Update AdminTenantsPage.tsx — replace mock data + wire hooks**

In `src/pages/admin/AdminTenantsPage.tsx`:

**Remove** the entire `TENANTS` constant array (lines starting with `const TENANTS = [`).

**Add** these imports at the top of the file (after existing imports):

```tsx
import { useTenants, useSuspendTenant, useReactivateTenant, useDeleteTenant } from "@/hooks/admin/useTenants";
import { SkeletonTable, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import type { Tenant, TenantPlan, TenantStatus } from "@/types/admin";
```

**Replace** the `export default function AdminTenantsPage()` function signature and initial state section. Find where `const [searchTerm, setSearchTerm]` is declared and add state for pagination and confirm dialog before it:

```tsx
const [page, setPage] = useState(1);
const [confirmDialog, setConfirmDialog] = useState<{
  open: boolean; type: 'suspend' | 'reactivate' | 'delete'; tenantId: string; tenantName: string;
}>({ open: false, type: 'suspend', tenantId: '', tenantName: '' });

const { data: tenantsData, isLoading } = useTenants({
  page,
  pageSize: 20,
  search: searchTerm || undefined,
  plan: filterPlan as TenantPlan || undefined,
  status: filterStatus as TenantStatus || undefined,
});

const tenants = tenantsData?.items ?? [];
const totalTenants = tenantsData?.total ?? 0;

const suspendMutation = useSuspendTenant();
const reactivateMutation = useReactivateTenant();
const deleteMutation = useDeleteTenant();
```

**Replace** every reference to the hardcoded `TENANTS` array with the `tenants` variable from the hook.

**Replace** the KPI `stat cards` section — find where `TENANTS.length`, `TENANTS.filter(...)` etc. are used and replace with:

```tsx
const activeCount = tenants.filter(t => t.status === 'Active').length;
const trialCount  = tenants.filter(t => t.status === 'Trial').length;
const suspendedCount = tenants.filter(t => t.status === 'Suspended').length;
```

**Wrap** the return JSX in `<AdminErrorBoundary>`.

**Add** loading state inside the table section — where `{filteredTenants.map(...)}` or similar is rendered, add before it:

```tsx
{isLoading && <SkeletonTable rows={8} />}
```

**Replace** inline suspend/reactivate/delete button `onClick` handlers. Find the action buttons in the modal or table rows and replace with:

```tsx
// Suspend button onClick:
onClick={() => setConfirmDialog({ open: true, type: 'suspend', tenantId: tenant.id, tenantName: tenant.name })}

// Reactivate button onClick:
onClick={() => setConfirmDialog({ open: true, type: 'reactivate', tenantId: tenant.id, tenantName: tenant.name })}

// Delete button onClick:
onClick={() => setConfirmDialog({ open: true, type: 'delete', tenantId: tenant.id, tenantName: tenant.name })}
```

**Add** the ConfirmDialog at the bottom of the return JSX (before `</AdminPageShell>`):

```tsx
<ConfirmDialog
  open={confirmDialog.open}
  title={
    confirmDialog.type === 'suspend' ? `Tạm khóa "${confirmDialog.tenantName}"?` :
    confirmDialog.type === 'reactivate' ? `Kích hoạt lại "${confirmDialog.tenantName}"?` :
    `Xóa vĩnh viễn "${confirmDialog.tenantName}"?`
  }
  description={
    confirmDialog.type === 'suspend'
      ? 'Tenant sẽ không thể truy cập hệ thống cho đến khi được kích hoạt lại.'
      : confirmDialog.type === 'reactivate'
      ? 'Tenant sẽ có thể đăng nhập và sử dụng dịch vụ bình thường.'
      : 'Hành động này không thể hoàn tác. Toàn bộ dữ liệu sẽ bị xóa.'
  }
  confirmLabel={confirmDialog.type === 'delete' ? 'Xóa vĩnh viễn' : 'Xác nhận'}
  destructive={confirmDialog.type === 'delete'}
  onConfirm={() => {
    const id = confirmDialog.tenantId;
    if (confirmDialog.type === 'suspend') suspendMutation.mutate(id);
    else if (confirmDialog.type === 'reactivate') reactivateMutation.mutate(id);
    else deleteMutation.mutate(id);
    setConfirmDialog(prev => ({ ...prev, open: false }));
  }}
  onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
/>
```

**Add** a helper at the top of the component (outside JSX) to map English status to Vietnamese display:

```tsx
const STATUS_LABEL: Record<string, string> = {
  Active: 'Hoạt động', Trial: 'Dùng thử',
  Suspended: 'Tạm khóa', Cancelled: 'Đã hủy',
};
```

Use `STATUS_LABEL[tenant.status] ?? tenant.status` wherever the tenant status is displayed.

- [ ] **Step 3: Verify in browser**

Run `pnpm dev`. Navigate to `http://localhost:5173/admin/login`, log in as SuperAdmin. Go to `/admin/tenants`. You should see:
- Skeleton rows while loading
- Real data from the API (or an error toast if the endpoint returns an error — both are acceptable)

- [ ] **Step 4: Commit**

```bash
git add src/hooks/admin/useTenants.ts src/pages/admin/AdminTenantsPage.tsx
git commit -m "feat: wire AdminTenantsPage to real API via useTenants hooks"
```

---

## Task 7: Create useBilling hook + Update AdminBillingPage

**Files:**
- Create: `src/hooks/admin/useBilling.ts`
- Modify: `src/pages/admin/AdminBillingPage.tsx`

- [ ] **Step 1: Create useBilling.ts**

Create `src/hooks/admin/useBilling.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { InvoiceListParams } from "@/types/admin";

export function useBillingOverview() {
  return useQuery({
    queryKey: ['admin', 'billing', 'overview'],
    queryFn: () => adminApi.getBillingOverview(),
  });
}

export function useInvoices(params?: InvoiceListParams) {
  return useQuery({
    queryKey: ['admin', 'billing', 'invoices', params],
    queryFn: () => adminApi.getInvoices(params),
  });
}

export function useRetryPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => adminApi.retryPayment(invoiceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'billing', 'invoices'] });
      toast.success('Đã gửi lại yêu cầu thanh toán');
    },
    onError: () => toast.error('Gửi lại thanh toán thất bại'),
  });
}
```

- [ ] **Step 2: Update AdminBillingPage.tsx**

In `src/pages/admin/AdminBillingPage.tsx`:

**Add** imports:

```tsx
import { useBillingOverview, useInvoices, useRetryPayment } from "@/hooks/admin/useBilling";
import { SkeletonCard, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
```

**Remove** all hardcoded constant arrays (invoice mock data, MRR trend arrays, plan distribution arrays).

**Add** hooks at the top of the component function:

```tsx
const { data: billing, isLoading: billingLoading } = useBillingOverview();
const { data: invoicesData, isLoading: invoicesLoading } = useInvoices({ page: 1, pageSize: 20 });
const retryMutation = useRetryPayment();

const invoices = invoicesData?.items ?? [];
const mrrTrend = billing?.mrrTrend ?? [];
const planDistribution = billing?.planDistribution ?? [];
```

**Replace** KPI card values with real data:

```tsx
// mrr card value:    billing?.mrr ?? 0
// arr card value:    billing?.arr ?? 0
// churnRate value:   billing?.churnRate ?? 0
// paymentFailures:   billing?.paymentFailures ?? 0
// totalInvoices:     billing?.totalInvoices ?? 0
// arpu:              billing?.arpu ?? 0
```

**Show skeleton** while loading KPIs:

```tsx
{billingLoading && (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
)}
```

**Replace** invoice table rows with `invoices.map(...)` and pass real data fields. The invoice status label mapping:

```tsx
const INVOICE_STATUS_LABEL: Record<string, string> = {
  Paid: 'Đã thanh toán', Failed: 'Thất bại',
  Overdue: 'Quá hạn', Processing: 'Đang xử lý',
};
```

**Wire** retry button `onClick`:

```tsx
onClick={() => retryMutation.mutate(invoice.id)}
```

**Wrap** component JSX in `<AdminErrorBoundary>`.

**Implement** CSV export using real invoice data:

```tsx
const handleExportCSV = () => {
  const header = 'ID,Tenant,Plan,Amount,Status,Date\n';
  const rows = invoices.map(inv =>
    `${inv.id},${inv.tenantName},${inv.plan},${inv.amount},${inv.status},${inv.issuedAt}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoices-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
```

- [ ] **Step 3: Verify in browser**

Navigate to `/admin/billing`. Expect KPI cards with real numbers and invoice table with real data (or error toasts).

- [ ] **Step 4: Commit**

```bash
git add src/hooks/admin/useBilling.ts src/pages/admin/AdminBillingPage.tsx
git commit -m "feat: wire AdminBillingPage to real API via useBilling hooks"
```

---

## Task 8: Create useSupport hook + Update AdminSupportPage

**Files:**
- Create: `src/hooks/admin/useSupport.ts`
- Modify: `src/pages/admin/AdminSupportPage.tsx`

- [ ] **Step 1: Create useSupport.ts**

Create `src/hooks/admin/useSupport.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { TicketListParams, UpdateTicketRequest, ReplyTicketRequest } from "@/types/admin";

export function useSupportTickets(params?: TicketListParams) {
  return useQuery({
    queryKey: ['admin', 'support', 'tickets', params],
    queryFn: () => adminApi.getSupportTickets(params),
    refetchInterval: 30_000,
  });
}

export function useTicketDetail(id: string) {
  return useQuery({
    queryKey: ['admin', 'support', 'tickets', id],
    queryFn: () => adminApi.getTicket(id),
    enabled: !!id,
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
      adminApi.updateTicket(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'tickets', id] });
      toast.success('Cập nhật ticket thành công');
    },
    onError: () => toast.error('Cập nhật ticket thất bại'),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReplyTicketRequest }) =>
      adminApi.replyTicket(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'tickets', id] });
      toast.success('Đã gửi phản hồi');
    },
    onError: () => toast.error('Gửi phản hồi thất bại'),
  });
}
```

- [ ] **Step 2: Update AdminSupportPage.tsx**

In `src/pages/admin/AdminSupportPage.tsx`:

**Add** imports:

```tsx
import { useSupportTickets, useTicketDetail, useUpdateTicket, useReplyTicket } from "@/hooks/admin/useSupport";
import { SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import type { TicketStatus, TicketPriority } from "@/types/admin";
```

**Remove** all hardcoded ticket mock arrays.

**Add** hooks in component body:

```tsx
const [filterStatus, setFilterStatus] = useState<TicketStatus | ''>('');
const [filterPriority, setFilterPriority] = useState<TicketPriority | ''>('');
const [searchTerm, setSearchTerm] = useState('');

const { data: ticketsData, isLoading } = useSupportTickets({
  search: searchTerm || undefined,
  status: filterStatus || undefined,
  priority: filterPriority || undefined,
  page: 1, pageSize: 50,
});
const tickets = ticketsData?.items ?? [];

const updateTicket = useUpdateTicket();
const replyTicket = useReplyTicket();
const [replyText, setReplyText] = useState('');
```

**Replace** ticket list render with `tickets.map(...)`.

**Show** skeleton while loading: `{isLoading && <SkeletonTable rows={6} />}`

**Wire** reply send button:

```tsx
const handleSendReply = () => {
  if (!selectedTicket || !replyText.trim()) return;
  replyTicket.mutate(
    { id: selectedTicket.id, data: { content: replyText } },
    { onSuccess: () => setReplyText('') }
  );
};
```

**Wire** status/priority/assign changes in the modal:

```tsx
const handleStatusChange = (status: TicketStatus) => {
  if (!selectedTicket) return;
  updateTicket.mutate({ id: selectedTicket.id, data: { status } });
};
```

**Add** status label mapping:

```tsx
const TICKET_STATUS_LABEL: Record<string, string> = {
  Open: 'Mở', InProgress: 'Đang xử lý', Resolved: 'Đã giải quyết', Closed: 'Đã đóng',
};
const PRIORITY_LABEL: Record<string, string> = {
  Low: 'Thấp', Medium: 'Trung bình', High: 'Cao',
};
```

**Wrap** in `<AdminErrorBoundary>`.

- [ ] **Step 3: Verify in browser**

Navigate to `/admin/support`. Expect ticket list with real data, auto-refresh every 30s.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/admin/useSupport.ts src/pages/admin/AdminSupportPage.tsx
git commit -m "feat: wire AdminSupportPage to real API via useSupport hooks"
```

---

## Task 9: Create useAnalytics hook + Update AdminAnalyticsPage

**Files:**
- Create: `src/hooks/admin/useAnalytics.ts`
- Modify: `src/pages/admin/AdminAnalyticsPage.tsx`

- [ ] **Step 1: Create useAnalytics.ts**

Create `src/hooks/admin/useAnalytics.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

export function usePlatformAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
}
```

- [ ] **Step 2: Update AdminAnalyticsPage.tsx**

In `src/pages/admin/AdminAnalyticsPage.tsx`:

**Add** imports:

```tsx
import { usePlatformAnalytics } from "@/hooks/admin/useAnalytics";
import { SkeletonCard, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
```

**Remove** all hardcoded analytics constant arrays (`DAU_DATA`, `SESSION_DATA`, `FEATURE_USAGE`, `TOP_TENANTS`, etc.).

**Add** hook in component body:

```tsx
const { data: analytics, isLoading } = usePlatformAnalytics();
```

**Replace** every hardcoded constant reference with optional chaining on `analytics`:

```tsx
// KPI cards:
// dau:                analytics?.dau ?? 0
// mau:                analytics?.mau ?? 0
// avgSessionMinutes:  analytics?.avgSessionMinutes ?? 0
// featureAdoptionRate:analytics?.featureAdoptionRate ?? 0
// tenantHealthScore:  analytics?.tenantHealthScore ?? 0

// Charts:
// DAU chart data:     analytics?.dauTrend ?? []
// Session chart data: analytics?.sessionTrend ?? []
// Feature table:      analytics?.featureUsage ?? []
// Top tenants table:  analytics?.topTenants ?? []
// Access breakdown:   analytics?.accessBreakdown ?? []
```

**Show** skeleton during load:

```tsx
{isLoading && (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
    {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
)}
```

**Wrap** in `<AdminErrorBoundary>`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/useAnalytics.ts src/pages/admin/AdminAnalyticsPage.tsx
git commit -m "feat: wire AdminAnalyticsPage to real API via useAnalytics"
```

---

## Task 10: Create useAdminUsers hook + Update AdminUsersPage

**Files:**
- Create: `src/hooks/admin/useAdminUsers.ts`
- Modify: `src/pages/admin/AdminUsersPage.tsx`

- [ ] **Step 1: Create useAdminUsers.ts**

Create `src/hooks/admin/useAdminUsers.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { InviteAdminRequest } from "@/types/admin";

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getAdminUsers(),
  });
}

export function useInviteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteAdminRequest) => adminApi.inviteAdmin(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Lời mời đã được gửi thành công');
    },
    onError: () => toast.error('Gửi lời mời thất bại'),
  });
}

export function useDeleteAdmin(currentUserId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (id === currentUserId) throw new Error('Không thể xóa tài khoản của chính mình');
      return adminApi.deleteAdmin(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Đã xóa admin user');
    },
    onError: (err: Error) => toast.error(err.message || 'Xóa user thất bại'),
  });
}
```

- [ ] **Step 2: Update AdminUsersPage.tsx**

In `src/pages/admin/AdminUsersPage.tsx`:

**Add** imports:

```tsx
import { useAdminUsers, useInviteAdmin, useDeleteAdmin } from "@/hooks/admin/useAdminUsers";
import { SkeletonTable, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
```

**Remove** hardcoded admin users mock array.

**Add** hooks in component:

```tsx
const { user: currentUser } = useContext(AuthContext);
const { data: adminUsers = [], isLoading } = useAdminUsers();
const inviteAdmin = useInviteAdmin();
const deleteAdmin = useDeleteAdmin(currentUser?.id ?? '');

const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({
  open: false, id: '', name: '',
});
```

**Replace** mock user table rows with `adminUsers.map(...)`.

**Wire** invite form submit:

```tsx
const handleInviteSubmit = (formData: { name: string; email: string; role: 'SuperAdmin' | 'PlatformStaff' }) => {
  inviteAdmin.mutate(formData, { onSuccess: () => setInviteModalOpen(false) });
};
```

**Wire** delete button:

```tsx
onClick={() => setDeleteConfirm({ open: true, id: user.id, name: user.name })}
```

**Add** ConfirmDialog for delete:

```tsx
<ConfirmDialog
  open={deleteConfirm.open}
  title={`Xóa "${deleteConfirm.name}"?`}
  description="Admin user này sẽ bị xóa khỏi hệ thống và không thể đăng nhập nữa."
  confirmLabel="Xóa"
  destructive
  onConfirm={() => {
    deleteAdmin.mutate(deleteConfirm.id);
    setDeleteConfirm(prev => ({ ...prev, open: false }));
  }}
  onCancel={() => setDeleteConfirm(prev => ({ ...prev, open: false }))}
/>
```

**Show** skeleton: `{isLoading && <SkeletonTable rows={5} />}`

**Wrap** in `<AdminErrorBoundary>`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/useAdminUsers.ts src/pages/admin/AdminUsersPage.tsx
git commit -m "feat: wire AdminUsersPage to real API via useAdminUsers hooks"
```

---

## Task 11: Create useSystem hook + Update AdminSystemPage

**Files:**
- Create: `src/hooks/admin/useSystem.ts`
- Modify: `src/pages/admin/AdminSystemPage.tsx`

- [ ] **Step 1: Create useSystem.ts**

Create `src/hooks/admin/useSystem.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { SystemSettings } from "@/types/admin";

export function useSystemSettings() {
  return useQuery({
    queryKey: ['admin', 'system'],
    queryFn: () => adminApi.getSystemSettings(),
  });
}

export function useUpdateSystemSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) => adminApi.updateSystemSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'system'] });
      toast.success('Cài đặt hệ thống đã được lưu');
    },
    onError: () => toast.error('Lưu cài đặt thất bại'),
  });
}
```

- [ ] **Step 2: Update AdminSystemPage.tsx**

In `src/pages/admin/AdminSystemPage.tsx`:

**Add** imports:

```tsx
import { useSystemSettings, useUpdateSystemSettings } from "@/hooks/admin/useSystem";
import { SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import type { SystemSettings } from "@/types/admin";
```

**Remove** all hardcoded toggle state constants.

**Add** hooks in component:

```tsx
const { data: settings, isLoading } = useSystemSettings();
const updateSettings = useUpdateSystemSettings();

// Local draft state for unsaved changes
const [draft, setDraft] = useState<Partial<SystemSettings>>({});
const merged = { ...settings, ...draft } as SystemSettings;

const handleToggle = (key: keyof SystemSettings) => {
  setDraft(prev => ({ ...prev, [key]: !merged[key] }));
};

const handleSave = () => {
  updateSettings.mutate(draft, { onSuccess: () => setDraft({}) });
};
```

**Replace** every hardcoded boolean toggle with `merged.<fieldName>` and every `onChange`/`onClick` with `handleToggle('<fieldName>')`.

**Replace** the Save button `onClick` with `handleSave` and disable it when `updateSettings.isPending`:

```tsx
<button
  onClick={handleSave}
  disabled={updateSettings.isPending || Object.keys(draft).length === 0}
  style={{ /* existing styles */ opacity: updateSettings.isPending ? 0.6 : 1 }}
>
  {updateSettings.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
</button>
```

**Replace** system info section with real data:

```tsx
// app version:  settings?.appVersion ?? 'v—'
// db version:   settings?.dbVersion ?? '—'
// node version: settings?.nodeVersion ?? '—'
// uptime:       settings?.uptime ?? '—'
```

**Show** skeleton while loading: `{isLoading && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>{[...Array(4)].map((_,i)=><SkeletonCard key={i} lines={4}/>)}</div>}`

> **Note:** If `GET /api/admin/system` returns 404, log a warning and keep mock values. Do NOT throw — wrap the query with `throwOnError: false`.

**Wrap** in `<AdminErrorBoundary>`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/useSystem.ts src/pages/admin/AdminSystemPage.tsx
git commit -m "feat: wire AdminSystemPage to real API via useSystem hooks"
```

---

## Task 12: Update AdminOverviewPage

**Files:**
- Create: `src/hooks/admin/useOverview.ts`
- Modify: `src/pages/admin/AdminOverviewPage.tsx`

- [ ] **Step 1: Create useOverview.ts**

Create `src/hooks/admin/useOverview.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

export function useOverviewKPIs() {
  return useQuery({
    queryKey: ['admin', 'overview', 'kpis'],
    queryFn: () => adminApi.getOverviewKPIs(),
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['admin', 'overview', 'activity'],
    queryFn: () => adminApi.getRecentActivity(10),
    refetchInterval: 60_000,
  });
}
```

- [ ] **Step 2: Update AdminOverviewPage.tsx**

In `src/pages/admin/AdminOverviewPage.tsx`:

**Add** imports:

```tsx
import { useOverviewKPIs, useRecentActivity } from "@/hooks/admin/useOverview";
import { useTenants } from "@/hooks/admin/useTenants";
import { SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
```

**Remove** all hardcoded arrays: `MRR_DATA`, `CHURN_DATA`, `RECENT_SIGNUPS`, `ACTIVITY_FEED`, `STATUS_SERVICES`.

**Add** hooks in component:

```tsx
const { data: kpis, isLoading: kpisLoading } = useOverviewKPIs();
const { data: recentActivity = [] } = useRecentActivity();
const { data: tenantsData } = useTenants({ page: 1, pageSize: 5, status: 'Active' });
const recentTenants = tenantsData?.items ?? [];
```

**Replace** KPI card values with real data:

```tsx
// mrr:           kpis?.mrr ?? 0
// mrrGrowth:     kpis?.mrrGrowth ?? 0
// activeTenants: kpis?.activeTenants ?? 0
// arpu:          kpis?.arpu ?? 0
// churnRate:     kpis?.churnRate ?? 0
// openTickets:   kpis?.openTickets ?? 0
```

**Replace** `RECENT_SIGNUPS` table rows with `recentTenants.map(t => ...)`.

**Replace** `ACTIVITY_FEED` items with `recentActivity.map(log => ...)`. Map `log.type` to an icon:

```tsx
const LOG_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  Auth:    { icon: ShieldCheck, color: '#6366f1' },
  Tenant:  { icon: Users,       color: '#2563EB' },
  Billing: { icon: CreditCard,  color: '#16a34a' },
  Plan:    { icon: TrendingUp,  color: '#f59e0b' },
  Support: { icon: AlertCircle, color: '#f97316' },
  System:  { icon: Server,      color: '#64748b' },
};
```

**Show** skeleton for KPI cards while loading:

```tsx
{kpisLoading && (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
    {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
)}
```

**For** MRR chart — keep chart structure but use `kpis?.mrrTrend ?? MRR_DATA` fallback (keep the old `MRR_DATA` as a fallback constant only for chart display until the API returns real trend data).

**Wrap** in `<AdminErrorBoundary>`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/useOverview.ts src/pages/admin/AdminOverviewPage.tsx
git commit -m "feat: wire AdminOverviewPage to real API via useOverview hooks"
```

---

## Task 13: Create AdminPlansPage (New)

**Files:**
- Create: `src/hooks/admin/usePlans.ts`
- Create: `src/pages/admin/AdminPlansPage.tsx`

- [ ] **Step 1: Create usePlans.ts**

Create `src/hooks/admin/usePlans.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { UpdatePlanRequest } from "@/types/admin";

export function usePlans() {
  return useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => adminApi.getPlans(),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) =>
      adminApi.updatePlan(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'plans'] });
      toast.success('Gói cước đã được cập nhật');
    },
    onError: () => toast.error('Cập nhật gói cước thất bại'),
  });
}
```

- [ ] **Step 2: Create AdminPlansPage.tsx**

Create `src/pages/admin/AdminPlansPage.tsx`:

```tsx
import { useState } from "react";
import { Edit3, Users, DollarSign, TrendingUp, Package, Check, X } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, SkeletonCard, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { usePlans, useUpdatePlan } from "@/hooks/admin/usePlans";
import type { SubscriptionPlan, UpdatePlanRequest } from "@/types/admin";
import "@/styles/fonts.css";

const PLAN_ACCENT: Record<string, string> = {
  Starter: '#6b7280', Growth: '#6366f1', Enterprise: '#7c3aed', Trial: '#f59e0b',
};

function EditPlanModal({ plan, onClose }: { plan: SubscriptionPlan; onClose: () => void }) {
  const updatePlan = useUpdatePlan();
  const [price, setPrice] = useState(plan.price);
  const [maxStaff, setMaxStaff] = useState(plan.maxStaff);
  const [features, setFeatures] = useState<string[]>(plan.features);
  const [newFeature, setNewFeature] = useState('');

  const handleSave = () => {
    updatePlan.mutate(
      { id: plan.id, data: { price, maxStaff, features } },
      { onSuccess: onClose }
    );
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'Inter, sans-serif' }}
      onClick={onClose}
    >
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Chỉnh sửa gói {plan.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X style={{ width: 18, height: 18 }} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Giá (USD/tháng)</label>
            <input
              type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Số nhân viên tối đa</label>
            <input
              type="number" value={maxStaff} onChange={e => setMaxStaff(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Tính năng</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', borderRadius: 6, padding: '6px 10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>{f}</span>
                  <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X style={{ width: 14, height: 14 }} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newFeature} onChange={e => setNewFeature(e.target.value)}
                placeholder="Thêm tính năng mới..."
                onKeyDown={e => { if (e.key === 'Enter' && newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature(''); }}}
                style={{ flex: 1, padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', outline: 'none' }}
              />
              <button
                onClick={() => { if (newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature(''); }}}
                style={{ padding: '7px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >+ Thêm</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem', cursor: 'pointer', color: '#374151' }}>Hủy</button>
          <button
            onClick={handleSave}
            disabled={updatePlan.isPending}
            style={{ padding: '8px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: updatePlan.isPending ? 0.6 : 1 }}
          >{updatePlan.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPlansPage() {
  const { data: plans = [], isLoading } = usePlans();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const totalTenants = plans.reduce((s, p) => s + p.tenantCount, 0);
  const totalMrr = plans.reduce((s, p) => s + p.mrr, 0);
  const trialCount = plans.find(p => p.name === 'Trial')?.tenantCount ?? 0;

  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Gói cước" breadcrumbs={[{ label: 'Cổng quản trị' }, { label: 'Gói cước' }]}>
        <div style={{ padding: '24px 28px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {isLoading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : <>
              <AdminKPICard label="Tổng số gói" value={plans.length.toString()} icon={Package} color="#6366f1" bg="rgba(99,102,241,0.08)" />
              <AdminKPICard label="Tenant đang dùng" value={totalTenants.toString()} icon={Users} color="#2563eb" bg="rgba(37,99,235,0.08)" />
              <AdminKPICard label="MRR tổng" value={`$${totalMrr.toLocaleString()}`} icon={DollarSign} color="#16a34a" bg="rgba(22,163,74,0.08)" />
              <AdminKPICard label="Trial active" value={trialCount.toString()} icon={TrendingUp} color="#f59e0b" bg="rgba(245,158,11,0.08)" />
            </>}
          </div>

          {/* Plan cards */}
          <AdminCard>
            <AdminCardHeader title="Danh sách gói cước" subtitle={`${plans.length} gói`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, padding: '16px 0 4px' }}>
              {plans.map(plan => {
                const accent = PLAN_ACCENT[plan.name] ?? '#6366f1';
                const isPopular = plan.name === 'Growth';
                return (
                  <div key={plan.id} style={{
                    border: `2px solid ${isPopular ? accent : '#e2e8f0'}`,
                    borderRadius: 12, padding: 20, position: 'relative',
                    background: '#fff',
                  }}>
                    {isPopular && (
                      <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 12px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                        PHỔ BIẾN NHẤT
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{plan.name}</span>
                      <span style={{ background: `${accent}14`, color: accent, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>{plan.tenantCount} tenants</span>
                    </div>
                    <div style={{ color: accent, fontSize: '1.6rem', fontWeight: 800, marginBottom: 2 }}>
                      ${plan.price}<span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>/tháng</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>MRR: ${plan.mrr.toLocaleString()} · Tối đa {plan.maxStaff === 999 ? 'không giới hạn' : plan.maxStaff} nhân viên</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                      {plan.features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: '#374151' }}>
                          <Check style={{ width: 13, height: 13, color: accent, flexShrink: 0 }} />
                          {f}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingPlan(plan)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        background: isPopular ? accent : '#f1f5f9',
                        color: isPopular ? '#fff' : accent,
                        border: 'none', borderRadius: 8, padding: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      <Edit3 style={{ width: 13, height: 13 }} />
                      Chỉnh sửa
                    </button>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>

        {editingPlan && <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} />}
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/usePlans.ts src/pages/admin/AdminPlansPage.tsx
git commit -m "feat: add AdminPlansPage with usePlans hook"
```

---

## Task 14: Create AdminLogsPage (New)

**Files:**
- Create: `src/hooks/admin/useLogs.ts`
- Create: `src/pages/admin/AdminLogsPage.tsx`

- [ ] **Step 1: Create useLogs.ts**

Create `src/hooks/admin/useLogs.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { LogListParams } from "@/types/admin";

export function useActivityLogs(params?: LogListParams) {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: () => adminApi.getActivityLogs(params),
    staleTime: 1000 * 30,
  });
}
```

- [ ] **Step 2: Create AdminLogsPage.tsx**

Create `src/pages/admin/AdminLogsPage.tsx`:

```tsx
import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader, AdminStatusBadge, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useActivityLogs } from "@/hooks/admin/useLogs";
import type { LogEventType } from "@/types/admin";
import "@/styles/fonts.css";

const LOG_TYPE_STYLE: Record<LogEventType, { bg: string; text: string }> = {
  Auth:    { bg: '#fee2e2', text: '#dc2626' },
  Tenant:  { bg: '#dbeafe', text: '#2563eb' },
  Billing: { bg: '#dcfce7', text: '#16a34a' },
  Plan:    { bg: '#fef3c7', text: '#d97706' },
  Support: { bg: '#f3e8ff', text: '#7c3aed' },
  System:  { bg: '#f1f5f9', text: '#475569' },
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<LogEventType | ''>('');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [page, setPage] = useState(1);

  const { data: logsData, isLoading } = useActivityLogs({
    search: search || undefined,
    type: filterType || undefined,
    timeRange,
    page,
    pageSize: 50,
  });

  const logs = logsData?.items ?? [];
  const total = logsData?.total ?? 0;

  const handleExportCSV = () => {
    const header = 'Timestamp,Type,Actor,Action,IP\n';
    const rows = logs.map(l =>
      `"${l.timestamp}","${l.type}","${l.actor}","${l.action.replace(/"/g, '""')}","${l.ip ?? ''}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${timeRange}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Activity Logs" breadcrumbs={[{ label: 'Cổng quản trị' }, { label: 'Activity Logs' }]}>
        <div style={{ padding: '24px 28px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AdminCard>
            <AdminCardHeader
              title="Nhật ký hoạt động"
              subtitle={`${total.toLocaleString()} bản ghi`}
              action={
                <button
                  onClick={handleExportCSV}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}
                >
                  <Download style={{ width: 13, height: 13 }} />
                  Export CSV
                </button>
              }
            />

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px' }}>
                <Search style={{ width: 14, height: 14, color: '#94a3b8' }} />
                <input
                  value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Tìm theo tenant, user, hành động..."
                  style={{ border: 'none', background: 'none', fontSize: '0.8rem', outline: 'none', width: '100%', color: '#374151' }}
                />
              </div>
              <select
                value={filterType} onChange={e => { setFilterType(e.target.value as LogEventType | ''); setPage(1); }}
                style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', color: '#374151', cursor: 'pointer' }}
              >
                <option value="">Tất cả loại</option>
                {(['Auth', 'Tenant', 'Billing', 'Plan', 'Support', 'System'] as LogEventType[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={timeRange} onChange={e => { setTimeRange(e.target.value as '24h' | '7d' | '30d'); setPage(1); }}
                style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', color: '#374151', cursor: 'pointer' }}
              >
                <option value="24h">24 giờ qua</option>
                <option value="7d">7 ngày</option>
                <option value="30d">30 ngày</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 90px 130px 1fr 100px', background: '#f8fafc', padding: '8px 14px', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>
                <span>Thời gian</span><span>Loại</span><span>Actor</span><span>Hành động</span><span>IP</span>
              </div>
              {isLoading && <SkeletonTable rows={10} />}
              {!isLoading && logs.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: '0.875rem' }}>
                  Không có bản ghi nào phù hợp
                </div>
              )}
              {logs.map(log => {
                const style = LOG_TYPE_STYLE[log.type] ?? LOG_TYPE_STYLE.System;
                return (
                  <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '160px 90px 130px 1fr 100px', padding: '9px 14px', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                    <span style={{ background: style.bg, color: style.text, padding: '2px 8px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 700, display: 'inline-block' }}>{log.type}</span>
                    <span style={{ color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.actor}</span>
                    <span style={{ color: '#374151' }} dangerouslySetInnerHTML={{ __html: log.action }} />
                    <span style={{ color: '#94a3b8' }}>{log.ip ?? '—'}</span>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {total > 50 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: '0.8rem', color: '#64748b' }}>
                <span>Hiển thị {logs.length} / {total} bản ghi</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.78rem', opacity: page === 1 ? 0.4 : 1 }}>← Trước</button>
                  <span style={{ padding: '5px 10px', fontWeight: 600, color: '#374151' }}>Trang {page}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 50} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.78rem', opacity: logs.length < 50 ? 0.4 : 1 }}>Tiếp →</button>
                </div>
              </div>
            )}
          </AdminCard>
        </div>
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/useLogs.ts src/pages/admin/AdminLogsPage.tsx
git commit -m "feat: add AdminLogsPage with useLogs hook"
```

---

## Task 15: Create AdminCrmPage (New)

**Files:**
- Create: `src/hooks/admin/useCrm.ts`
- Create: `src/pages/admin/AdminCrmPage.tsx`

- [ ] **Step 1: Create useCrm.ts**

Create `src/hooks/admin/useCrm.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { CreateCampaignRequest } from "@/types/admin";

export function useCampaigns() {
  return useQuery({
    queryKey: ['admin', 'crm', 'campaigns'],
    queryFn: () => adminApi.getCampaigns(),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => adminApi.createCampaign(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'crm', 'campaigns'] });
      toast.success('Campaign đã được tạo');
    },
    onError: () => toast.error('Tạo campaign thất bại'),
  });
}

export function useSegments() {
  return useQuery({
    queryKey: ['admin', 'crm', 'segments'],
    queryFn: () => adminApi.getSegments(),
  });
}
```

- [ ] **Step 2: Create AdminCrmPage.tsx**

Create `src/pages/admin/AdminCrmPage.tsx`:

```tsx
import { useState } from "react";
import { Megaphone, Users, Plus, BarChart3, X, Send } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminStatusBadge, SkeletonCard, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useCampaigns, useCreateCampaign, useSegments } from "@/hooks/admin/useCrm";
import type { CampaignStatus, CampaignTrigger } from "@/types/admin";
import "@/styles/fonts.css";

const CAMPAIGN_STATUS_TYPE: Record<CampaignStatus, 'success' | 'info' | 'warning'> = {
  Active: 'success', Scheduled: 'info', Draft: 'warning',
};
const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  Active: 'Đang chạy', Scheduled: 'Đã lên lịch', Draft: 'Bản nháp',
};
const TRIGGER_LABEL: Record<CampaignTrigger, string> = {
  auto: 'Tự động', manual: 'Thủ công', scheduled: 'Theo lịch',
};

function CreateCampaignModal({ onClose }: { onClose: () => void }) {
  const createCampaign = useCreateCampaign();
  const [form, setForm] = useState({ name: '', triggerType: 'manual' as CampaignTrigger, scheduledAt: '' });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    createCampaign.mutate({ name: form.name, type: 'Email', triggerType: form.triggerType, scheduledAt: form.scheduledAt || undefined }, { onSuccess: onClose });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'Inter, sans-serif' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Tạo Campaign mới</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X style={{ width: 18, height: 18 }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Tên campaign</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Trial Expiry Reminder" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Loại trigger</label>
            <select value={form.triggerType} onChange={e => setForm(f => ({ ...f, triggerType: e.target.value as CampaignTrigger }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
              <option value="manual">Thủ công</option>
              <option value="auto">Tự động</option>
              <option value="scheduled">Theo lịch</option>
            </select>
          </div>
          {form.triggerType === 'scheduled' && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Thời gian gửi</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem', cursor: 'pointer', color: '#374151' }}>Hủy</button>
          <button onClick={handleSubmit} disabled={createCampaign.isPending || !form.name.trim()} style={{ padding: '8px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: createCampaign.isPending ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Send style={{ width: 13, height: 13 }} />
            {createCampaign.isPending ? 'Đang tạo...' : 'Tạo campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCrmPage() {
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns();
  const { data: segments = [], isLoading: segmentsLoading } = useSegments();
  const [showCreate, setShowCreate] = useState(false);

  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalRecipients = campaigns.reduce((s, c) => s + c.recipientCount, 0);

  return (
    <AdminErrorBoundary>
      <AdminPageShell title="CRM & Campaigns" breadcrumbs={[{ label: 'Cổng quản trị' }, { label: 'CRM' }]}>
        <div style={{ padding: '24px 28px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <AdminKPICard label="Tổng campaigns" value={campaigns.length.toString()} icon={Megaphone} color="#6366f1" bg="rgba(99,102,241,0.08)" />
            <AdminKPICard label="Đang chạy" value={activeCampaigns.toString()} icon={BarChart3} color="#16a34a" bg="rgba(22,163,74,0.08)" />
            <AdminKPICard label="Tổng recipients" value={totalRecipients.toLocaleString()} icon={Users} color="#2563eb" bg="rgba(37,99,235,0.08)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Campaigns */}
            <AdminCard>
              <AdminCardHeader
                title="Email Campaigns"
                subtitle={`${campaigns.length} campaigns`}
                action={
                  <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus style={{ width: 12, height: 12 }} /> Tạo mới
                  </button>
                }
              />
              {campaignsLoading ? <SkeletonTable rows={4} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
                  {campaigns.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.8rem', padding: '16px 0', textAlign: 'center' }}>Chưa có campaign nào</p>}
                  {campaigns.map(c => (
                    <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Email · {c.recipientCount} recipients · {TRIGGER_LABEL[c.triggerType]}
                          {c.scheduledAt ? ` · ${new Date(c.scheduledAt).toLocaleDateString('vi-VN')}` : ''}
                        </div>
                      </div>
                      <AdminStatusBadge status={CAMPAIGN_STATUS_LABEL[c.status]} type={CAMPAIGN_STATUS_TYPE[c.status]} />
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>

            {/* Segments */}
            <AdminCard>
              <AdminCardHeader title="Customer Segments" subtitle={`${segments.length} segments`} />
              {segmentsLoading ? <SkeletonTable rows={4} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
                  {segments.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.8rem', padding: '16px 0', textAlign: 'center' }}>Chưa có segment nào</p>}
                  {segments.map(seg => {
                    const pct = seg.totalTenants > 0 ? Math.round((seg.tenantCount / seg.totalTenants) * 100) : 0;
                    const color = pct > 60 ? '#dc2626' : pct > 30 ? '#f59e0b' : '#6366f1';
                    return (
                      <div key={seg.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{seg.name}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{seg.tenantCount}</span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: 99, height: 5 }}>
                          <div style={{ background: color, width: `${pct}%`, height: '100%', borderRadius: 99, transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>{pct}% của {seg.totalTenants} tenants</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </AdminCard>
          </div>
        </div>

        {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} />}
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/admin/useCrm.ts src/pages/admin/AdminCrmPage.tsx
git commit -m "feat: add AdminCrmPage with useCrm hooks"
```

---

## Task 16: Update AdminSidebar + Register New Routes

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx`
- Modify: `src/routes.tsx`

- [ ] **Step 1: Add 3 new nav items to AdminSidebar.tsx**

In `src/components/admin/AdminSidebar.tsx`, find the existing import for lucide-react icons and add to the imports list:

```tsx
// Add to existing lucide-react import:
CreditCard, ClipboardList, Megaphone
```

Find the nav group array for **"VẬN HÀNH"** (the section containing Billing and Support). It will look something like:

```tsx
{
  group: 'VẬN HÀNH',
  items: [
    { label: 'Thanh toán', path: '/admin/billing', icon: CreditCard, adminOnly: true },
    { label: 'Hỗ trợ',     path: '/admin/support', icon: Headphones },
  ]
}
```

Add 3 new items to this group:

```tsx
{ label: 'Gói cước',      path: '/admin/plans',  icon: Package,       adminOnly: true },
{ label: 'Activity Logs', path: '/admin/logs',   icon: ClipboardList                 },
{ label: 'CRM',           path: '/admin/crm',    icon: Megaphone                     },
```

(Also add `Package` to the lucide-react imports.)

- [ ] **Step 2: Add 3 new routes to routes.tsx**

In `src/routes.tsx`, find the section where admin routes are defined (near existing `/admin/users` and `/admin/system` lazy imports). Add:

```tsx
const AdminPlansPage = lazy(() => import('@/pages/admin/AdminPlansPage'));
const AdminLogsPage  = lazy(() => import('@/pages/admin/AdminLogsPage'));
const AdminCrmPage   = lazy(() => import('@/pages/admin/AdminCrmPage'));
```

And in the router config, add after the existing `/admin/system` route:

```tsx
{
  path: '/admin/plans',
  element: (
    <ProtectedRoute roles={[Role.SuperAdmin]}>
      <Suspense fallback={<AdminLoadingSpinner />}>
        <AdminPlansPage />
      </Suspense>
    </ProtectedRoute>
  ),
},
{
  path: '/admin/logs',
  element: (
    <ProtectedRoute roles={[Role.SuperAdmin, Role.PlatformStaff]}>
      <Suspense fallback={<AdminLoadingSpinner />}>
        <AdminLogsPage />
      </Suspense>
    </ProtectedRoute>
  ),
},
{
  path: '/admin/crm',
  element: (
    <ProtectedRoute roles={[Role.SuperAdmin, Role.PlatformStaff]}>
      <Suspense fallback={<AdminLoadingSpinner />}>
        <AdminCrmPage />
      </Suspense>
    </ProtectedRoute>
  ),
},
```

(Match the exact pattern of existing route objects in `routes.tsx` — check how `ProtectedRoute`, `Suspense`, and `AdminLoadingSpinner` are used in the existing admin routes and use the same pattern.)

- [ ] **Step 3: Verify all pages load in browser**

Run `pnpm dev`. Go to:
- `http://localhost:5173/admin` — sidebar should show 3 new items
- `http://localhost:5173/admin/plans` — should load AdminPlansPage
- `http://localhost:5173/admin/logs` — should load AdminLogsPage
- `http://localhost:5173/admin/crm` — should load AdminCrmPage

- [ ] **Step 4: Final build check**

```bash
pnpm build 2>&1
```

Expected: build succeeds with 0 TypeScript errors. Warnings about bundle size are acceptable.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx src/routes.tsx
git commit -m "feat: add Plans/Logs/CRM nav items to AdminSidebar and register routes"
```

---

## Self-Review Checklist

After writing the plan, verified:

**Spec coverage:**
- ✅ Task 1: QueryClientProvider + Toaster (sonner)
- ✅ Task 2: `src/types/admin.ts` all types
- ✅ Task 3: `src/api/adminApi.ts` all endpoints
- ✅ Task 4: SkeletonCard, SkeletonTable, ConfirmDialog in AdminWidgets
- ✅ Task 5: AdminErrorBoundary
- ✅ Tasks 6–12: All 7 existing pages wired to real API
- ✅ Tasks 13–15: 3 new pages (Plans, Logs, CRM)
- ✅ Task 16: Sidebar nav + routes

**Gaps noted:**
- `useOverview` uses `adminApi.getOverviewKPIs()` which calls `/api/admin/overview` — verify this endpoint exists in backend. If not, derive KPIs from individual queries (e.g., combine `useTenants` count + `useBillingOverview` mrr).
- `/api/admin/system` endpoint: verify it exists before implementing Task 11. If absent, keep SystemPage on mock data.
- `/api/admin/plans` and `/api/admin/logs`: verify backend has these endpoints. The backend has `SubscriptionPlan` and `ActivityLog` entities but dedicated admin endpoints may not be exposed yet.

**Type consistency:**
- All hook return types match types defined in `src/types/admin.ts`
- `adminApi` functions use the same types as hooks
- `ConfirmDialog` props match usage in Tasks 6, 10
