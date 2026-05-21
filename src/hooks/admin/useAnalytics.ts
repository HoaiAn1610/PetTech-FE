import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

export function usePlatformAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
}
