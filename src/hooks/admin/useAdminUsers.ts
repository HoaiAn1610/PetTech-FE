import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { InviteAdminUserRequest, UpdateAdminUserRequest, AdminUserListParams } from "@/types/admin";

export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getAdminUsers(params),
  });
}

export function useInviteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteAdminUserRequest) => adminApi.inviteAdminUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Đã mời nhân viên quản trị thành công');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Mời nhân viên thất bại';
      toast.error(msg);
    },
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminUserRequest }) =>
      adminApi.updateAdminUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Cập nhật tài khoản thành công');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Cập nhật thất bại';
      toast.error(msg);
    },
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteAdminUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Đã xóa quyền truy cập của nhân viên');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Xóa nhân viên thất bại';
      toast.error(msg);
    },
  });
}
