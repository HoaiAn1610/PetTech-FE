import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { CreateCampaignRequest, CampaignListParams, CreateSegmentRequest, SegmentListParams, CustomerListParams, UpdateCustomerNotesRequest } from "@/types/admin";

export function useCampaigns(params?: CampaignListParams) {
  return useQuery({
    queryKey: ['admin', 'crm', 'campaigns', params],
    queryFn: () => adminApi.getCampaigns(params),
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

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCampaign(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'crm', 'campaigns'] }); toast.success('Đã xóa campaign'); },
    onError: () => toast.error('Xóa campaign thất bại'),
  });
}

export function useExecuteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.executeCampaign(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'crm', 'campaigns'] }); toast.success('Campaign đã được chạy'); },
    onError: () => toast.error('Chạy campaign thất bại'),
  });
}

export function useSegments(params?: SegmentListParams) {
  return useQuery({
    queryKey: ['admin', 'crm', 'segments', params],
    queryFn: () => adminApi.getSegments(params),
  });
}

export function useCreateSegment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSegmentRequest) => adminApi.createSegment(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'crm', 'segments'] }); toast.success('Segment đã được tạo'); },
    onError: () => toast.error('Tạo segment thất bại'),
  });
}

export function useDeleteSegment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteSegment(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'crm', 'segments'] }); toast.success('Đã xóa segment'); },
    onError: () => toast.error('Xóa segment thất bại'),
  });
}

export function useCrmCustomers(params?: CustomerListParams) {
  return useQuery({
    queryKey: ['admin', 'crm', 'customers', params],
    queryFn: () => adminApi.getCrmCustomers(params),
  });
}

export function useUpdateCustomerNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerNotesRequest }) =>
      adminApi.updateCustomerNotes(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'crm', 'customers'] }); toast.success('Ghi chú đã được cập nhật'); },
    onError: () => toast.error('Cập nhật ghi chú thất bại'),
  });
}
