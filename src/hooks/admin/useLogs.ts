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
