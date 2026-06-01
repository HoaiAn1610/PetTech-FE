import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

// ── Loading Fallback ──────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Đang tải...</p>
      </div>
    </div>
  );
}

// ── Lazy Loading Components ────────────────────────────────────────────────────
const LandingPage = React.lazy(() => import("@/pages/LandingPage"));
const FeatureDetailPage = React.lazy(() => import("@/pages/features/FeatureDetailPage"));

// Auth Pages
const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage"));
const AdminLoginPage = React.lazy(() => import("@/pages/auth/AdminLoginPage"));
const TotpVerify = React.lazy(() => import("@/pages/auth/TotpVerify"));

// Payment Pages
const PaymentSuccessPage = React.lazy(() => import("@/pages/clinic/PaymentSuccessPage"));
const PaymentCancelPage = React.lazy(() => import("@/pages/clinic/PaymentCancelPage"));

// Clinic Pages
const OwnerDashboardPage = React.lazy(() => import("@/pages/clinic/OwnerDashboardPage"));
const DashboardPage = React.lazy(() => import("@/pages/clinic/DashboardPage"));
const BookingPage = React.lazy(() => import("@/pages/clinic/BookingPage"));
const KanbanPage = React.lazy(() => import("@/pages/clinic/KanbanPage"));
const InventoryPage = React.lazy(() => import("@/pages/clinic/InventoryPage"));
const MedicalRecordPage = React.lazy(() => import("@/pages/clinic/MedicalRecordPage"));
const PatientsPage = React.lazy(() => import("@/pages/clinic/PatientsPage"));
const CustomersPage = React.lazy(() => import("@/pages/clinic/CustomersPage"));
const POSPage = React.lazy(() => import("@/pages/clinic/POSPage"));
const CRMPage = React.lazy(() => import("@/pages/clinic/CRMPage"));
const ReportsPage = React.lazy(() => import("@/pages/clinic/ReportsPage"));
const SettingsPage = React.lazy(() => import("@/pages/clinic/SettingsPage"));
const CatalogPage = React.lazy(() => import("@/pages/clinic/CatalogPage"));
const StaffPage = React.lazy(() => import("@/pages/clinic/StaffPage"));
const ProfilePage = React.lazy(() => import("@/pages/clinic/ProfilePage"));

// Admin Pages
const AdminOverviewPage = React.lazy(() => import("@/pages/admin/AdminOverviewPage"));
const AdminTenantsPage = React.lazy(() => import("@/pages/admin/AdminTenantsPage"));
const AdminBillingPage = React.lazy(() => import("@/pages/admin/AdminBillingPage"));
const AdminSupportPage = React.lazy(() => import("@/pages/admin/AdminSupportPage"));
const AdminUsersPage = React.lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminSystemPage = React.lazy(() => import("@/pages/admin/AdminSystemPage"));
const AdminPlansPage = React.lazy(() => import("@/pages/admin/AdminPlansPage"));
const AdminCrmPage = React.lazy(() => import("@/pages/admin/AdminCrmPage"));
const AdminAnalyticsPage = React.lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminLogsPage = React.lazy(() => import("@/pages/admin/AdminLogsPage"));

// Pet Owner Pages
const PetOwnerHomePage = React.lazy(() => import("@/pages/petowner/PetOwnerHomePage"));
const PetOwnerShopPage = React.lazy(() => import("@/pages/petowner/PetOwnerShopPage"));
const PetOwnerBookingPage = React.lazy(() => import("@/pages/petowner/PetOwnerBookingPage"));
const PetOwnerPetsPage = React.lazy(() => import("@/pages/petowner/PetOwnerPetsPage"));
const PetOwnerHistoryPage = React.lazy(() => import("@/pages/petowner/PetOwnerHistoryPage"));
const PetOwnerProfilePage = React.lazy(() => import("@/pages/petowner/PetOwnerProfilePage"));
const PetOwnerLoyaltyPage = React.lazy(() => import("@/pages/petowner/PetOwnerLoyaltyPage"));
// Error Pages
const NotFoundShop = React.lazy(() => import("@/pages/error/NotFoundShop"));

