import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { UpsertSystemConfigRequest } from "@/types/admin";

export function useSystemSettings(group?: string) {
  return useQuery({
    queryKey: ['admin', 'system', 'configs', group],
    queryFn: () => adminApi.getSystemConfigs(group),
  });
}

export function useUpdateSystemSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertSystemConfigRequest) => adminApi.upsertSystemConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'system'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Lưu cấu hình thất bại';
      toast.error(msg);
    },
  });
}

export function useDeleteSystemSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => adminApi.deleteSystemConfig(key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'system'] });
      toast.success('Đã xóa cấu hình');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Xóa cấu hình thất bại';
      toast.error(msg);
    },
  });
}
