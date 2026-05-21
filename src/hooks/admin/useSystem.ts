import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { SystemSettings } from "@/types/admin";

export function useSystemSettings() {
  return useQuery({
    queryKey: ['admin', 'system'],
    queryFn: () => adminApi.getSystemSettings(),
    throwOnError: false,
  });
}

export function useUpdateSystemSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) => adminApi.updateSystemSettings(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'system'] }); toast.success('Cài đặt hệ thống đã được lưu'); },
    onError: () => toast.error('Lưu cài đặt thất bại'),
  });
}
