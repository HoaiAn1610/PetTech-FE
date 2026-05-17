import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to landing page or login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to an unauthorized page or home if role not allowed
    // For now, redirect to their default home based on role
    const fallbackPath = getFallbackPath(user.role);
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

const getFallbackPath = (role: Role): string => {
  switch (role) {
    case Role.SuperAdmin:
    case Role.PlatformStaff:
      return '/admin';
    case Role.ShopManager:
    case Role.Receptionist:
    case Role.Groomer:
    case Role.Vet:
      return '/clinic';
    case Role.PetOwner:
      return '/owner';
    default:
      return '/';
  }
};

export default ProtectedRoute;
