import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

export function usePlatformAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getPlatformAnalytics(),
    staleTime: 60_000,
  });
}
