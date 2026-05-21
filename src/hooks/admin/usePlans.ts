import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { UpdatePlanRequest } from "@/types/admin";

export function usePlans() {
  return useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => adminApi.getPlans(),
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
