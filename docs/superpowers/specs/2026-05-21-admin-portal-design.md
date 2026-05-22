# Admin Portal — API Integration & New Pages Design

**Date:** 2026-05-21  
**Project:** PetTech-FE  
**Backend:** `http://51.210.176.94:5001` (ASP.NET Core, deployed)  
**Approach:** API Service Layer First (Approach B)  
**Design style:** Clean Light (white background, indigo/purple accent, MUI + Tailwind)

---

## 1. Goals

1. Replace all hardcoded mock data in 7 existing admin pages with real backend API calls.
2. Add 3 new admin pages that expose backend functionality not yet in the UI.
3. Achieve production-ready quality: skeleton loading, toast notifications, error boundaries, optimistic updates, confirm dialogs.

---

## 2. Architecture

### Data Flow

```
AdminPage → React Query Hook → adminApi.ts → axiosInstance → Backend REST API
```

### New Files

```
src/
├── api/
│   └── adminApi.ts               # All admin endpoints — single source of truth
├── types/
│   └── admin.ts                  # TypeScript types for all admin domain entities
├── hooks/admin/
│   ├── useTenants.ts
│   ├── useBilling.ts
│   ├── useAnalytics.ts
│   ├── useSupport.ts
│   ├── useAdminUsers.ts
│   ├── useSystem.ts
│   ├── usePlans.ts               # new
│   ├── useLogs.ts                # new
│   └── useCrm.ts                 # new
├── pages/admin/
│   ├── AdminPlansPage.tsx        # new
│   ├── AdminLogsPage.tsx         # new
│   └── AdminCrmPage.tsx          # new
└── components/admin/
    └── AdminErrorBoundary.tsx    # new
```

### Modified Files

```
src/
├── pages/admin/
│   ├── AdminOverviewPage.tsx     # replace mock data
│   ├── AdminTenantsPage.tsx      # replace mock data + real CRUD
│   ├── AdminBillingPage.tsx      # replace mock data
│   ├── AdminAnalyticsPage.tsx    # replace mock data
│   ├── AdminSupportPage.tsx      # replace mock data + real reply
│   ├── AdminUsersPage.tsx        # replace mock data + real CRUD
│   └── AdminSystemPage.tsx       # replace mock data + persist settings
├── components/admin/
│   ├── AdminSidebar.tsx          # add 3 new nav items (Plans, Logs, CRM)
│   └── AdminWidgets.tsx          # add SkeletonCard, ToastProvider, ConfirmDialog
└── routes.tsx                    # register 3 new routes
```

---

## 3. API Endpoints Mapping

### 3.1 Authentication (existing `AuthContext`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/admin/login` | Admin login (already wired) |
| POST | `/api/auth/refresh` | Token refresh (already wired) |
| POST | `/api/auth/logout` | Logout (already wired) |

### 3.2 Tenants (`useTenants.ts`)

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/tenants` | `useTenants(params)` | TenantsPage list |
| GET | `/api/admin/tenants/:id` | `useTenant(id)` | Detail modal |
| POST | `/api/admin/tenants` | `useCreateTenant()` | Create form |
| PUT | `/api/admin/tenants/:id` | `useUpdateTenant()` | Edit form |
| POST | `/api/admin/tenants/:id/suspend` | `useSuspendTenant()` | SuperAdmin action |
| POST | `/api/admin/tenants/:id/reactivate` | `useReactivateTenant()` | SuperAdmin action |
| DELETE | `/api/admin/tenants/:id` | `useDeleteTenant()` | SuperAdmin action |

### 3.3 Billing (`useBilling.ts`)

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/billing` | `useBillingOverview()` | BillingPage KPIs |
| GET | `/api/admin/billing/invoices` | `useInvoices(params)` | Invoice table |
| POST | `/api/admin/billing/invoices/:id/retry` | `useRetryPayment()` | Retry button |

### 3.4 Support Tickets (`useSupport.ts`)

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/support-tickets` | `useSupportTickets(params)` | SupportPage list |
| GET | `/api/admin/support-tickets/:id` | `useTicket(id)` | Detail modal |
| PUT | `/api/admin/support-tickets/:id` | `useUpdateTicket()` | Status/priority/assign |
| POST | `/api/admin/support-tickets/:id/reply` | `useReplyTicket()` | Reply input |

### 3.5 Admin Users (`useAdminUsers.ts`)

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/auth/admin/users` | `useAdminUsers()` | UsersPage list |
| POST | `/api/auth/admin/users/invite` | `useInviteAdmin()` | Invite modal |
| DELETE | `/api/auth/admin/users/:id` | `useDeleteAdmin()` | Delete action |

