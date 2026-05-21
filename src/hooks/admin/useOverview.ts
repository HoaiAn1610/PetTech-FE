import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

export function useOverviewKPIs() {
  return useQuery({
    queryKey: ['admin', 'overview', 'kpis'],
    queryFn: () => adminApi.getOverviewKPIs(),
    throwOnError: false,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['admin', 'overview', 'activity'],
    queryFn: () => adminApi.getRecentActivity(10),
    refetchInterval: 60_000,
    throwOnError: false,
  });
}
