import { useTenant } from "@/context/TenantContext";

export const useFeature = () => {
  const { features, isLoadingFeatures } = useTenant();

  return {
    isLoadingFeatures,
    hasAiAllergy: features?.aiAllergy ?? false,
    hasCrm: features?.crmAutomation ?? false,
    hasLiveTracking: features?.liveTracking ?? false,
    hasCustomDomain: features?.customDomain ?? false,
    hasApiAccess: features?.apiAccess ?? false,
  };
};

// We omit isLoadingFeatures so that Route Guards only accept actual feature flags
export type FeatureKeys = keyof Omit<ReturnType<typeof useFeature>, "isLoadingFeatures">;