### 3.6 Analytics (`useAnalytics.ts`)

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/analytics` | `usePlatformAnalytics()` | AnalyticsPage all metrics |

### 3.7 System Settings (`useSystem.ts`)

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/system` | `useSystemSettings()` | SystemPage display |
| PUT | `/api/admin/system` | `useUpdateSystemSettings()` | Save changes |

> **Risk:** `/api/admin/system` là endpoint platform-level 
### 3.8 Subscription Plans (`usePlans.ts`) — NEW

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/plans` | `usePlans()` | PlansPage list |
| PUT | `/api/admin/plans/:id` | `useUpdatePlan()` | Edit plan modal |

### 3.9 Activity Logs (`useLogs.ts`) — NEW

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/logs` | `useActivityLogs(params)` | LogsPage table |

### 3.10 CRM Campaigns (`useCrm.ts`) — NEW

| Method | Endpoint | Hook function | Page |
|--------|----------|---------------|------|
| GET | `/api/admin/crm/campaigns` | `useCampaigns()` | CrmPage campaigns |
| POST | `/api/admin/crm/campaigns` | `useCreateCampaign()` | Create campaign |
| PUT | `/api/admin/crm/campaigns/:id` | `useUpdateCampaign()` | Edit campaign |
| GET | `/api/admin/crm/segments` | `useSegments()` | CrmPage segments |

---

## 4. New Pages

### 4.1 `/admin/plans` — Subscription Plans

- **Purpose:** SuperAdmin quản lý các gói cước (Starter/Growth/Enterprise): giá, tính năng, giới hạn.
- **Layout:** 4 KPI cards (tổng gói, tenant dùng, MRR tổng, trial active) + 3 plan cards dạng grid với nút "Chỉnh sửa" mở modal.
- **Modal:** Form chỉnh sửa tên, giá, danh sách features (toggle on/off).
- **Access:** SuperAdmin only.

### 4.2 `/admin/logs` — Activity & Audit Logs

- **Purpose:** Xem toàn bộ hành động của admin và hệ thống (login, suspend tenant, billing events, plan changes).
- **Layout:** Filter bar (search, loại event, time range) + export CSV + bảng log (thời gian, loại, actor, hành động, IP).
- **Pagination:** Load more hoặc infinite scroll.
- **Access:** SuperAdmin + PlatformStaff.

### 4.3 `/admin/crm` — CRM & Campaigns

- **Purpose:** Quản lý campaign email (trial expiry reminder, churn prevention, upsell) và customer segments.
- **Layout:** 2 cột — danh sách campaigns (trái) + customer segments với progress bar (phải).
- **Campaign states:** Active, Draft, Scheduled.
- **Access:** SuperAdmin + PlatformStaff.

---

## 5. UI Improvements (Existing 7 Pages)

### 5.1 Shared improvements (tất cả trang)

- **Skeleton loading:** Component `<SkeletonCard>` trong `AdminWidgets.tsx` — hiển thị khi `isLoading === true`.
- **Toast notifications:** `useToast()` hook — gọi sau mỗi mutation thành công/thất bại.
- **Error boundary:** `<AdminErrorBoundary>` bao bọc mỗi trang — hiển thị fallback UI thay vì crash trắng.
- **Empty states:** Khi API trả về mảng rỗng, hiển thị icon + text hướng dẫn.

### 5.2 Per-page specifics

| Page | Key improvements |
|------|-----------------|
| Overview | Real KPIs từ analytics endpoint; activity feed từ `/api/admin/logs` (latest 10); system health từ backend health check |
| Tenants | Server-side pagination; create/edit tenant form submit lên API; suspend/reactivate/delete dùng `<ConfirmDialog>`; optimistic update trên list |
| Billing | Real MRR/ARR/churn từ billing overview; invoice table paginated; retry payment gọi API; CSV export bằng `Blob` download |
| Analytics | Recharts graphs dùng real data từ analytics endpoint |
| Support | Real ticket list; reply form POST lên API; status/assign/escalate PUT lên API; auto-refresh mỗi 30s |
| Users | Real admin user list; invite form POST invite endpoint; delete với `<ConfirmDialog>`; không cho xóa chính mình |
| System | Settings load từ API khi mount; Save button PUT lên API; maintenance mode banner dùng data thật |

---

## 6. Shared Components to Add/Update

### `AdminWidgets.tsx` — 2 additions

```typescript
// Skeleton placeholder khi loading
<SkeletonCard lines={3} />

// Confirm dialog trước destructive actions — dùng @radix-ui/react-alert-dialog (đã có)
<ConfirmDialog
  open={open}
  title="Suspend tenant?"
  description="Tenant sẽ không truy cập được hệ thống."
  confirmLabel="Suspend"
  onConfirm={handleSuspend}
  onCancel={() => setOpen(false)}
/>
```

**Toast notifications:** Dùng `sonner` (đã có trong `package.json`, v2.0.3) — không cần add dependency.

