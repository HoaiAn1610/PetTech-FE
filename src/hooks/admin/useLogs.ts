import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { ActivityLogParams } from "@/types/admin";

export function useActivityLogs(params?: ActivityLogParams) {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: () => adminApi.getActivityLogs(params),
  });
}
