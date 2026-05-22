import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { UpdatePlanRequest, CreatePlanRequest, PaginationParams } from "@/types/admin";

export function usePlans(params?: PaginationParams) {
  return useQuery({
    queryKey: ['admin', 'plans', params],
    queryFn: () => adminApi.getPlans(params),
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanRequest) => adminApi.createPlan(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); toast.success('Gói cước đã được tạo'); },
    onError: () => toast.error('Tạo gói cước thất bại'),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) => adminApi.updatePlan(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); toast.success('Gói cước đã được cập nhật'); },
    onError: () => toast.error('Cập nhật gói cước thất bại'),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deletePlan(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); toast.success('Đã xóa gói cước'); },
    onError: () => toast.error('Xóa gói cước thất bại'),
  });
}

export function useUpdatePlanStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.updatePlanStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      await qc.cancelQueries({ queryKey: ['admin', 'plans'] });
      const previous = qc.getQueriesData({ queryKey: ['admin', 'plans'] });
      qc.setQueriesData({ queryKey: ['admin', 'plans'] }, (old: any) => {
        if (!old?.items) return old;
        return { ...old, items: old.items.map((p: any) => p.id === id ? { ...p, isActive } : p) };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        ctx.previous.forEach(([key, val]) => qc.setQueryData(key, val));
      }
      toast.error('Cập nhật trạng thái gói thất bại');
    },
    onSuccess: () => toast.success('Trạng thái gói đã được cập nhật'),
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  });
}