// Public Shop
const PublicShopPage = React.lazy(() => import("@/pages/shop/PublicShopPage"));

// ── Root Layout with Suspense ────────────────────────────────────────────────
function RootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  );
}

import { Role } from "@/types/auth";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import FeatureProtectedRoute from "@/components/shared/FeatureProtectedRoute";

import { isTenantDomain } from "@/utils/domain";

// ── Dynamic Root: renders PublicShopPage on tenant domains, LandingPage otherwise
// Using a component (not isTenantDomain() inline) ensures evaluation happens at
// render time, not at module-load time, keeping HMR and SSR-safe.
function RootRedirect() {
  return isTenantDomain() ? <PublicShopPage /> : <LandingPage />;
}

// ── Router Configuration ──────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <RootRedirect /> },
      { path: "/features/:featureId", element: <FeatureDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/admin/login", element: <AdminLoginPage /> },
      { path: "/totp-verify", element: <TotpVerify /> },
      { path: "/payment/success", element: <PaymentSuccessPage /> },
      { path: "/payment/cancel", element: <PaymentCancelPage /> },

      // ── Clinic Group (/clinic/*) ─────────────────────────────────────────
      {
        path: "/clinic",
        element: (
          <ProtectedRoute
            allowedRoles={[
              Role.ShopManager,
              Role.Receptionist,
              Role.Groomer,
              Role.Vet,
            ]}
          />
        ),
        children: [
          { path: "", element: <OwnerDashboardPage /> },
          { path: "billing", element: <DashboardPage /> },
          { path: "appointments", element: <BookingPage /> },
          {
            element: <FeatureProtectedRoute requiredFeature="hasLiveTracking" />,
            children: [
              { path: "taskboard", element: <KanbanPage /> },
            ]
          },
          { path: "patients", element: <PatientsPage /> },
          { path: "customers", element: <CustomersPage /> },
          { path: "pos", element: <POSPage /> },
          { path: "inventory", element: <InventoryPage /> },
          { path: "catalog", element: <CatalogPage /> },
          { path: "medical-records", element: <MedicalRecordPage /> },
          {
            element: <FeatureProtectedRoute requiredFeature="hasCrm" />,
            children: [
              { path: "crm", element: <CRMPage /> },
            ]
          },
          { path: "reports", element: <ReportsPage /> },
          { path: "staff", element: <StaffPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },

      // ── Pet Owner Group (/owner/*) ───────────────────────────────────────
      {
        path: "/owner",
        element: <ProtectedRoute allowedRoles={[Role.PetOwner]} />,
        children: [
          { path: "", element: <PetOwnerHomePage /> },
          { path: "shop", element: <PetOwnerShopPage /> },
          { path: "booking", element: <PetOwnerBookingPage /> },
          { path: "pets", element: <PetOwnerPetsPage /> },
          { path: "history", element: <PetOwnerHistoryPage /> },
          { path: "profile", element: <PetOwnerProfilePage /> },
          { path: "loyalty", element: <PetOwnerLoyaltyPage /> },
        ],
      },

      // ── Admin Group (/admin/*) ───────────────────────────────────────────
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={[Role.SuperAdmin, Role.PlatformStaff]} />
        ),
        children: [
          { path: "", element: <AdminOverviewPage /> },
          { path: "tenants", element: <AdminTenantsPage /> },
          { path: "billing", element: <AdminBillingPage /> },
          { path: "support", element: <AdminSupportPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "system", element: <AdminSystemPage /> },
          { path: "plans", element: <AdminPlansPage /> },
          { path: "crm", element: <AdminCrmPage /> },
          { path: "analytics", element: <AdminAnalyticsPage /> },
          { path: "logs", element: <AdminLogsPage /> },
        ],
      },

      // ── Legacy Aliases & Redirects ────────────────────────────────────────
      { path: "/dashboard/*", element: <Navigate to="/clinic" replace /> },
      { path: "/petowner/*", element: <Navigate to="/owner" replace /> },
      { path: "/my/*", element: <Navigate to="/owner" replace /> },
    ],
  },
  {
    path: "/shop-not-found",
    element: <NotFoundShop />,
  }
]);
