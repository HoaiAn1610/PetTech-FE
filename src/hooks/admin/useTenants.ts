import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { TenantListParams, CreateTenantRequest, UpdateTenantRequest } from "@/types/admin";

const KEYS = {
  list: (p?: TenantListParams) => ['admin', 'tenants', p] as const,
  detail: (id: string) => ['admin', 'tenants', id] as const,
};

export function useTenants(params?: TenantListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => adminApi.getTenants(params),
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => adminApi.getTenant(id),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantRequest) => adminApi.createTenant(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'tenants'] }); toast.success('Tenant đã được tạo thành công'); },
    onError: () => toast.error('Tạo tenant thất bại'),
  });
}

export function useUpdateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantRequest }) => adminApi.updateTenant(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'tenants'] }); toast.success('Đã cập nhật tenant'); },
    onError: () => toast.error('Cập nhật tenant thất bại'),
  });
}

export function useSuspendTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.suspendTenant(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'tenants'] }); toast.success('Tenant đã bị tạm khóa'); },
    onError: () => toast.error('Không thể tạm khóa tenant'),
  });
}

export function useReactivateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.reactivateTenant(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'tenants'] }); toast.success('Tenant đã được kích hoạt lại'); },
    onError: () => toast.error('Không thể kích hoạt tenant'),
  });
}

export function useDeleteTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteTenant(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'tenants'] }); toast.success('Đã xóa tenant'); },
    onError: () => toast.error('Xóa tenant thất bại'),
  });
}