```typescript
import { toast } from 'sonner';
toast.success('Tenant đã được tạo');
toast.error('Lỗi kết nối server');
```

`<Toaster />` cần được mount 1 lần trong layout root (kiểm tra xem đã có chưa — nếu chưa thêm vào `App.tsx`).

### `AdminSidebar.tsx` — 3 nav items mới

Thêm vào group **VẬN HÀNH**:
- Gói cước (`/admin/plans`) — icon: `CreditCard` — SuperAdmin only
- Activity Logs (`/admin/logs`) — icon: `ClipboardList`
- CRM (`/admin/crm`) — icon: `Megaphone`

### `AdminErrorBoundary.tsx` — mới

React class component bắt runtime errors, hiển thị fallback card với nút "Thử lại".

---

## 7. Routes

Thêm vào `src/routes.tsx`:

```tsx
{ path: '/admin/plans',  element: <AdminPlansPage />,  roles: [Role.SuperAdmin] },
{ path: '/admin/logs',   element: <AdminLogsPage />,   roles: [Role.SuperAdmin, Role.PlatformStaff] },
{ path: '/admin/crm',    element: <AdminCrmPage />,    roles: [Role.SuperAdmin, Role.PlatformStaff] },
```

---

## 8. `adminApi.ts` Structure

```typescript
// src/api/adminApi.ts
const BASE = '/api/admin';

export const adminApi = {
  // Tenants
  getTenants: (params) => axiosInstance.get(`${BASE}/tenants`, { params }),
  getTenant: (id) => axiosInstance.get(`${BASE}/tenants/${id}`),
  createTenant: (data) => axiosInstance.post(`${BASE}/tenants`, data),
  updateTenant: (id, data) => axiosInstance.put(`${BASE}/tenants/${id}`, data),
  suspendTenant: (id) => axiosInstance.post(`${BASE}/tenants/${id}/suspend`),
  reactivateTenant: (id) => axiosInstance.post(`${BASE}/tenants/${id}/reactivate`),
  deleteTenant: (id) => axiosInstance.delete(`${BASE}/tenants/${id}`),

  // Billing
  getBillingOverview: () => axiosInstance.get(`${BASE}/billing`),
  getInvoices: (params) => axiosInstance.get(`${BASE}/billing/invoices`, { params }),
  retryPayment: (id) => axiosInstance.post(`${BASE}/billing/invoices/${id}/retry`),

  // Support
  getSupportTickets: (params) => axiosInstance.get(`${BASE}/support-tickets`, { params }),
  getTicket: (id) => axiosInstance.get(`${BASE}/support-tickets/${id}`),
  updateTicket: (id, data) => axiosInstance.put(`${BASE}/support-tickets/${id}`, data),
  replyTicket: (id, data) => axiosInstance.post(`${BASE}/support-tickets/${id}/reply`, data),

  // Admin Users
  getAdminUsers: () => axiosInstance.get('/api/auth/admin/users'),
  inviteAdmin: (data) => axiosInstance.post('/api/auth/admin/users/invite', data),
  deleteAdmin: (id) => axiosInstance.delete(`/api/auth/admin/users/${id}`),

  // Analytics
  getAnalytics: () => axiosInstance.get('/api/analytics'),



  // Plans (new)
  getPlans: () => axiosInstance.get(`${BASE}/plans`),
  updatePlan: (id, data) => axiosInstance.put(`${BASE}/plans/${id}`, data),

  // Logs (new)
  getActivityLogs: (params) => axiosInstance.get(`${BASE}/logs`, { params }),

  // CRM (new)
  getCampaigns: () => axiosInstance.get(`${BASE}/crm/campaigns`),
  createCampaign: (data) => axiosInstance.post(`${BASE}/crm/campaigns`, data),
  updateCampaign: (id, data) => axiosInstance.put(`${BASE}/crm/campaigns/${id}`, data),
  getSegments: () => axiosInstance.get(`${BASE}/crm/segments`),
};
```

---

## 9. Dependencies

**Cần cài thêm (chưa có trong `package.json`):**
- `@tanstack/react-query` v5 — data fetching, caching, mutations
- `@tanstack/react-query-devtools` v5 — dev tools (devDependency)

**Đã có sẵn (không cần cài thêm):**
- `sonner` v2.0.3 — toast notifications ✓
- `@radix-ui/react-alert-dialog` — ConfirmDialog ✓
- `@radix-ui/react-switch` — toggle cho SystemPage ✓
- MUI Skeleton (`@mui/material`) — có thể dùng cho skeleton loading ✓

---

## 10. Out of Scope

- Unit tests / integration tests
- Realtime WebSocket cho support chat (chỉ polling mỗi 30s)
- Email template editor trong CRM
- White-label customization cho từng tenant từ admin portal
- Mobile responsive cho admin portal (desktop-first)
