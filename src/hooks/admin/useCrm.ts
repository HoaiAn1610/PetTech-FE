import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { CreateCampaignRequest } from "@/types/admin";

export function useCampaigns() {
  return useQuery({
    queryKey: ['admin', 'crm', 'campaigns'],
    queryFn: () => adminApi.getCampaigns(),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => adminApi.createCampaign(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'crm', 'campaigns'] }); toast.success('Campaign đã được tạo'); },
    onError: () => toast.error('Tạo campaign thất bại'),
  });
}

export function useSegments() {
  return useQuery({
    queryKey: ['admin', 'crm', 'segments'],
    queryFn: () => adminApi.getSegments(),
  });
}
