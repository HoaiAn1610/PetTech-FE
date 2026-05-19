import React from "react";
import { Navigate, Outlet } from "react-router";
import { useFeature, FeatureKeys } from "@/hooks/useFeature";

interface FeatureProtectedRouteProps {
  requiredFeature: FeatureKeys;
}

export const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({
  requiredFeature,
}) => {
  const { isLoadingFeatures, ...features } = useFeature();
  
  const hasFeature = features[requiredFeature];

  // If the tenant context is still fetching features from the backend, show a loading spinner
  if (isLoadingFeatures) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Đang kiểm tra quyền truy cập tính năng...</p>
        </div>
      </div>
    );
  }

  // If the feature is not enabled for this tenant, redirect to dashboard with state
  if (!hasFeature) {
    return <Navigate to="/clinic" state={{ error: "upgrade_required" }} replace />;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default FeatureProtectedRoute;
