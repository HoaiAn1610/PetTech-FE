import { useTenant } from "@/context/TenantContext";

export const useFeature = () => {
  const { features } = useTenant();

  return {
    // Mapping the database features to easy-to-use boolean flags
    hasCrm: !!features?.crmAutomation,
    hasAiAllergy: !!features?.aiAllergy,
    hasLiveTracking: !!features?.liveTracking,
  };
};

export type FeatureKeys = keyof ReturnType<typeof useFeature>;
